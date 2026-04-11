import type { GearItem } from './types';

/**
 * BRD Instruments — slot: "range", weaponType: "Instrument", isInstrument: true
 *
 * Instruments are NOT scored on the Ranged compare mode.
 * Use Support mode for BRD instruments.
 *
 * Reference: https://www.bg-wiki.com/ffxi/Category:Instruments
 */
export const INSTRUMENTS: GearItem[] = [

  // ── Relic ────────────────────────────────────────────────────────────────────
  {
    id: "gjallarhorn",
    name: "Gjallarhorn",
    category: "weapon", slot: "range", weaponType: "Instrument",
    jobs: ["BRD"], level: 75, itemLevel: 119, upgradeTier: "+4",
    source: "Relic", gearTier: "Relic", endgame: true,
    isInstrument: true, jobExclusive: true,
    weapon: { damage: 0, delay: 0 },
    stats: {
      chr: 15,
      singingSkill: 10,
      instrumentSkill: 10,
      songDuration: 3,         // +3 song cycles (effectively extends buff duration)
    },
    tags: ["relic", "instrument", "brd", "wind"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Gjallarhorn",
  },

  // ── Empyrean ─────────────────────────────────────────────────────────────────
  {
    id: "daurdabla",
    name: "Daurdabla",
    category: "weapon", slot: "range", weaponType: "Instrument",
    jobs: ["BRD"], level: 75, itemLevel: 119, upgradeTier: "+4",
    source: "Empyrean", gearTier: "Empyrean", endgame: true,
    isInstrument: true, jobExclusive: true,
    weapon: { damage: 0, delay: 0 },
    stats: {
      chr: 15,
      singingSkill: 10,
      instrumentSkill: 5,
      songDuration: 2,         // +2 song cycles
      // Special: allows 3rd song — modeled via notes field on stats
      notes: "Allows BRD to have 3 active songs",
    },
    tags: ["empyrean", "instrument", "brd", "string"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Daurdabla",
  },

  // ── Aeonic ───────────────────────────────────────────────────────────────────
  {
    id: "marsyas",
    name: "Marsyas",
    category: "weapon", slot: "range", weaponType: "Instrument",
    jobs: ["BRD"], level: 99, itemLevel: 119,
    source: "Aeonic", gearTier: "Aeonic", endgame: true,
    isInstrument: true, jobExclusive: true,
    weapon: { damage: 0, delay: 0 },
    stats: {
      chr: 20,
      singingSkill: 15,
      instrumentSkill: 10,
      songDuration: 2,
      tpBonus: 1000,           // On WS (same aeonic bonus pattern)
      notes: "Allows BRD to have 3 active songs; TP bonus applies on WS",
    },
    tags: ["aeonic", "instrument", "brd"],
    bgwikiUrl: "https://www.bg-wiki.com/ffxi/Marsyas",
  },

  // ── Notable non-ultimate instruments ─────────────────────────────────────────
  {
    id: "linos",
    name: "Linos",
    category: "weapon", slot: "range", weaponType: "Instrument",
    jobs: ["BRD"], level: 99, itemLevel: 119,
    source: "Ambuscade", endgame: true,
    isInstrument: true, jobExclusive: true,
    weapon: { damage: 0, delay: 0 },
    stats: {
      chr: 10,
      singingSkill: 5,
      instrumentSkill: 5,
      songDuration: 1,
    },
    tags: ["ambuscade", "instrument", "brd"],
  },
  {
    id: "chanter-staff",
    name: "Chanter's Staff",
    category: "weapon", slot: "main", weaponType: "Staff",
    jobs: ["BRD"], level: 99, itemLevel: 119,
    source: "Various", endgame: false,
    isInstrument: false,
    weapon: { damage: 85, delay: 402 },
    stats: { chr: 10, singingSkill: 5, instrumentSkill: 5 },
    tags: ["staff", "brd"],
  },
];
