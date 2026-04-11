// ─── Slot / Weapon / Job enums ───────────────────────────────────────────────

export type GearSlot =
  | "main"
  | "sub"
  | "range"
  | "ammo"
  | "head"
  | "body"
  | "hands"
  | "legs"
  | "feet"
  | "neck"
  | "waist"
  | "back"
  | "left_ear"
  | "right_ear"
  | "left_ring"
  | "right_ring";

export type WeaponType =
  | "Hand-to-Hand"
  | "Dagger"
  | "Sword"
  | "Great Sword"
  | "Axe"
  | "Great Axe"
  | "Scythe"
  | "Polearm"
  | "Katana"
  | "Great Katana"
  | "Club"
  | "Staff"
  | "Archery"
  | "Marksmanship"
  | "Throwing"
  | "Shield";

export type JobCode =
  | "WAR" | "MNK" | "WHM" | "BLM" | "RDM" | "THF"
  | "PLD" | "DRK" | "BST" | "BRD" | "RNG" | "SAM"
  | "NIN" | "DRG" | "SMN" | "BLU" | "COR" | "PUP"
  | "DNC" | "SCH" | "GEO" | "RUN";

export type UpgradeTier = "NQ" | "+1" | "+2" | "+3" | "+4";

export type GearCategory = "weapon" | "shield" | "armor" | "accessory";

export type ItemSource =
  | "Relic"
  | "Mythic"
  | "Empyrean"
  | "Aeonic"
  | "Prime"
  | "Ambuscade"
  | "Escha"
  | "Sortie"
  | "Dynamis"
  | "Voidwatch"
  | "Abyssea"
  | "Crafted"
  | "Domain Invasion"
  | "Various";

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface WeaponStats {
  damage: number;
  delay: number;
  /** D/Delay as a decimal, auto-calculated if omitted */
  ratio?: number;
}

export interface GearStats {
  // ── Base attributes ──────────────────────────────────────────────────────
  hp?: number;
  mp?: number;
  str?: number;
  dex?: number;
  vit?: number;
  agi?: number;
  int?: number;
  mnd?: number;
  chr?: number;

  // ── Melee accuracy / damage ───────────────────────────────────────────────
  accuracy?: number;
  attack?: number;

  // ── Ranged accuracy / damage ─────────────────────────────────────────────
  rangedAccuracy?: number;
  rangedAttack?: number;
  /** Store TP from ranged attacks */
  rangedStoreTP?: number;
  /** Snap Shot % — reduces ranged attack animation delay */
  snapShot?: number;
  /** Rapid Shot % — chance to skip ranged attack delay entirely */
  rapidShot?: number;

  // ── Magic offense ─────────────────────────────────────────────────────────
  magicAccuracy?: number;
  magicAttackBonus?: number;
  /** Magic Burst Damage % bonus */
  magicBurstDamage?: number;
  /** Magic Burst Damage II % bonus (stacks separately) */
  magicBurstDamageII?: number;
  /** Magic Defense Bonus — reduces magic damage taken */
  magicDefenseBonus?: number;

  // ── Multi-attack ──────────────────────────────────────────────────────────
  /** Double Attack % chance */
  doubleAttack?: number;
  /** Triple Attack % chance */
  tripleAttack?: number;
  /** Quadruple Attack % chance */
  quadAttack?: number;

  // ── TP & weapon skill ─────────────────────────────────────────────────────
  haste?: number;
  storeTP?: number;
  dualWield?: number;
  /** TP bonus on weapon skill (e.g. Moonshade Earring +250) */
  tpBonus?: number;
  /** Weapon Skill Damage % */
  weaponSkillDamage?: number;
  /** Skillchain Damage % */
  skillchainDamage?: number;

  // ── Critical hits ─────────────────────────────────────────────────────────
  critRate?: number;
  critDamage?: number;

  // ── Subtle Blow ───────────────────────────────────────────────────────────
  /** Subtle Blow % — reduces TP given to enemy on hit */
  subtleBlow?: number;
  /** Subtle Blow II % (stacks separately) */
  subtleBlowII?: number;

  // ── Defense / mitigation ─────────────────────────────────────────────────
  defense?: number;
  evasion?: number;
  magicEvasion?: number;
  /** Damage Taken % reduction (all) */
  dt?: number;
  /** Physical Damage Taken % reduction */
  pdt?: number;
  /** Magic Damage Taken % reduction */
  mdt?: number;
  /** Guard skill bonus (MNK) */
  guard?: number;
  /** Parry skill bonus (PLD/RUN/NIN) */
  parry?: number;
  /** Counter chance % (MNK/RUN) */
  counter?: number;
  /** Counter damage bonus */
  counterDamage?: number;
  /** Spell interruption rate down % */
  spellInterruptDown?: number;
  enmity?: number;

  // ── Magic / support ───────────────────────────────────────────────────────
  fastCast?: number;
  /** Conserve MP % chance */
  conserveMP?: number;
  /** Cure Potency % bonus */
  curePotency?: number;
  /** Cure Potency Received % bonus */
  curePotencyReceived?: number;

  // ── Job-specific: MNK ────────────────────────────────────────────────────
  /** Kick Attacks — adds hits to H2H combo */
  kickAttacks?: number;

  // ── Job-specific: DRK ────────────────────────────────────────────────────
  /** Drain spell bonus damage */
  drainBonus?: number;
  /** Aspir spell bonus drain */
  aspirBonus?: number;

  // ── Job-specific: BRD ────────────────────────────────────────────────────
  /** Song effect duration bonus (seconds or %) */
  songDuration?: number;
  /** Singing skill bonus */
  singingSkill?: number;
  /** Wind/String instrument skill bonus */
  instrumentSkill?: number;

  // ── Job-specific: GEO ────────────────────────────────────────────────────
  /** Geomancy skill bonus */
  geomancySkill?: number;
  /** Indi-spell duration bonus */
  indiDuration?: number;

  // ── Job-specific: BLU ────────────────────────────────────────────────────
  /** Blue Magic skill bonus */
  blueMagicSkill?: number;

  // ── Job-specific: COR ────────────────────────────────────────────────────
  /** Quick Draw damage bonus */
  quickDrawBonus?: number;

  // ── Utility ───────────────────────────────────────────────────────────────
  /** Treasure Hunter tier added */
  treasureHunter?: number;
  /** Raw text for augments or special effects not captured above */
  notes?: string;
}

// ─── Core GearItem ────────────────────────────────────────────────────────────

export interface GearItem {
  /** Unique slug, e.g. "verethragna" or "adhemar-bonnet-p1" */
  id: string;
  name: string;
  category: GearCategory;
  slot: GearSlot;
  weaponType?: WeaponType;
  /** Jobs that can equip this item */
  jobs: JobCode[];
  /** Equip level (classic) */
  level: number;
  /** Item level (modern, 119 era+) */
  itemLevel?: number;
  upgradeTier?: UpgradeTier;
  /** Base weapon stats (weapons only) */
  weapon?: WeaponStats;
  stats: GearStats;
  description?: string;
  source?: ItemSource;
  /** Additional searchable tags */
  tags?: string[];
  /** Whether this is a recommended comparison/endgame piece */
  endgame?: boolean;
}

// ─── Compare result ───────────────────────────────────────────────────────────

export type StatDiff = {
  stat: keyof GearStats;
  a: number;
  b: number;
  delta: number; // b - a, positive means b is better
};

export type CompareMode =
  | "TP"
  | "WS"
  | "Tank"
  | "Idle"
  | "MagicAccuracy"
  | "FastCast"
  | "Ranged"
  | "Support"
  | "All";
