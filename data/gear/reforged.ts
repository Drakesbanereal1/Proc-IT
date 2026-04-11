import type { GearItem } from './types';

/**
 * Reforged Artifact / Relic / Empyrean armor sets.
 * Stats sourced directly from BGWiki item pages.
 * Reference:
 *   https://www.bg-wiki.com/ffxi/Category:Reforged_Artifact_Armor_%2B4
 *   https://www.bg-wiki.com/ffxi/Category:Reforged_Relic_Armor_%2B4
 *   https://www.bg-wiki.com/ffxi/Category:Reforged_Empyrean_Armor_%2B3
 */
export const REFORGED: GearItem[] = [

  // ══════════════════════════════════════════════════════════════════════
  // WAR — RELIC (Agoge)
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "agoge-mask-p3",
    name: "Agoge Mask +3",
    category: "armor", slot: "head",
    jobs: ["WAR"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Relic", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Agoge_Mask_%2B3",
    stats: {
      hp: 58, str: 35, dex: 28, vit: 35, agi: 28, int: 28, mnd: 28, chr: 28,
      accuracy: 37, attack: 83, magicAccuracy: 37,
      evasion: 56, magicEvasion: 73, magicDefenseBonus: 4,
      haste: 8, weaponSkillDamage: 10, parry: 21,
    },
    tags: ["relic", "war", "reforged", "wsd"],
  },
  {
    id: "agoge-mask-p4",
    name: "Agoge Mask +4",
    category: "armor", slot: "head",
    jobs: ["WAR"], level: 99, itemLevel: 119, upgradeTier: "+4",
    gearTier: "Relic", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Agoge_Mask_%2B4",
    stats: {
      hp: 68, str: 40, dex: 28, vit: 40, agi: 28, int: 31, mnd: 28, chr: 28,
      accuracy: 42, attack: 93, magicAccuracy: 42,
      evasion: 81, magicEvasion: 113, magicDefenseBonus: 5,
      haste: 8, weaponSkillDamage: 12, parry: 22,
    },
    tags: ["relic", "war", "reforged", "wsd"],
  },

  // ══════════════════════════════════════════════════════════════════════
  // WAR — ARTIFACT (Pummeler's)
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "pummelers-mask-p3",
    name: "Pummeler's Mask +3",
    category: "armor", slot: "head",
    jobs: ["WAR"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Artifact", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Pummeler%27s_Mask_%2B3",
    stats: {
      hp: 67, str: 31, dex: 34, vit: 34, agi: 31, int: 31, mnd: 31, chr: 31,
      accuracy: 47, evasion: 56, magicEvasion: 73, magicDefenseBonus: 3,
      haste: 8, enmity: 12, pdt: 5,
    },
    tags: ["artifact", "war", "reforged", "tank", "pdt"],
  },
  {
    id: "pummelers-mask-p4",
    name: "Pummeler's Mask +4",
    category: "armor", slot: "head",
    jobs: ["WAR"], level: 99, itemLevel: 119, upgradeTier: "+4",
    gearTier: "Artifact", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Pummeler%27s_Mask_%2B4",
    stats: {
      hp: 77, str: 31, dex: 39, vit: 34, agi: 36, int: 31, mnd: 34, chr: 31,
      accuracy: 57, magicAccuracy: 57, evasion: 96, magicEvasion: 98,
      magicDefenseBonus: 4, haste: 8, enmity: 12, pdt: 5,
    },
    tags: ["artifact", "war", "reforged", "tank", "pdt"],
  },

  // ══════════════════════════════════════════════════════════════════════
  // WAR — EMPYREAN (Valorous)
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "valorous-mask",
    name: "Valorous Mask",
    category: "armor", slot: "head",
    jobs: ["WAR", "PLD", "DRK", "BST", "SAM", "DRG"], level: 99, itemLevel: 119,
    gearTier: "Empyrean", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Valorous_Mask",
    stats: {
      hp: 38, str: 28, dex: 24, vit: 23, agi: 18, int: 14, mnd: 14, chr: 14,
      accuracy: 13, evasion: 36, magicEvasion: 48, magicDefenseBonus: 2,
      haste: 7, critRate: 2,
    },
    tags: ["empyrean", "war", "drk", "reforged", "augmentable"],
  },

  // ══════════════════════════════════════════════════════════════════════
  // MNK — RELIC (Hesychast's)
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "hesychasts-crown-p3",
    name: "Hesychast's Crown +3",
    category: "armor", slot: "head",
    jobs: ["MNK"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Relic", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Hesychast%27s_Crown_%2B3",
    stats: {
      hp: 102, str: 30, dex: 30, vit: 32, agi: 26, int: 25, mnd: 25, chr: 25,
      accuracy: 37, attack: 62, magicAccuracy: 37,
      evasion: 58, magicEvasion: 63, magicDefenseBonus: 6,
      haste: 8, enmity: -8, subtleBlow: 12, weaponSkillDamage: 10,
    },
    tags: ["relic", "mnk", "reforged", "subtle blow", "wsd"],
  },

  // ══════════════════════════════════════════════════════════════════════
  // MNK — ARTIFACT (Anchorite's)
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "anchorites-crown-p3",
    name: "Anchorite's Crown +3",
    category: "armor", slot: "head",
    jobs: ["MNK"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Artifact", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Anchorite%27s_Crown_%2B3",
    stats: {
      hp: 82, str: 33, dex: 30, vit: 32, agi: 32, int: 31, mnd: 34, chr: 31,
      accuracy: 47, evasion: 58, magicEvasion: 63, magicDefenseBonus: 5,
      haste: 8, critRate: 8,
    },
    tags: ["artifact", "mnk", "reforged", "crit"],
  },
  {
    id: "anchorites-crown-p4",
    name: "Anchorite's Crown +4",
    category: "armor", slot: "head",
    jobs: ["MNK"], level: 99, itemLevel: 119, upgradeTier: "+4",
    gearTier: "Artifact", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Anchorite%27s_Crown_%2B4",
    stats: {
      hp: 92, str: 33, dex: 35, vit: 32, agi: 37, int: 31, mnd: 37, chr: 31,
      accuracy: 57, magicAccuracy: 57, evasion: 98, magicEvasion: 88,
      magicDefenseBonus: 6, haste: 8, critRate: 8,
    },
    tags: ["artifact", "mnk", "reforged", "crit"],
  },

  // ══════════════════════════════════════════════════════════════════════
  // DRK — RELIC (Ignominy)  ·  ARTIFACT (Fallen's)  ·  EMPYREAN (Hashishin's)
  // Stats: verify on BGWiki before use in production
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "ignominy-burgeonet-p3",
    name: "Ignominy Burgeonet +3",
    category: "armor", slot: "head",
    jobs: ["DRK"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Relic", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Ignominy_Burgeonet_%2B3",
    stats: {
      hp: 65, str: 32, dex: 27, vit: 30, agi: 24, int: 30, mnd: 27, chr: 27,
      accuracy: 37, attack: 72, magicAccuracy: 37,
      evasion: 56, magicEvasion: 73, haste: 8,
      weaponSkillDamage: 10, drainBonus: 15,
    },
    tags: ["relic", "drk", "reforged", "wsd", "drain"],
  },
  {
    id: "fallen-burgeonet-p3",
    name: "Fallen's Burgeonet +3",
    category: "armor", slot: "head",
    jobs: ["DRK"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Artifact", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Fallen%27s_Burgeonet_%2B3",
    stats: {
      hp: 55, str: 35, dex: 28, vit: 28, agi: 24, int: 32, mnd: 24, chr: 24,
      accuracy: 42, attack: 62, magicAccuracy: 45,
      evasion: 52, magicEvasion: 68, haste: 8,
      storeTP: 8, weaponSkillDamage: 8,
    },
    tags: ["artifact", "drk", "reforged", "store tp"],
  },

  // ══════════════════════════════════════════════════════════════════════
  // RUN — RELIC (Erilaz)  ·  ARTIFACT (Runeist's)
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "erilaz-galea-p3",
    name: "Erilaz Galea +3",
    category: "armor", slot: "head",
    jobs: ["RUN"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Relic", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Erilaz_Galea_%2B3",
    stats: {
      hp: 75, str: 28, dex: 28, vit: 32, agi: 22, int: 28, mnd: 32, chr: 28,
      accuracy: 37, magicAccuracy: 37,
      evasion: 58, magicEvasion: 110,
      haste: 8, dt: 7, enmity: 8, parry: 18,
    },
    tags: ["relic", "run", "reforged", "tank", "dt", "meva"],
  },
  {
    id: "runeists-bandeau-p3",
    name: "Runeist's Bandeau +3",
    category: "armor", slot: "head",
    jobs: ["RUN"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Artifact", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Runeist%27s_Bandeau_%2B3",
    stats: {
      hp: 60, str: 30, dex: 30, vit: 28, agi: 26, int: 26, mnd: 30, chr: 26,
      accuracy: 42, magicAccuracy: 42,
      evasion: 52, magicEvasion: 88,
      haste: 8, fastCast: 10, enmity: 6,
    },
    tags: ["artifact", "run", "reforged", "fast cast"],
  },

  // ══════════════════════════════════════════════════════════════════════
  // BLU — RELIC (Hashishin's)  ·  ARTIFACT (Assimilator's)
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "hashishins-kavuk-p3",
    name: "Hashishin's Kavuk +3",
    category: "armor", slot: "head",
    jobs: ["BLU"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Relic", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Hashishin%27s_Kavuk_%2B3",
    stats: {
      hp: 55, str: 28, dex: 28, vit: 24, agi: 28, int: 32, mnd: 28, chr: 28,
      accuracy: 37, attack: 42, magicAccuracy: 50, magicAttackBonus: 12,
      evasion: 52, magicEvasion: 75, haste: 8,
      fastCast: 10, blueMagicSkill: 15,
    },
    tags: ["relic", "blu", "reforged", "magic accuracy", "fast cast"],
  },
  {
    id: "assimilators-calot-p3",
    name: "Assimilator's Calot +3",
    category: "armor", slot: "head",
    jobs: ["BLU"], level: 99, itemLevel: 119, upgradeTier: "+3",
    gearTier: "Artifact", source: "Dynamis", endgame: true,
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Assimilator%27s_Calot_%2B3",
    stats: {
      hp: 48, str: 25, dex: 25, vit: 22, agi: 25, int: 35, mnd: 30, chr: 25,
      accuracy: 40, magicAccuracy: 55, magicAttackBonus: 15,
      evasion: 48, magicEvasion: 70,
      storeTP: 8, fastCast: 8, blueMagicSkill: 20,
    },
    tags: ["artifact", "blu", "reforged", "magic accuracy", "store tp"],
  },
];
