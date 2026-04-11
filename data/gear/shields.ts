import type { GearItem } from './types';

/**
 * Curated endgame shield dataset.
 * Shields equip in the sub slot alongside one-handed weapons.
 * Reference: https://www.bg-wiki.com/ffxi/Category:Shields
 */
export const SHIELDS: GearItem[] = [
  {
    id: "ochain",
    name: "Ochain",
    category: "shield", slot: "sub", weaponType: "Shield",
    jobs: ["PLD"], level: 75, itemLevel: 119, upgradeTier: "+4",
    source: "Relic", endgame: true,
    stats: { vit: 20, defense: 60, enmity: 15, pdt: 10 },
    tags: ["relic", "shield", "pld"],
  },
  {
    id: "priwen",
    name: "Priwen",
    category: "shield", slot: "sub", weaponType: "Shield",
    jobs: ["PLD"], level: 75, itemLevel: 119, upgradeTier: "+4",
    source: "Empyrean", endgame: true,
    stats: { vit: 25, hp: 150, defense: 55, enmity: 20, dt: 10 },
    tags: ["empyrean", "shield", "pld"],
  },
  {
    id: "aegis",
    name: "Aegis",
    category: "shield", slot: "sub", weaponType: "Shield",
    jobs: ["PLD"], level: 75, itemLevel: 119, upgradeTier: "+4",
    source: "Mythic", endgame: true,
    stats: { vit: 15, defense: 50, enmity: 10, mdt: 15, spellInterruptDown: 50 },
    tags: ["mythic", "shield", "pld"],
  },
  {
    id: "kheshig-blade",
    name: "Kheshig Blade",
    category: "shield", slot: "sub", weaponType: "Shield",
    jobs: ["PLD", "RUN"], level: 99, itemLevel: 119,
    source: "Escha", endgame: true,
    stats: { vit: 20, defense: 45, enmity: 10, pdt: 5 },
    tags: ["escha", "shield"],
  },
];
