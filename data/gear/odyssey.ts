import type { GearItem } from './types';

/**
 * Odyssey armor sets — BiS endgame armor farmed from Omen/Odyssey/Segault content.
 * All pieces are ilvl 119, augmentable.
 *
 * Sets included:
 *  - Sakpata's (WAR/MNK/DRK melee tank)
 *  - Gleti's (WAR/DRK melee DD)
 *  - Ikenga's (WAR/MNK physical DD)
 *  - Mpaca's (MNK/DRK counter/sustain)
 *  - Agwu's (magic jobs)
 *
 * Reference: https://www.bg-wiki.com/ffxi/Category:Odyssey_Rewards
 */
export const ODYSSEY: GearItem[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // Sakpata's Set — tank/hybrid (WAR PLD DRK MNK RUN)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "sakpata-helm",
    name: "Sakpata's Helm",
    category: "armor", slot: "head",
    jobs: ["WAR", "PLD", "DRK", "MNK", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Sakpata", endgame: true, augmentable: true,
    stats: { hp: 60, str: 20, vit: 20, accuracy: 30, attack: 20, dt: 5, defense: 80 },
    tags: ["odyssey", "tank", "melee", "hybrid"],
  },
  {
    id: "sakpata-plate",
    name: "Sakpata's Plate",
    category: "armor", slot: "body",
    jobs: ["WAR", "PLD", "DRK", "MNK", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Sakpata", endgame: true, augmentable: true,
    stats: { hp: 80, str: 25, vit: 25, accuracy: 40, attack: 30, dt: 7, defense: 130, pdt: 3 },
    tags: ["odyssey", "tank", "melee"],
  },
  {
    id: "sakpata-gauntlets",
    name: "Sakpata's Gauntlets",
    category: "armor", slot: "hands",
    jobs: ["WAR", "PLD", "DRK", "MNK", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Sakpata", endgame: true, augmentable: true,
    stats: { hp: 50, str: 20, vit: 15, accuracy: 25, attack: 20, dt: 4, defense: 65, weaponSkillDamage: 5 },
    tags: ["odyssey", "tank", "melee", "ws"],
  },
  {
    id: "sakpata-cuisses",
    name: "Sakpata's Cuisses",
    category: "armor", slot: "legs",
    jobs: ["WAR", "PLD", "DRK", "MNK", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Sakpata", endgame: true, augmentable: true,
    stats: { hp: 70, str: 20, vit: 20, accuracy: 35, attack: 25, dt: 5, defense: 95 },
    tags: ["odyssey", "tank", "melee"],
  },
  {
    id: "sakpata-leggings",
    name: "Sakpata's Leggings",
    category: "armor", slot: "feet",
    jobs: ["WAR", "PLD", "DRK", "MNK", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Sakpata", endgame: true, augmentable: true,
    stats: { hp: 50, str: 15, vit: 15, accuracy: 25, attack: 15, dt: 4, defense: 60, haste: 3 },
    tags: ["odyssey", "tank", "melee"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Gleti's Set — melee DD with WSD focus (WAR DRK)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "gleti-mask",
    name: "Gleti's Mask",
    category: "armor", slot: "head",
    jobs: ["WAR", "DRK", "SAM", "NIN", "DRG", "MNK"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Gleti", endgame: true, augmentable: true,
    stats: { str: 25, dex: 20, accuracy: 40, attack: 35, weaponSkillDamage: 8, critRate: 3 },
    tags: ["odyssey", "dd", "ws", "melee"],
  },
  {
    id: "gleti-cuirass",
    name: "Gleti's Cuirass",
    category: "armor", slot: "body",
    jobs: ["WAR", "DRK", "SAM", "NIN", "DRG", "MNK"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Gleti", endgame: true, augmentable: true,
    stats: { str: 30, dex: 20, accuracy: 50, attack: 45, weaponSkillDamage: 10, doubleAttack: 5 },
    tags: ["odyssey", "dd", "ws", "melee"],
  },
  {
    id: "gleti-gauntlets",
    name: "Gleti's Gauntlets",
    category: "armor", slot: "hands",
    jobs: ["WAR", "DRK", "SAM", "NIN", "DRG", "MNK"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Gleti", endgame: true, augmentable: true,
    stats: { str: 20, dex: 20, accuracy: 35, attack: 30, weaponSkillDamage: 7, critDamage: 5 },
    tags: ["odyssey", "dd", "ws", "crit"],
  },
  {
    id: "gleti-breeches",
    name: "Gleti's Breeches",
    category: "armor", slot: "legs",
    jobs: ["WAR", "DRK", "SAM", "NIN", "DRG", "MNK"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Gleti", endgame: true, augmentable: true,
    stats: { str: 25, dex: 15, accuracy: 40, attack: 35, weaponSkillDamage: 8, tripleAttack: 3 },
    tags: ["odyssey", "dd", "ws", "melee"],
  },
  {
    id: "gleti-boots",
    name: "Gleti's Boots",
    category: "armor", slot: "feet",
    jobs: ["WAR", "DRK", "SAM", "NIN", "DRG", "MNK"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Gleti", endgame: true, augmentable: true,
    stats: { str: 20, dex: 15, accuracy: 30, attack: 25, weaponSkillDamage: 6, storeTP: 5 },
    tags: ["odyssey", "dd", "ws", "melee"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Ikenga's Set — physical DD haste/multi-attack (WAR MNK DRG DRK BST)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "ikenga-helm",
    name: "Ikenga's Helm",
    category: "armor", slot: "head",
    jobs: ["WAR", "MNK", "DRG", "DRK", "BST", "SAM"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Ikenga", endgame: true, augmentable: true,
    stats: { str: 25, vit: 20, accuracy: 35, attack: 35, doubleAttack: 5, haste: 5 },
    tags: ["odyssey", "dd", "haste", "da"],
  },
  {
    id: "ikenga-mail",
    name: "Ikenga's Mail",
    category: "armor", slot: "body",
    jobs: ["WAR", "MNK", "DRG", "DRK", "BST", "SAM"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Ikenga", endgame: true, augmentable: true,
    stats: { str: 30, vit: 20, accuracy: 45, attack: 45, doubleAttack: 6, tripleAttack: 3, haste: 6 },
    tags: ["odyssey", "dd", "haste", "da", "ta"],
  },
  {
    id: "ikenga-gauntlets",
    name: "Ikenga's Gauntlets",
    category: "armor", slot: "hands",
    jobs: ["WAR", "MNK", "DRG", "DRK", "BST", "SAM"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Ikenga", endgame: true, augmentable: true,
    stats: { str: 20, dex: 15, accuracy: 30, attack: 30, doubleAttack: 4, storeTP: 4, haste: 4 },
    tags: ["odyssey", "dd", "haste", "da"],
  },
  {
    id: "ikenga-trousers",
    name: "Ikenga's Trousers",
    category: "armor", slot: "legs",
    jobs: ["WAR", "MNK", "DRG", "DRK", "BST", "SAM"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Ikenga", endgame: true, augmentable: true,
    stats: { str: 25, vit: 15, accuracy: 40, attack: 35, doubleAttack: 5, tripleAttack: 3 },
    tags: ["odyssey", "dd", "da", "ta"],
  },
  {
    id: "ikenga-boots",
    name: "Ikenga's Boots",
    category: "armor", slot: "feet",
    jobs: ["WAR", "MNK", "DRG", "DRK", "BST", "SAM"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Ikenga", endgame: true, augmentable: true,
    stats: { str: 20, dex: 15, accuracy: 25, attack: 25, doubleAttack: 4, haste: 4 },
    tags: ["odyssey", "dd", "haste", "da"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Mpaca's Set — MNK/DRK sustain/counter
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "mpaca-cap",
    name: "Mpaca's Cap",
    category: "armor", slot: "head",
    jobs: ["MNK", "DRK", "WAR", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Mpaca", endgame: true, augmentable: true,
    stats: { hp: 50, str: 20, vit: 20, accuracy: 30, attack: 25, counter: 5, kickAttacks: 2 },
    tags: ["odyssey", "mnk", "drk", "counter"],
  },
  {
    id: "mpaca-jerkin",
    name: "Mpaca's Jerkin",
    category: "armor", slot: "body",
    jobs: ["MNK", "DRK", "WAR", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Mpaca", endgame: true, augmentable: true,
    stats: { hp: 70, str: 25, vit: 25, accuracy: 40, attack: 35, counter: 7, guard: 5 },
    tags: ["odyssey", "mnk", "drk", "counter", "guard"],
  },
  {
    id: "mpaca-gloves",
    name: "Mpaca's Gloves",
    category: "armor", slot: "hands",
    jobs: ["MNK", "DRK", "WAR", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Mpaca", endgame: true, augmentable: true,
    stats: { hp: 40, str: 15, vit: 15, accuracy: 25, attack: 20, counter: 4, kickAttacks: 3 },
    tags: ["odyssey", "mnk", "counter"],
  },
  {
    id: "mpaca-hose",
    name: "Mpaca's Hose",
    category: "armor", slot: "legs",
    jobs: ["MNK", "DRK", "WAR", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Mpaca", endgame: true, augmentable: true,
    stats: { hp: 60, str: 20, vit: 20, accuracy: 30, attack: 25, counter: 5, subtleBlow: 5 },
    tags: ["odyssey", "mnk", "counter", "subtle blow"],
  },
  {
    id: "mpaca-boots",
    name: "Mpaca's Boots",
    category: "armor", slot: "feet",
    jobs: ["MNK", "DRK", "WAR", "RUN"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Mpaca", endgame: true, augmentable: true,
    stats: { hp: 40, str: 15, vit: 10, accuracy: 20, attack: 15, counter: 3, haste: 3 },
    tags: ["odyssey", "mnk", "counter"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Agwu's Set — magic jobs (BLM SCH GEO SMN RDM WHM BLU)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "agwu-cap",
    name: "Agwu's Cap",
    category: "armor", slot: "head",
    jobs: ["BLM", "SCH", "GEO", "SMN", "RDM", "WHM", "BLU"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Agwu", endgame: true, augmentable: true,
    stats: { int: 30, mnd: 25, magicAccuracy: 45, magicAttackBonus: 30, fastCast: 5 },
    tags: ["odyssey", "mage", "magic"],
  },
  {
    id: "agwu-robe",
    name: "Agwu's Robe",
    category: "armor", slot: "body",
    jobs: ["BLM", "SCH", "GEO", "SMN", "RDM", "WHM", "BLU"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Agwu", endgame: true, augmentable: true,
    stats: { int: 35, mnd: 30, magicAccuracy: 55, magicAttackBonus: 40, fastCast: 8, conserveMP: 5 },
    tags: ["odyssey", "mage", "magic"],
  },
  {
    id: "agwu-gloves",
    name: "Agwu's Gloves",
    category: "armor", slot: "hands",
    jobs: ["BLM", "SCH", "GEO", "SMN", "RDM", "WHM", "BLU"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Agwu", endgame: true, augmentable: true,
    stats: { int: 25, mnd: 20, magicAccuracy: 40, magicAttackBonus: 25, fastCast: 5, magicBurstDamage: 8 },
    tags: ["odyssey", "mage", "magic burst"],
  },
  {
    id: "agwu-hose",
    name: "Agwu's Hose",
    category: "armor", slot: "legs",
    jobs: ["BLM", "SCH", "GEO", "SMN", "RDM", "WHM", "BLU"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Agwu", endgame: true, augmentable: true,
    stats: { int: 30, mnd: 25, magicAccuracy: 45, magicAttackBonus: 30, conserveMP: 8 },
    tags: ["odyssey", "mage", "magic"],
  },
  {
    id: "agwu-boots",
    name: "Agwu's Boots",
    category: "armor", slot: "feet",
    jobs: ["BLM", "SCH", "GEO", "SMN", "RDM", "WHM", "BLU"],
    level: 99, itemLevel: 119,
    source: "Odyssey", gearTier: "Endgame", setName: "Agwu", endgame: true, augmentable: true,
    stats: { int: 25, mnd: 20, magicAccuracy: 35, magicAttackBonus: 20, fastCast: 6 },
    tags: ["odyssey", "mage", "magic"],
  },
];
