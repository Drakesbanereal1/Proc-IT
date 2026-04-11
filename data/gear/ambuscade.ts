import type { GearItem } from './types';

/**
 * Ambuscade final-tier weapons (ilvl 119).
 * All source: "Ambuscade". Stats reflect the top-tier (fully upgraded) version.
 * Reference: https://www.bg-wiki.com/ffxi/Category:Ambuscade
 */
export const AMBUSCADE_WEAPONS: GearItem[] = [

  // ── Dagger ───────────────────────────────────────────────────────────────────
  {
    id: "karambit",
    name: "Karambit",
    category: "weapon", slot: "main", weaponType: "Dagger",
    jobs: ["WAR","MNK","RDM","THF","PLD","DRK","BST","BRD","RNG","SAM","NIN","DRG","BLU","COR","PUP","DNC","SCH","RUN"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 44, delay: 183 },
    stats: { dex: 20, agi: 15, accuracy: 30, attack: 25, storeTP: 7, critRate: 5 },
    tags: ["ambuscade", "dagger"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Karambit",
  },
  {
    id: "tauret",
    name: "Tauret",
    category: "weapon", slot: "main", weaponType: "Dagger",
    jobs: ["RDM","THF","BST","BRD","RNG","NIN","COR","PUP","DNC"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 46, delay: 183 },
    stats: { dex: 20, agi: 15, accuracy: 35, attack: 30, storeTP: 5, weaponSkillDamage: 5 },
    tags: ["ambuscade", "dagger"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Tauret",
  },

  // ── Sword ────────────────────────────────────────────────────────────────────
  {
    id: "nandaka",
    name: "Nandaka",
    category: "weapon", slot: "main", weaponType: "Sword",
    jobs: ["WAR","RDM","PLD","DRK","BST","BRD","RNG","SAM","NIN","DRG","BLU","COR","DNC","RUN"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 68, delay: 240 },
    stats: { str: 20, dex: 15, accuracy: 30, attack: 30, storeTP: 5, doubleAttack: 5 },
    tags: ["ambuscade", "sword"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Nandaka",
  },

  // ── Axe ──────────────────────────────────────────────────────────────────────
  {
    id: "dolichenus",
    name: "Dolichenus",
    category: "weapon", slot: "main", weaponType: "Axe",
    jobs: ["WAR","DRK","BST","RNG","SAM","DRG","COR"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 85, delay: 288 },
    stats: { str: 20, dex: 15, accuracy: 25, attack: 35, storeTP: 5, doubleAttack: 5 },
    tags: ["ambuscade", "axe"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Dolichenus",
  },

  // ── Great Axe ────────────────────────────────────────────────────────────────
  {
    id: "lycurgos",
    name: "Lycurgos",
    category: "weapon", slot: "main", weaponType: "Great Axe",
    jobs: ["WAR","DRK","BST"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 155, delay: 504 },
    stats: { str: 25, vit: 15, accuracy: 25, attack: 40, storeTP: 5, weaponSkillDamage: 5 },
    tags: ["ambuscade", "great axe"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Lycurgos",
  },

  // ── Scythe ───────────────────────────────────────────────────────────────────
  {
    id: "drepanum",
    name: "Drepanum",
    category: "weapon", slot: "main", weaponType: "Scythe",
    jobs: ["WAR","DRK","BST"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 130, delay: 480 },
    stats: { str: 20, int: 15, accuracy: 25, attack: 35, storeTP: 5, critRate: 5, critDamage: 5 },
    tags: ["ambuscade", "scythe"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Drepanum",
  },

  // ── Polearm ──────────────────────────────────────────────────────────────────
  {
    id: "shining-one",
    name: "Shining One",
    category: "weapon", slot: "main", weaponType: "Polearm",
    jobs: ["WAR","DRK","DRG","SAM"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 120, delay: 396 },
    stats: { str: 20, vit: 15, accuracy: 30, attack: 35, storeTP: 5, weaponSkillDamage: 5 },
    tags: ["ambuscade", "polearm"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Shining_One",
  },

  // ── Katana ───────────────────────────────────────────────────────────────────
  {
    id: "gokotai",
    name: "Gokotai",
    category: "weapon", slot: "main", weaponType: "Katana",
    jobs: ["NIN","SAM"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 62, delay: 227 },
    stats: { dex: 20, agi: 15, accuracy: 30, attack: 25, storeTP: 7, tripleAttack: 5 },
    tags: ["ambuscade", "katana"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Gokotai",
  },

  // ── Great Katana ─────────────────────────────────────────────────────────────
  {
    id: "hachimonji",
    name: "Hachimonji",
    category: "weapon", slot: "main", weaponType: "Great Katana",
    jobs: ["SAM","NIN"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 135, delay: 450 },
    stats: { str: 20, dex: 15, accuracy: 30, attack: 35, storeTP: 7, weaponSkillDamage: 5 },
    tags: ["ambuscade", "great katana"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Hachimonji",
  },

  // ── Club ─────────────────────────────────────────────────────────────────────
  {
    id: "maxentius",
    name: "Maxentius",
    category: "weapon", slot: "main", weaponType: "Club",
    jobs: ["WHM","BLM","RDM","PLD","SMN","SCH","GEO","BLU"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 64, delay: 264 },
    stats: { mnd: 20, int: 15, magicAccuracy: 30, magicAttackBonus: 10, fastCast: 5, conserveMP: 5 },
    tags: ["ambuscade", "club", "mage"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Maxentius",
  },

  // ── Staff ─────────────────────────────────────────────────────────────────────
  {
    id: "xoanon",
    name: "Xoanon",
    category: "weapon", slot: "main", weaponType: "Staff",
    jobs: ["WHM","BLM","RDM","SMN","SCH","GEO"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 85, delay: 402 },
    stats: { mnd: 20, int: 20, magicAccuracy: 35, magicAttackBonus: 15, fastCast: 5 },
    tags: ["ambuscade", "staff", "mage"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Xoanon",
  },

  // ── Archery ───────────────────────────────────────────────────────────────────
  {
    id: "ullr",
    name: "Ullr",
    category: "weapon", slot: "range", weaponType: "Archery",
    jobs: ["RNG","SAM","COR"],
    level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    weapon: { damage: 105, delay: 528 },
    stats: { agi: 20, dex: 15, rangedAccuracy: 35, rangedAttack: 30, rangedStoreTP: 5, snapShot: 5 },
    tags: ["ambuscade", "archery", "bow"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Ullr",
  },
];
