import type { JobCode, GearStats, CompareMode } from './types';

export interface JobProfile {
  code: JobCode;
  name: string;
  /** Broad role labels */
  roles: string[];
  /** Which compare modes are relevant for this job */
  relevantModes: CompareMode[];
  /** Ordered stat priority per compare mode — first = most important */
  preferredStats: Partial<Record<CompareMode, (keyof GearStats)[]>>;
}

export const JOB_PROFILES: Record<JobCode, JobProfile> = {
  WAR: {
    code: "WAR", name: "Warrior",
    roles: ["DD", "Tank"],
    relevantModes: ["TP", "WS", "Tank"],
    preferredStats: {
      TP:   ["haste", "doubleAttack", "tripleAttack", "accuracy", "attack", "storeTP"],
      WS:   ["str", "attack", "weaponSkillDamage", "tpBonus", "critRate"],
      Tank: ["dt", "pdt", "hp", "vit", "enmity", "defense"],
    },
  },
  MNK: {
    code: "MNK", name: "Monk",
    roles: ["DD"],
    relevantModes: ["TP", "WS"],
    preferredStats: {
      TP:   ["haste", "accuracy", "attack", "doubleAttack", "tripleAttack", "storeTP", "subtleBlow"],
      WS:   ["str", "dex", "attack", "weaponSkillDamage", "critRate", "critDamage", "kickAttacks"],
    },
  },
  WHM: {
    code: "WHM", name: "White Mage",
    roles: ["Healer", "Support"],
    relevantModes: ["FastCast", "MagicAccuracy", "Support", "Idle"],
    preferredStats: {
      FastCast:     ["fastCast", "haste", "conserveMP"],
      MagicAccuracy:["magicAccuracy", "mnd", "magicAttackBonus"],
      Support:      ["curePotency", "curePotencyReceived", "mnd", "conserveMP"],
      Idle:         ["dt", "mdt", "hp", "mp"],
    },
  },
  BLM: {
    code: "BLM", name: "Black Mage",
    roles: ["Nuker"],
    relevantModes: ["MagicAccuracy", "FastCast"],
    preferredStats: {
      MagicAccuracy:["magicAccuracy", "int", "magicAttackBonus", "magicBurstDamage"],
      FastCast:     ["fastCast", "haste", "conserveMP"],
    },
  },
  RDM: {
    code: "RDM", name: "Red Mage",
    roles: ["Hybrid", "Support"],
    relevantModes: ["TP", "FastCast", "MagicAccuracy"],
    preferredStats: {
      TP:           ["haste", "accuracy", "attack", "storeTP", "dualWield"],
      FastCast:     ["fastCast", "haste", "conserveMP"],
      MagicAccuracy:["magicAccuracy", "int", "mnd", "magicAttackBonus"],
    },
  },
  THF: {
    code: "THF", name: "Thief",
    roles: ["DD", "Support"],
    relevantModes: ["TP", "WS"],
    preferredStats: {
      TP:   ["haste", "dualWield", "accuracy", "attack", "storeTP", "tripleAttack", "subtleBlow"],
      WS:   ["dex", "agi", "attack", "weaponSkillDamage", "critRate", "tpBonus"],
    },
  },
  PLD: {
    code: "PLD", name: "Paladin",
    roles: ["Tank"],
    relevantModes: ["Tank", "Idle", "TP"],
    preferredStats: {
      Tank: ["dt", "pdt", "mdt", "hp", "vit", "enmity", "parry", "spellInterruptDown"],
      Idle: ["dt", "pdt", "mdt", "hp", "mp"],
      TP:   ["haste", "accuracy", "storeTP", "enmity"],
    },
  },
  DRK: {
    code: "DRK", name: "Dark Knight",
    roles: ["DD"],
    relevantModes: ["TP", "WS", "MagicAccuracy"],
    preferredStats: {
      TP:           ["haste", "accuracy", "attack", "doubleAttack", "tripleAttack", "storeTP"],
      WS:           ["str", "attack", "weaponSkillDamage", "tpBonus", "critRate", "critDamage"],
      MagicAccuracy:["magicAccuracy", "int", "drainBonus", "aspirBonus"],
    },
  },
  BST: {
    code: "BST", name: "Beastmaster",
    roles: ["DD", "Support"],
    relevantModes: ["TP", "WS"],
    preferredStats: {
      TP: ["haste", "accuracy", "attack", "doubleAttack", "storeTP"],
      WS: ["str", "dex", "attack", "weaponSkillDamage"],
    },
  },
  BRD: {
    code: "BRD", name: "Bard",
    roles: ["Support", "DD"],
    relevantModes: ["Support", "TP"],
    preferredStats: {
      Support: ["songDuration", "singingSkill", "instrumentSkill", "chr"],
      TP:      ["haste", "dualWield", "accuracy", "attack", "storeTP"],
    },
  },
  RNG: {
    code: "RNG", name: "Ranger",
    roles: ["DD"],
    relevantModes: ["Ranged", "WS"],
    preferredStats: {
      Ranged: ["rangedAccuracy", "rangedAttack", "rangedStoreTP", "snapShot", "rapidShot", "agi"],
      WS:     ["dex", "agi", "weaponSkillDamage", "rangedAttack", "critRate"],
    },
  },
  SAM: {
    code: "SAM", name: "Samurai",
    roles: ["DD"],
    relevantModes: ["TP", "WS"],
    preferredStats: {
      TP:   ["haste", "storeTP", "accuracy", "attack", "doubleAttack"],
      WS:   ["str", "dex", "attack", "weaponSkillDamage", "skillchainDamage", "tpBonus"],
    },
  },
  NIN: {
    code: "NIN", name: "Ninja",
    roles: ["DD", "Tank"],
    relevantModes: ["TP", "WS", "Tank"],
    preferredStats: {
      TP:   ["haste", "dualWield", "accuracy", "attack", "storeTP", "doubleAttack", "subtleBlow"],
      WS:   ["str", "dex", "attack", "weaponSkillDamage", "critRate"],
      Tank: ["evasion", "dt", "pdt", "hp", "enmity"],
    },
  },
  DRG: {
    code: "DRG", name: "Dragoon",
    roles: ["DD"],
    relevantModes: ["TP", "WS"],
    preferredStats: {
      TP:   ["haste", "accuracy", "attack", "storeTP", "doubleAttack", "tripleAttack"],
      WS:   ["str", "dex", "attack", "weaponSkillDamage", "critRate"],
    },
  },
  SMN: {
    code: "SMN", name: "Summoner",
    roles: ["Nuker", "Support"],
    relevantModes: ["MagicAccuracy", "FastCast", "Idle"],
    preferredStats: {
      MagicAccuracy: ["magicAccuracy", "mnd", "magicAttackBonus"],
      FastCast:      ["fastCast", "haste", "conserveMP"],
      Idle:          ["mp", "dt", "mdt"],
    },
  },
  BLU: {
    code: "BLU", name: "Blue Mage",
    roles: ["DD", "Nuker", "Hybrid"],
    relevantModes: ["TP", "WS", "MagicAccuracy", "FastCast"],
    preferredStats: {
      TP:           ["haste", "accuracy", "attack", "storeTP", "doubleAttack", "dualWield"],
      WS:           ["str", "dex", "attack", "weaponSkillDamage", "critRate"],
      MagicAccuracy:["magicAccuracy", "int", "mnd", "blueMagicSkill", "magicAttackBonus"],
      FastCast:     ["fastCast", "haste", "conserveMP"],
    },
  },
  COR: {
    code: "COR", name: "Corsair",
    roles: ["DD", "Support"],
    relevantModes: ["Ranged", "WS", "Support"],
    preferredStats: {
      Ranged:  ["rangedAccuracy", "rangedAttack", "rangedStoreTP", "snapShot", "agi"],
      WS:      ["dex", "agi", "weaponSkillDamage", "rangedAttack"],
      Support: ["quickDrawBonus", "chr"],
    },
  },
  PUP: {
    code: "PUP", name: "Puppetmaster",
    roles: ["DD", "Support"],
    relevantModes: ["TP", "WS"],
    preferredStats: {
      TP: ["haste", "accuracy", "attack", "storeTP", "doubleAttack"],
      WS: ["str", "dex", "attack", "weaponSkillDamage"],
    },
  },
  DNC: {
    code: "DNC", name: "Dancer",
    roles: ["DD", "Support"],
    relevantModes: ["TP", "WS"],
    preferredStats: {
      TP:   ["haste", "dualWield", "accuracy", "attack", "storeTP", "doubleAttack"],
      WS:   ["dex", "agi", "attack", "weaponSkillDamage", "critRate"],
    },
  },
  SCH: {
    code: "SCH", name: "Scholar",
    roles: ["Nuker", "Healer", "Support"],
    relevantModes: ["MagicAccuracy", "FastCast", "Support"],
    preferredStats: {
      MagicAccuracy: ["magicAccuracy", "int", "mnd", "magicAttackBonus", "magicBurstDamage"],
      FastCast:      ["fastCast", "haste", "conserveMP"],
      Support:       ["curePotency", "mnd", "conserveMP"],
    },
  },
  GEO: {
    code: "GEO", name: "Geomancer",
    roles: ["Support"],
    relevantModes: ["Support", "MagicAccuracy", "Idle"],
    preferredStats: {
      Support:       ["geomancySkill", "indiDuration", "mnd", "conserveMP"],
      MagicAccuracy: ["magicAccuracy", "int", "mnd", "geomancySkill"],
      Idle:          ["mp", "dt", "mdt"],
    },
  },
  RUN: {
    code: "RUN", name: "Rune Fencer",
    roles: ["Tank", "DD"],
    relevantModes: ["Tank", "Idle", "TP"],
    preferredStats: {
      Tank: ["dt", "mdt", "pdt", "magicEvasion", "enmity", "parry", "hp", "vit", "spellInterruptDown"],
      Idle: ["dt", "mdt", "pdt", "hp", "magicEvasion"],
      TP:   ["haste", "accuracy", "attack", "storeTP", "dualWield", "enmity"],
    },
  },
};
