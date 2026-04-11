import type {
  GearItem,
  GearSlot,
  JobCode,
  WeaponType,
  GearCategory,
  GearStats,
  StatDiff,
  CompareMode,
  ItemSource,
} from './types';
import { WEAPONS } from './weapons';
import { SHIELDS } from './shields';
import { ARMOR } from './armor';
import { ACCESSORIES } from './accessories';

// ─── Master dataset ───────────────────────────────────────────────────────────

export const ALL_GEAR: GearItem[] = [
  ...WEAPONS,
  ...SHIELDS,
  ...ARMOR,
  ...ACCESSORIES,
];

// ─── Filtering ────────────────────────────────────────────────────────────────

/** All items equippable by a given job */
export function filterByJob(job: JobCode): GearItem[] {
  return ALL_GEAR.filter(item => item.jobs.includes(job));
}

/** All items for a given slot */
export function filterBySlot(slot: GearSlot): GearItem[] {
  return ALL_GEAR.filter(item => item.slot === slot);
}

/** Items for a job AND slot */
export function filterByJobAndSlot(job: JobCode, slot: GearSlot): GearItem[] {
  return ALL_GEAR.filter(item => item.slot === slot && item.jobs.includes(job));
}

/** Items by category */
export function filterByCategory(category: GearCategory): GearItem[] {
  return ALL_GEAR.filter(item => item.category === category);
}

/** Items by weapon type */
export function filterByWeaponType(weaponType: WeaponType): GearItem[] {
  return ALL_GEAR.filter(item => item.weaponType === weaponType);
}

/** Items by source (Relic, Mythic, Ambuscade, etc.) */
export function filterBySource(source: ItemSource): GearItem[] {
  return ALL_GEAR.filter(item => item.source === source);
}

/** Endgame-flagged items only */
export function endgameOnly(): GearItem[] {
  return ALL_GEAR.filter(item => item.endgame === true);
}

/** Full text search across name, tags, source */
export function searchGear(query: string): GearItem[] {
  const q = query.toLowerCase();
  return ALL_GEAR.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.tags?.some(t => t.includes(q)) ||
    item.source?.toLowerCase().includes(q)
  );
}

// ─── Comparison ───────────────────────────────────────────────────────────────

const NUMERIC_STATS: (keyof GearStats)[] = [
  "hp","mp","str","dex","vit","agi","int","mnd","chr",
  "accuracy","attack","rangedAccuracy","rangedAttack",
  "magicAccuracy","magicAttackBonus","defense","evasion","magicEvasion",
  "haste","storeTP","dualWield","fastCast","dt","pdt","mdt",
  "enmity","curePotency","weaponSkillDamage","tpBonus",
  "critRate","critDamage","spellInterruptDown","rangedStoreTP",
  "snapShot","rapidShot","subtleBlow","treasureHunter",
];

/**
 * Compare two items stat-by-stat.
 * Returns only stats where at least one item has a non-zero value.
 * delta = b - a (positive means b wins that stat).
 */
export function compareItems(a: GearItem, b: GearItem): StatDiff[] {
  return NUMERIC_STATS.reduce<StatDiff[]>((acc, stat) => {
    const aVal = (a.stats[stat] as number | undefined) ?? 0;
    const bVal = (b.stats[stat] as number | undefined) ?? 0;
    if (aVal !== 0 || bVal !== 0) {
      acc.push({ stat, a: aVal, b: bVal, delta: bVal - aVal });
    }
    return acc;
  }, []);
}

// ─── Compare mode stat priority maps ─────────────────────────────────────────

/**
 * Stat weights per CompareMode.
 * Higher weight = more important for that play style.
 */
const MODE_WEIGHTS: Record<CompareMode, Partial<Record<keyof GearStats, number>>> = {
  TP: {
    accuracy: 3, attack: 2, storeTP: 4, haste: 5, dualWield: 3, str: 1, dex: 1,
  },
  WS: {
    str: 3, dex: 2, weaponSkillDamage: 5, tpBonus: 4, accuracy: 2, attack: 3,
    critRate: 3, critDamage: 3,
  },
  Tank: {
    hp: 3, vit: 2, defense: 2, dt: 5, pdt: 4, mdt: 4, enmity: 3,
    magicEvasion: 2, evasion: 2, spellInterruptDown: 2,
  },
  Idle: {
    hp: 4, mp: 3, dt: 5, pdt: 4, mdt: 4, haste: 3, defense: 2,
  },
  MagicAccuracy: {
    magicAccuracy: 5, int: 3, mnd: 3, magicAttackBonus: 3, fastCast: 2,
  },
  FastCast: {
    fastCast: 5, haste: 3, spellInterruptDown: 2, magicAccuracy: 1,
  },
  All: Object.fromEntries(NUMERIC_STATS.map(s => [s, 1])) as Partial<Record<keyof GearStats, number>>,
};

/**
 * Score a single item for a given compare mode.
 * Useful for sorting a list by "best for TP" etc.
 */
export function scoreItem(item: GearItem, mode: CompareMode): number {
  const weights = MODE_WEIGHTS[mode];
  return NUMERIC_STATS.reduce((total, stat) => {
    const weight = (weights as Record<string, number>)[stat] ?? 0;
    const value = (item.stats[stat] as number | undefined) ?? 0;
    return total + weight * value;
  }, 0);
}

/**
 * Get top N items for a job+slot combination, sorted by score for a mode.
 */
export function getBestGear(
  job: JobCode,
  slot: GearSlot,
  mode: CompareMode,
  topN = 5
): GearItem[] {
  return filterByJobAndSlot(job, slot)
    .map(item => ({ item, score: scoreItem(item, mode) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ item }) => item);
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getItemById(id: string): GearItem | undefined {
  return ALL_GEAR.find(item => item.id === id);
}

export function getItemByName(name: string): GearItem | undefined {
  return ALL_GEAR.find(item => item.name.toLowerCase() === name.toLowerCase());
}

/** All unique slots present in the dataset */
export function allSlots(): GearSlot[] {
  return [...new Set(ALL_GEAR.map(item => item.slot))];
}

/** All unique weapon types in the dataset */
export function allWeaponTypes(): WeaponType[] {
  return [...new Set(
    ALL_GEAR.filter(item => item.weaponType).map(item => item.weaponType!)
  )];
}
