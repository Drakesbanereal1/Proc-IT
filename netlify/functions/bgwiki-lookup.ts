/**
 * Netlify Function: BGWiki Weapon Lookup
 *
 * Server-side proxy to bg-wiki.com — no CORS issues.
 * Results cached in Netlify Blobs for 24 hours.
 *
 * GET /.netlify/functions/bgwiki-lookup?weapon=Verethragna
 * GET /.netlify/functions/bgwiki-lookup?weapon=Verethragna&weaponType=Hand-to-Hand
 *
 * Response: { success: true, item: GearItem } | { success: false, error: string }
 */

import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import type { GearItem, WeaponType, JobCode, GearSlot } from '../../data/gear/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const BGWIKI_API   = 'https://www.bg-wiki.com/ffxi/api.php';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const USER_AGENT   = 'FFXI-Proc-IT/1.0 (gear tracker; educational use)';

const VALID_JOB_CODES = new Set([
  'WAR','MNK','WHM','BLM','RDM','THF','PLD','DRK','BST','BRD',
  'RNG','SAM','NIN','DRG','SMN','BLU','COR','PUP','DNC','SCH','GEO','RUN',
]);

// ─── Caching ──────────────────────────────────────────────────────────────────

interface CachedEntry {
  item: GearItem;
  cachedAt: number;
}

async function getCached(key: string): Promise<GearItem | null> {
  try {
    const store = getStore('bgwiki-cache');
    const raw = await store.get(key, { type: 'json' }) as CachedEntry | null;
    if (!raw) return null;
    if (Date.now() - raw.cachedAt > CACHE_TTL_MS) {
      store.delete(key).catch(() => {});
      return null;
    }
    return raw.item;
  } catch {
    return null;
  }
}

async function setCache(key: string, item: GearItem): Promise<void> {
  try {
    const store = getStore('bgwiki-cache');
    const entry: CachedEntry = { item, cachedAt: Date.now() };
    await store.set(key, JSON.stringify(entry));
  } catch {
    // Cache failure is non-fatal
  }
}

// ─── BGWiki Fetching ──────────────────────────────────────────────────────────

async function fetchWikitext(pageTitle: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'parse',
    page: pageTitle,
    format: 'json',
    prop: 'wikitext',
  });
  try {
    const res = await fetch(`${BGWIKI_API}?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    const data = await res.json() as any;
    if (data.error) return null;
    return data.parse?.wikitext?.['*'] ?? null;
  } catch {
    return null;
  }
}

async function fetchHTML(pageTitle: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'parse',
    page: pageTitle,
    format: 'json',
    prop: 'text',
    origin: '*',
  });
  try {
    const res = await fetch(`${BGWIKI_API}?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    const data = await res.json() as any;
    if (data.error) return null;
    return data.parse?.text?.['*'] ?? null;
  } catch {
    return null;
  }
}

// ─── Wikitext Parser ──────────────────────────────────────────────────────────
// Parses BGWiki infobox templates for base weapon data.
// BGWiki uses several template names; we try the most common ones.

interface WikitextData {
  damage?:    number;
  delay?:     number;
  jobs?:      JobCode[];
  level?:     number;
  itemLevel?: number;
  weaponType?: WeaponType;
  slot?:      GearSlot;
}

function parseWikitext(wikitext: string): WikitextData {
  const result: WikitextData = {};

  // ── DMG / Delay ──────────────────────────────────────────────────────────
  // Infobox fields: |damage=89 or |dmg=89
  const dmgMatch = wikitext.match(/\|\s*(?:damage|dmg)\s*=\s*(\d+)/i);
  if (dmgMatch) result.damage = parseInt(dmgMatch[1]);

  const delayMatch = wikitext.match(/\|\s*delay\s*=\s*(\d+)/i);
  if (delayMatch) result.delay = parseInt(delayMatch[1]);

  // ── Item Level ────────────────────────────────────────────────────────────
  const ilvlMatch = wikitext.match(/\|\s*(?:ilvl|item[_\s]level|ilevel)\s*=\s*(\d+)/i);
  if (ilvlMatch) result.itemLevel = parseInt(ilvlMatch[1]);

  // ── Equip Level ───────────────────────────────────────────────────────────
  const lvlMatch = wikitext.match(/\|\s*(?:level|lv|equip[_\s]level)\s*=\s*(\d+)/i);
  if (lvlMatch) result.level = parseInt(lvlMatch[1]);

  // ── Weapon Type / Skill ───────────────────────────────────────────────────
  // |skill=Hand-to-Hand or |type=Katana or |wtype=Great Sword
  const typeMatch = wikitext.match(/\|\s*(?:skill|type|wtype|weapon[_\s]type)\s*=\s*([^\|\n\r]+)/i);
  if (typeMatch) {
    result.weaponType = normalizeWeaponType(typeMatch[1].trim());
  }

  // ── Jobs ──────────────────────────────────────────────────────────────────
  // |jobs=WAR/MNK or |jobs=WAR MNK THF or |jobs=All Jobs
  const jobsMatch = wikitext.match(/\|\s*jobs\s*=\s*([^\|\n\r\}]+)/i);
  if (jobsMatch) {
    const rawJobs = jobsMatch[1];
    if (/all\s*jobs/i.test(rawJobs)) {
      result.jobs = [...VALID_JOB_CODES] as JobCode[];
    } else {
      result.jobs = rawJobs
        .split(/[\s\/,]+/)
        .map(j => j.trim().toUpperCase())
        .filter(j => VALID_JOB_CODES.has(j)) as JobCode[];
    }
  }

  // ── Slot detection from template name ────────────────────────────────────
  if (/range/i.test(wikitext.substring(0, 500))) {
    result.slot = 'range';
  }

  return result;
}

// ─── HTML Parser ─────────────────────────────────────────────────────────────
// Extracts GearStats from rendered BGWiki HTML.
// BGWiki's HTML has stat text in infobox table cells and description areas.

interface ParsedStats {
  damage?:    number;
  delay?:     number;
  defense?:   number;
  jobs?:      JobCode[];
  level?:     number;
  itemLevel?: number;
  weaponType?: WeaponType;
  slot?:      GearSlot;
  stats:      Partial<Record<string, number>>;
}

function parseHTML(html: string): ParsedStats {
  // Strip tags for easier text parsing
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ');

  const result: ParsedStats = { stats: {} };

  // ── DMG / Delay ──────────────────────────────────────────────────────────
  const dmgMatch = text.match(/DMG[:\s]+(\d+)/i);
  if (dmgMatch) result.damage = parseInt(dmgMatch[1]);

  const delayMatch = text.match(/Delay[:\s]+(\d+)/i);
  if (delayMatch) result.delay = parseInt(delayMatch[1]);

  // ── Defense ───────────────────────────────────────────────────────────────
  const defMatch = text.match(/DEF[:\s]+(\d+)/i);
  if (defMatch) result.defense = parseInt(defMatch[1]);

  // ── Item Level ────────────────────────────────────────────────────────────
  const ilvlMatch = text.match(/Item\s+Level[:\s]+(\d+)/i);
  if (ilvlMatch) result.itemLevel = parseInt(ilvlMatch[1]);

  // ── Level ─────────────────────────────────────────────────────────────────
  const lvlMatch = text.match(/Lv\.\s*(\d+)/);
  if (lvlMatch) result.level = parseInt(lvlMatch[1]);

  // ── Jobs ──────────────────────────────────────────────────────────────────
  // BGWiki lists jobs in a row like: "WAR MNK RDM ..."
  const jobsMatch = text.match(/Jobs?[:\s]+([A-Z]{3}(?:[\s\/]+[A-Z]{3})*)/);
  if (jobsMatch) {
    if (/all\s*jobs/i.test(jobsMatch[1])) {
      result.jobs = [...VALID_JOB_CODES] as JobCode[];
    } else {
      result.jobs = jobsMatch[1]
        .split(/[\s\/]+/)
        .map(j => j.trim().toUpperCase())
        .filter(j => VALID_JOB_CODES.has(j)) as JobCode[];
    }
  }

  // ── Weapon type from Skill line ───────────────────────────────────────────
  const skillMatch = text.match(/Skill[:\s]+([A-Za-z\-]+(?:\s[A-Za-z\-]+)?)/i);
  if (skillMatch) {
    result.weaponType = normalizeWeaponType(skillMatch[1].trim());
  }

  // ── Stats — comprehensive patterns ───────────────────────────────────────
  // Handles both "+20" and "20" values; negative values for DT etc.
  const statPatterns: Array<{ regex: RegExp; key: string; negate?: boolean }> = [
    // Attributes
    { regex: /\bHP[:\s]+\+?(\d+)/i,             key: 'hp' },
    { regex: /\bMP[:\s]+\+?(\d+)/i,             key: 'mp' },
    { regex: /\bSTR[:\s]+\+?(\d+)/i,            key: 'str' },
    { regex: /\bDEX[:\s]+\+?(\d+)/i,            key: 'dex' },
    { regex: /\bVIT[:\s]+\+?(\d+)/i,            key: 'vit' },
    { regex: /\bAGI[:\s]+\+?(\d+)/i,            key: 'agi' },
    { regex: /\bINT[:\s]+\+?(\d+)/i,            key: 'int' },
    { regex: /\bMND[:\s]+\+?(\d+)/i,            key: 'mnd' },
    { regex: /\bCHR[:\s]+\+?(\d+)/i,            key: 'chr' },
    // Melee
    { regex: /\bAccuracy[:\s]+\+?(\d+)/i,       key: 'accuracy' },
    { regex: /\bAttack[:\s]+\+?(\d+)/i,         key: 'attack' },
    // Ranged
    { regex: /Ranged\s+Accuracy[:\s]+\+?(\d+)/i, key: 'rangedAccuracy' },
    { regex: /Ranged\s+Attack[:\s]+\+?(\d+)/i,   key: 'rangedAttack' },
    { regex: /Ranged\s+Store\s+TP[:\s]+\+?(\d+)/i, key: 'rangedStoreTP' },
    { regex: /Snap\s*Shot[:\s]+\+?(\d+)/i,      key: 'snapShot' },
    { regex: /Rapid\s*Shot[:\s]+\+?(\d+)/i,     key: 'rapidShot' },
    // Magic
    { regex: /Magic\s+Accuracy[:\s]+\+?(\d+)/i, key: 'magicAccuracy' },
    { regex: /Magic\s+Attack\s+Bonus[:\s]+\+?(\d+)/i, key: 'magicAttackBonus' },
    { regex: /Magic\s+Burst\s+Damage[:\s]+\+?(\d+)%?/i, key: 'magicBurstDamage' },
    { regex: /Magic\s+Defense\s+Bonus[:\s]+\+?(\d+)/i, key: 'magicDefenseBonus' },
    // Multi-attack
    { regex: /Double\s+Attack[:\s]+\+?(\d+)%?/i,    key: 'doubleAttack' },
    { regex: /Triple\s+Attack[:\s]+\+?(\d+)%?/i,    key: 'tripleAttack' },
    { regex: /Quadruple\s+Attack[:\s]+\+?(\d+)%?/i, key: 'quadAttack' },
    // TP / WS
    { regex: /\bHaste[:\s]+\+?(\d+)%?/i,        key: 'haste' },
    { regex: /Store\s+TP[:\s]+\+?(\d+)/i,       key: 'storeTP' },
    { regex: /Dual\s+Wield[:\s]+\+?(\d+)/i,     key: 'dualWield' },
    { regex: /TP\s+Bonus[:\s]+\+?(\d+)/i,       key: 'tpBonus' },
    { regex: /Weapon\s+[Ss]kill\s+[Dd]amage[:\s]+\+?(\d+)%?/i, key: 'weaponSkillDamage' },
    { regex: /Skillchain\s+Damage[:\s]+\+?(\d+)%?/i, key: 'skillchainDamage' },
    // Crit
    { regex: /Critical\s+Hit\s+Rate[:\s]+\+?(\d+)%?/i, key: 'critRate' },
    { regex: /Critical\s+Hit\s+Damage[:\s]+\+?(\d+)%?/i, key: 'critDamage' },
    // Subtle Blow
    { regex: /Subtle\s+Blow\s+II[:\s]+\+?(\d+)/i, key: 'subtleBlowII' },
    { regex: /Subtle\s+Blow[:\s]+\+?(\d+)/i,     key: 'subtleBlow' },
    // Defense / mitigation
    { regex: /Damage\s+Taken[:\s]+-(\d+)%?/i,     key: 'dt' },
    { regex: /Physical\s+Damage\s+Taken[:\s]+-(\d+)%?/i, key: 'pdt' },
    { regex: /Magic\s+Damage\s+Taken[:\s]+-(\d+)%?/i,    key: 'mdt' },
    { regex: /\bEvasion[:\s]+\+?(\d+)/i,          key: 'evasion' },
    { regex: /Magic\s+Evasion[:\s]+\+?(\d+)/i,    key: 'magicEvasion' },
    { regex: /\bGuard[:\s]+\+?(\d+)/i,            key: 'guard' },
    { regex: /\bParry[:\s]+\+?(\d+)/i,            key: 'parry' },
    { regex: /\bCounter[:\s]+\+?(\d+)%?/i,        key: 'counter' },
    { regex: /\bEnmity[:\s]+(-?\d+)/i,            key: 'enmity' },
    { regex: /Spell\s+Interruption[:\s]+\+?(\d+)%?/i, key: 'spellInterruptDown' },
    // Magic support
    { regex: /Fast\s+Cast[:\s]+\+?(\d+)%?/i,     key: 'fastCast' },
    { regex: /Conserve\s+MP[:\s]+\+?(\d+)%?/i,   key: 'conserveMP' },
    { regex: /Cure\s+Potency\s+Received[:\s]+\+?(\d+)%?/i, key: 'curePotencyReceived' },
    { regex: /Cure\s+Potency[:\s]+\+?(\d+)%?/i,  key: 'curePotency' },
    // Job-specific
    { regex: /Kick\s+Attacks[:\s]+\+?(\d+)/i,    key: 'kickAttacks' },
    { regex: /Song\s+Duration[:\s]+\+?(\d+)/i,   key: 'songDuration' },
    { regex: /Singing\s+Skill[:\s]+\+?(\d+)/i,   key: 'singingSkill' },
    { regex: /Instrument\s+Skill[:\s]+\+?(\d+)/i,key: 'instrumentSkill' },
    { regex: /Geomancy\s+Skill[:\s]+\+?(\d+)/i,  key: 'geomancySkill' },
    { regex: /Indi\s+Duration[:\s]+\+?(\d+)/i,   key: 'indiDuration' },
    { regex: /Blue\s+Magic\s+Skill[:\s]+\+?(\d+)/i, key: 'blueMagicSkill' },
    { regex: /Quick\s+Draw[:\s]+\+?(\d+)/i,      key: 'quickDrawBonus' },
    { regex: /Treasure\s+Hunter[:\s]+\+?(\d+)/i, key: 'treasureHunter' },
    // Drain / Aspir
    { regex: /Drain[:\s]+\+?(\d+)/i,             key: 'drainBonus' },
    { regex: /Aspir[:\s]+\+?(\d+)/i,             key: 'aspirBonus' },
  ];

  for (const { regex, key } of statPatterns) {
    const m = text.match(regex);
    if (m) {
      result.stats[key] = parseInt(m[1]);
    }
  }

  return result;
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizeWeaponType(raw: string): WeaponType | undefined {
  const map: Record<string, WeaponType> = {
    'hand-to-hand': 'Hand-to-Hand',
    'h2h':          'Hand-to-Hand',
    'handtohand':   'Hand-to-Hand',
    'dagger':       'Dagger',
    'sword':        'Sword',
    'great sword':  'Great Sword',
    'greatsword':   'Great Sword',
    'axe':          'Axe',
    'great axe':    'Great Axe',
    'greataxe':     'Great Axe',
    'scythe':       'Scythe',
    'polearm':      'Polearm',
    'katana':       'Katana',
    'great katana': 'Great Katana',
    'greatkatana':  'Great Katana',
    'club':         'Club',
    'staff':        'Staff',
    'archery':      'Archery',
    'bow':          'Archery',
    'marksmanship': 'Marksmanship',
    'gun':          'Marksmanship',
    'crossbow':     'Crossbow',
    'throwing':     'Throwing',
    'instrument':   'Instrument',
  };
  return map[raw.toLowerCase().trim()] as WeaponType | undefined;
}

function normalizeSlot(weaponType?: WeaponType): GearSlot {
  if (!weaponType) return 'main';
  if (weaponType === 'Archery' || weaponType === 'Marksmanship' || weaponType === 'Crossbow') {
    return 'range';
  }
  if (weaponType === 'Instrument') return 'range';
  return 'main';
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Merge + Build GearItem ───────────────────────────────────────────────────

function buildGearItem(
  name: string,
  wt: WikitextData,
  ht: ParsedStats,
  weaponTypeHint?: WeaponType
): GearItem {
  const weaponType = wt.weaponType ?? ht.weaponType ?? weaponTypeHint;
  const damage     = wt.damage    ?? ht.damage;
  const delay      = wt.delay     ?? ht.delay;
  const jobs       = (wt.jobs?.length ? wt.jobs : ht.jobs) ?? ['WAR' as JobCode];
  const level      = wt.level     ?? ht.level  ?? 99;
  const itemLevel  = wt.itemLevel ?? ht.itemLevel;
  const slot       = wt.slot      ?? ht.slot   ?? normalizeSlot(weaponType);

  const item: GearItem = {
    id:       slugify(name),
    name,
    category: damage ? 'weapon' : 'armor',
    slot,
    jobs,
    level,
    itemLevel,
    stats:    ht.stats as any,
    source:   'Various' as any,
    bgwikiUrl: `https://www.bg-wiki.com/ffxi/${encodeURIComponent(name.replace(/ /g, '_'))}`,
    endgame:  itemLevel !== undefined && itemLevel >= 119,
  };

  if (weaponType) item.weaponType = weaponType;

  if (damage && delay) {
    item.weapon = { damage, delay };
  }

  if (ht.defense) {
    (item.stats as any).defense = ht.defense;
  }

  return item;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-store',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'GET only' }) };
  }

  const rawWeapon    = event.queryStringParameters?.weapon ?? '';
  const weaponTypeHint = event.queryStringParameters?.weaponType as WeaponType | undefined;

  const weaponName = rawWeapon.trim();
  if (!weaponName || weaponName.length > 100) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: 'Missing or invalid weapon name' }),
    };
  }

  // Check cache first
  const cacheKey = slugify(weaponName);
  const cached = await getCached(cacheKey);
  if (cached) {
    return {
      statusCode: 200,
      headers: { ...headers, 'X-Cache': 'HIT' },
      body: JSON.stringify({ success: true, item: cached }),
    };
  }

  // Fetch wikitext + HTML in parallel
  const pageTitle = weaponName.replace(/ /g, '_');
  const [wikitext, html] = await Promise.all([
    fetchWikitext(pageTitle),
    fetchHTML(pageTitle),
  ]);

  if (!html && !wikitext) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: `Page not found on BGWiki: ${weaponName}` }),
    };
  }

  const wtData = wikitext ? parseWikitext(wikitext) : {};
  const htData = html     ? parseHTML(html)          : { stats: {} };

  const item = buildGearItem(weaponName, wtData, htData, weaponTypeHint);

  // Must have a name to be valid
  if (!item.name) {
    return {
      statusCode: 422,
      headers,
      body: JSON.stringify({ success: false, error: `Could not parse item data for: ${weaponName}` }),
    };
  }

  // Cache and return
  await setCache(cacheKey, item);

  return {
    statusCode: 200,
    headers: { ...headers, 'X-Cache': 'MISS' },
    body: JSON.stringify({ success: true, item }),
  };
};
