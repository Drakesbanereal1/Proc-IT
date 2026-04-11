import type { JobCode, GearStats, CompareMode } from './types';

/**
 * Job-specific stat weight overrides per CompareMode.
 *
 * These are DELTA adjustments layered on top of the base MODE_WEIGHTS —
 * a job entry here means "for this job, bump/reduce these weights".
 * Only jobs with meaningful deviations from the generic weights are listed.
 * Missing jobs/modes fall back to base MODE_WEIGHTS with no modification.
 */
export const JOB_WEIGHT_OVERRIDES: Partial<
  Record<JobCode, Partial<Record<CompareMode, Partial<Record<keyof GearStats, number>>>>>
> = {

  // ── Warrior ─────────────────────────────────────────────────────────────────
  WAR: {
    // Rampage is multi-hit — raw attack and STR boost all hits
    WS: { attack: 5, str: 5, weaponSkillDamage: 5, critRate: 2, critDamage: 2, tpBonus: 3 },
    // Warcry/Berserk make TP gear simpler — DA/TA still king
    TP: { doubleAttack: 5, tripleAttack: 5, haste: 5, accuracy: 3, storeTP: 3 },
  },

  // ── Monk ────────────────────────────────────────────────────────────────────
  MNK: {
    // Subtle Blow reduces TP given to enemy — critical for MNK TP phase
    TP: { subtleBlow: 5, accuracy: 4, haste: 5, doubleAttack: 4, tripleAttack: 4, kickAttacks: 3 },
    // Asuran Fists is highly crit-scaled; also benefits kick attacks
    WS: { critRate: 5, critDamage: 5, dex: 4, str: 3, attack: 3, kickAttacks: 4 },
  },

  // ── White Mage ──────────────────────────────────────────────────────────────
  WHM: {
    // Cure potency and received potency stack — MND also scales cure
    Support: { curePotency: 5, curePotencyReceived: 5, mnd: 5, conserveMP: 4, fastCast: 3 },
  },

  // ── Black Mage ──────────────────────────────────────────────────────────────
  BLM: {
    // BLM nukes — MB damage and INT are the main dials
    MagicAccuracy: { magicAccuracy: 5, int: 5, magicAttackBonus: 5, magicBurstDamage: 5, conserveMP: 3 },
  },

  // ── Thief ───────────────────────────────────────────────────────────────────
  THF: {
    // Dual Wield is core; subtle blow for TH builds
    TP: { dualWield: 5, subtleBlow: 4, haste: 5, accuracy: 3, storeTP: 3 },
    // Dancing Edge / Shark Bite — DEX and crit heavy
    WS: { dex: 5, critRate: 5, critDamage: 4, agi: 3, attack: 3, weaponSkillDamage: 4 },
  },

  // ── Paladin ─────────────────────────────────────────────────────────────────
  PLD: {
    // Spell interrupt down is crucial — PLD casts while tanking
    Tank: {
      spellInterruptDown: 5, dt: 5, mdt: 5, pdt: 4,
      enmity: 5, parry: 5, hp: 4, vit: 3, mp: 3,
    },
    Idle: { dt: 5, mdt: 5, pdt: 4, hp: 4, mp: 5 },
  },

  // ── Dark Knight ─────────────────────────────────────────────────────────────
  DRK: {
    // Guillotine / Insurgency — STR and attack scale heavily
    WS: { str: 5, attack: 5, weaponSkillDamage: 5, critRate: 3, critDamage: 3, tpBonus: 3 },
    // Drain/Aspir spells — drainBonus and magicAccuracy matter
    MagicAccuracy: { magicAccuracy: 5, int: 4, drainBonus: 5, aspirBonus: 5 },
  },

  // ── Beastmaster ─────────────────────────────────────────────────────────────
  BST: {
    // BST TP gear is similar to generic DD; no major deviations
  },

  // ── Bard ────────────────────────────────────────────────────────────────────
  BRD: {
    // Song duration and instrument skill are the top stats for BRD
    Support: {
      songDuration: 6, singingSkill: 6, instrumentSkill: 6,
      chr: 3, fastCast: 3, conserveMP: 2,
    },
  },

  // ── Ranger ──────────────────────────────────────────────────────────────────
  RNG: {
    // Snapshot lets RNG fire faster; Rapid Shot procs reduce delay
    Ranged: {
      rangedAccuracy: 5, rangedAttack: 5, rangedStoreTP: 4,
      snapShot: 6, rapidShot: 5, agi: 3, dex: 2,
    },
    WS: { dex: 5, agi: 4, rangedAttack: 5, weaponSkillDamage: 5, critRate: 4 },
  },

  // ── Samurai ─────────────────────────────────────────────────────────────────
  SAM: {
    // Store TP is SAM's defining stat — every point matters for 100 TP in 1 WS
    TP: { storeTP: 7, haste: 5, accuracy: 3, doubleAttack: 3, attack: 2 },
    // Tachi: Fudo / Tachi: Shoha — STR and skillchain damage
    WS: { str: 5, attack: 4, weaponSkillDamage: 5, skillchainDamage: 5, tpBonus: 4 },
  },

  // ── Ninja ───────────────────────────────────────────────────────────────────
  NIN: {
    // Dual Wield and Subtle Blow are core — evasion for Utsusemi NIN tanking
    TP: { dualWield: 6, haste: 5, subtleBlow: 4, accuracy: 3, doubleAttack: 3, storeTP: 3 },
    // Blade: Hi / Blade: Shun — DEX and crit
    WS: { dex: 5, critRate: 5, str: 3, attack: 4, weaponSkillDamage: 4 },
    Tank: { evasion: 5, dt: 4, pdt: 3, hp: 3, enmity: 4 },
  },

  // ── Dragoon ─────────────────────────────────────────────────────────────────
  DRG: {
    // Drakesbane / Stardiver — STR primary
    WS: { str: 5, dex: 4, attack: 4, weaponSkillDamage: 5, critRate: 3 },
    TP: { haste: 5, storeTP: 3, accuracy: 3, doubleAttack: 4, tripleAttack: 4, attack: 2 },
  },

  // ── Summoner ─────────────────────────────────────────────────────────────────
  SMN: {
    // Summoner uses MND + MAB for Avatar WS damage; MP for uptime
    MagicAccuracy: { mnd: 5, magicAccuracy: 4, magicAttackBonus: 5, mp: 4, fastCast: 2 },
    Idle: { mp: 6, dt: 4, mdt: 4 },
  },

  // ── Blue Mage ───────────────────────────────────────────────────────────────
  BLU: {
    // Blue Magic skill boosts both spell accuracy and damage for BLU spells
    MagicAccuracy: {
      blueMagicSkill: 6, magicAccuracy: 5, int: 4, mnd: 3, magicAttackBonus: 4,
    },
    // BLU TP is Dual Wield dependent
    TP: { dualWield: 5, haste: 5, doubleAttack: 4, accuracy: 3, storeTP: 3 },
    FastCast: { fastCast: 5, haste: 3, blueMagicSkill: 4, conserveMP: 3 },
  },

  // ── Corsair ─────────────────────────────────────────────────────────────────
  COR: {
    // Quick Draw — quickDrawBonus and MAB
    Support: { quickDrawBonus: 6, magicAccuracy: 4, chr: 3, rangedAccuracy: 3 },
    Ranged: {
      rangedAccuracy: 5, rangedAttack: 5, rangedStoreTP: 4,
      snapShot: 5, agi: 3, dex: 2,
    },
  },

  // ── Puppetmaster ─────────────────────────────────────────────────────────────
  PUP: {
    // Generic DD build; no major overrides needed
  },

  // ── Dancer ──────────────────────────────────────────────────────────────────
  DNC: {
    // Dual Wield critical; DEX/AGI for Pyrrhic Kleos / Exenterator
    TP: { dualWield: 6, haste: 5, doubleAttack: 4, accuracy: 3, storeTP: 3 },
    WS: { dex: 5, agi: 4, critRate: 5, attack: 3, weaponSkillDamage: 4 },
  },

  // ── Scholar ─────────────────────────────────────────────────────────────────
  SCH: {
    // Magic Burst Damage is SCH's speciality via Light/Dark Arts
    MagicAccuracy: {
      magicBurstDamage: 6, magicBurstDamageII: 6, magicAccuracy: 5,
      int: 4, mnd: 3, magicAttackBonus: 4,
    },
    Support: { curePotency: 5, mnd: 4, conserveMP: 5, fastCast: 4 },
  },

  // ── Geomancer ───────────────────────────────────────────────────────────────
  GEO: {
    // Geomancy skill boosts Indi- and Geo- spell potency and duration
    Support: {
      geomancySkill: 7, indiDuration: 6, mnd: 3, conserveMP: 4, fastCast: 3,
    },
    Idle: { mp: 5, dt: 4, mdt: 4, geomancySkill: 3 },
  },

  // ── Rune Fencer ─────────────────────────────────────────────────────────────
  RUN: {
    // Magic Evasion is RUN's primary tank stat; parry via Pflug
    Tank: {
      magicEvasion: 7, mdt: 6, dt: 5, parry: 5,
      enmity: 4, hp: 3, vit: 2, spellInterruptDown: 3,
    },
    Idle: { dt: 5, mdt: 5, magicEvasion: 6, hp: 4 },
    // Enchainment / Resolution — hybrid melee with enmity
    TP: { haste: 5, accuracy: 3, storeTP: 3, dualWield: 4, enmity: 3 },
  },
};
