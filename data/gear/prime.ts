import type { GearItem } from './types';

/**
 * Prime Weapons — newest weapon tier, obtained via Odyssey/Segault content.
 * Augmentable. Stats approximate — verify individual pages on BGWiki.
 *
 * Full list: https://www.bg-wiki.com/ffxi/Category:Prime_Weapons
 */
export const PRIME_WEAPONS: GearItem[] = [

  // ── Hand-to-Hand ────────────────────────────────────────────────────────────
  {
    id: "varga-purnikawa",
    name: "Varga Purnikawa",
    category: "weapon", slot: "main", weaponType: "Hand-to-Hand",
    jobs: ["MNK", "PUP"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true,
    weapon: { damage: 90, delay: 480 },
    stats: { str: 35, dex: 25, accuracy: 60, attack: 60, storeTP: 10, weaponSkillDamage: 8 },
    tags: ["prime", "h2h", "mnk", "pup"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Varga_Purnikawa",
  },

  // ── Dagger ──────────────────────────────────────────────────────────────────
  {
    id: "mpu-gandring",
    name: "Mpu Gandring",
    category: "weapon", slot: "main", weaponType: "Dagger",
    jobs: ["RDM", "THF", "BRD", "DNC"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true,
    weapon: { damage: 50, delay: 183 },
    stats: { dex: 30, agi: 20, accuracy: 55, attack: 50, storeTP: 8, weaponSkillDamage: 8 },
    tags: ["prime", "dagger", "rdm", "thf", "brd", "dnc"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Mpu_Gandring",
  },

  // ── Sword ────────────────────────────────────────────────────────────────────
  {
    id: "caliburnus",
    name: "Caliburnus",
    category: "weapon", slot: "main", weaponType: "Sword",
    jobs: ["RDM", "PLD", "BLU"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true,
    weapon: { damage: 75, delay: 240 },
    stats: { str: 25, int: 20, accuracy: 55, attack: 50, magicAccuracy: 30, weaponSkillDamage: 8 },
    tags: ["prime", "sword", "rdm", "pld", "blu"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Caliburnus",
  },

  // ── Great Sword ──────────────────────────────────────────────────────────────
  {
    id: "helheim",
    name: "Helheim",
    category: "weapon", slot: "main", weaponType: "Great Sword",
    jobs: ["WAR", "PLD", "DRK", "RUN"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true,
    weapon: { damage: 158, delay: 450 },
    stats: { str: 35, vit: 25, accuracy: 60, attack: 60, weaponSkillDamage: 10 },
    tags: ["prime", "great sword", "war", "pld", "drk", "run"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Helheim",
  },

  // ── Axe ──────────────────────────────────────────────────────────────────────
  {
    id: "spalirisos",
    name: "Spalirisos",
    category: "weapon", slot: "main", weaponType: "Axe",
    jobs: ["BST"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true, jobExclusive: true,
    weapon: { damage: 115, delay: 396 },
    stats: { str: 30, vit: 20, accuracy: 55, attack: 60, weaponSkillDamage: 8 },
    tags: ["prime", "axe", "bst"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Spalirisos",
  },

  // ── Great Axe ────────────────────────────────────────────────────────────────
  {
    id: "laphria",
    name: "Laphria",
    category: "weapon", slot: "main", weaponType: "Great Axe",
    jobs: ["WAR"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true, jobExclusive: true,
    weapon: { damage: 178, delay: 504 },
    stats: { str: 40, vit: 25, accuracy: 60, attack: 65, weaponSkillDamage: 10 },
    tags: ["prime", "great axe", "war"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Laphria",
  },

  // ── Scythe ───────────────────────────────────────────────────────────────────
  {
    id: "foenaria",
    name: "Foenaria",
    category: "weapon", slot: "main", weaponType: "Scythe",
    jobs: ["DRK"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true, jobExclusive: true,
    weapon: { damage: 170, delay: 528 },
    stats: { str: 35, vit: 20, accuracy: 60, attack: 65, weaponSkillDamage: 10 },
    tags: ["prime", "scythe", "drk"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Foenaria",
  },

  // ── Polearm ──────────────────────────────────────────────────────────────────
  {
    id: "gae-buide",
    name: "Gae Buide",
    category: "weapon", slot: "main", weaponType: "Polearm",
    jobs: ["DRG"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true, jobExclusive: true,
    weapon: { damage: 145, delay: 492 },
    stats: { str: 35, dex: 20, accuracy: 60, attack: 60, weaponSkillDamage: 10 },
    tags: ["prime", "polearm", "drg"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Gae_Buide",
  },

  // ── Katana ───────────────────────────────────────────────────────────────────
  {
    id: "dokoku",
    name: "Dokoku",
    category: "weapon", slot: "main", weaponType: "Katana",
    jobs: ["NIN"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true, jobExclusive: true,
    weapon: { damage: 55, delay: 227 },
    stats: { str: 25, dex: 30, accuracy: 60, attack: 55, dualWield: 5, weaponSkillDamage: 8 },
    tags: ["prime", "katana", "nin"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Dokoku",
  },

  // ── Great Katana ─────────────────────────────────────────────────────────────
  {
    id: "kusanagi",
    name: "Kusanagi",
    category: "weapon", slot: "main", weaponType: "Great Katana",
    jobs: ["SAM"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true, jobExclusive: true,
    weapon: { damage: 145, delay: 450 },
    stats: { str: 35, dex: 25, accuracy: 60, attack: 60, storeTP: 10, weaponSkillDamage: 10 },
    tags: ["prime", "great katana", "sam"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Kusanagi",
  },

  // ── Club ─────────────────────────────────────────────────────────────────────
  {
    id: "lorg-mor",
    name: "Lorg Mor",
    category: "weapon", slot: "main", weaponType: "Club",
    jobs: ["WHM", "GEO"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true,
    weapon: { damage: 80, delay: 264 },
    stats: { mnd: 35, int: 25, magicAccuracy: 40, curePotency: 12, geomancySkill: 15, weaponSkillDamage: 8 },
    tags: ["prime", "club", "whm", "geo"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Lorg_Mor",
  },

  // ── Staff ─────────────────────────────────────────────────────────────────────
  {
    id: "opashoro",
    name: "Opashoro",
    category: "weapon", slot: "main", weaponType: "Staff",
    jobs: ["BLM", "SMN", "SCH"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true,
    weapon: { damage: 115, delay: 402 },
    stats: { int: 40, mnd: 30, magicAccuracy: 50, magicAttackBonus: 40, weaponSkillDamage: 10 },
    tags: ["prime", "staff", "blm", "smn", "sch"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Opashoro",
  },

  // ── Archery ───────────────────────────────────────────────────────────────────
  {
    id: "pinaka",
    name: "Pinaka",
    category: "weapon", slot: "range", weaponType: "Archery",
    jobs: ["RNG"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true, jobExclusive: true,
    weapon: { damage: 110, delay: 504 },
    stats: { dex: 30, agi: 30, rangedAccuracy: 60, rangedAttack: 60, weaponSkillDamage: 10 },
    tags: ["prime", "archery", "rng"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Pinaka",
  },

  // ── Marksmanship ─────────────────────────────────────────────────────────────
  {
    id: "earp",
    name: "Earp",
    category: "weapon", slot: "range", weaponType: "Marksmanship",
    jobs: ["RNG", "COR"], level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Prime", endgame: true, augmentable: true,
    weapon: { damage: 112, delay: 528 },
    stats: { dex: 30, agi: 25, rangedAccuracy: 60, rangedAttack: 60, weaponSkillDamage: 10 },
    tags: ["prime", "marksmanship", "rng", "cor"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Earp",
  },
];
