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
  hp?: number;
  mp?: number;
  str?: number;
  dex?: number;
  vit?: number;
  agi?: number;
  int?: number;
  mnd?: number;
  chr?: number;
  accuracy?: number;
  attack?: number;
  rangedAccuracy?: number;
  rangedAttack?: number;
  magicAccuracy?: number;
  magicAttackBonus?: number;
  defense?: number;
  evasion?: number;
  magicEvasion?: number;
  /** % haste (positive = faster) */
  haste?: number;
  storeTP?: number;
  dualWield?: number;
  fastCast?: number;
  /** Damage taken % reduction */
  dt?: number;
  /** Physical damage taken % reduction */
  pdt?: number;
  /** Magic damage taken % reduction */
  mdt?: number;
  enmity?: number;
  curePotency?: number;
  weaponSkillDamage?: number;
  /** TP bonus on weapon skill */
  tpBonus?: number;
  /** Critical hit rate % */
  critRate?: number;
  /** Critical hit damage % */
  critDamage?: number;
  /** Spell interruption rate down % */
  spellInterruptDown?: number;
  /** Store TP from ranged */
  rangedStoreTP?: number;
  /** Snap Shot % */
  snapShot?: number;
  /** Rapid Shot % */
  rapidShot?: number;
  /** Subtle Blow % */
  subtleBlow?: number;
  /** Treasure Hunter tier added */
  treasureHunter?: number;
  /** Raw additional stat text for augments / special effects */
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
  | "All";
