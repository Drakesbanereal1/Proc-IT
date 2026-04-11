import { useState, useMemo } from "react";
import {
  ScrollView, Text, View, TouchableOpacity,
  StyleSheet, Modal, TextInput,
} from "react-native";

// ─── TYPES ──────────────────────────────────────────────────────────────────

type SCProp =
  | "Transfixion" | "Compression" | "Liquefaction" | "Scission"
  | "Reverberation" | "Detonation" | "Induration" | "Impaction"
  | "Gravitation" | "Distortion" | "Fusion" | "Fragmentation"
  | "Light" | "Darkness" | "Radiance" | "Umbra";

interface SCResult {
  name: string;
  level: 1 | 2 | 3 | 4;
  properties: SCProp[];
  burstElements: string[];
}

interface WS {
  name: string;
  level: number | string;
  properties: SCProp[];
}


// ─── SKILLCHAIN COMBINATION TABLE ───────────────────────────────────────────
// Source: bg-wiki.com/ffxi/Skillchain
// Columns = CLOSER property, Rows = OPENER property

function sc(
  name: string,
  level: 1 | 2 | 3 | 4,
  properties: SCProp[],
  burstElements: string[]
): SCResult {
  return { name, level, properties, burstElements };
}

const COMBOS: Record<string, SCResult> = {
  // ── Level 1 → Level 1 (resonant pairs) ──────────────────────────────────
  "Transfixion+Transfixion":    sc("Transfixion",   1, ["Transfixion"],   ["Light", "Holy"]),
  "Compression+Reverberation":  sc("Compression",   1, ["Compression"],   ["Dark", "Drain"]),
  "Liquefaction+Liquefaction":  sc("Liquefaction",  1, ["Liquefaction"],  ["Fire"]),
  "Liquefaction+Induration":    sc("Liquefaction",  1, ["Liquefaction"],  ["Fire"]),
  "Scission+Liquefaction":      sc("Scission",      1, ["Scission"],      ["Stone"]),
  "Scission+Reverberation":     sc("Scission",      1, ["Scission"],      ["Stone"]),
  "Reverberation+Reverberation":sc("Reverberation", 1, ["Reverberation"], ["Water"]),
  "Reverberation+Scission":     sc("Reverberation", 1, ["Reverberation"], ["Water"]),
  "Detonation+Compression":     sc("Detonation",    1, ["Detonation"],    ["Aero"]),
  "Detonation+Scission":        sc("Detonation",    1, ["Detonation"],    ["Aero"]),
  "Detonation+Induration":      sc("Detonation",    1, ["Detonation"],    ["Aero"]),
  "Induration+Reverberation":   sc("Induration",    1, ["Induration"],    ["Blizzard"]),
  "Impaction+Reverberation":    sc("Impaction",     1, ["Impaction"],     ["Thunder"]),
  "Impaction+Induration":       sc("Impaction",     1, ["Impaction"],     ["Thunder"]),

  // ── Level 1 → Level 2 (4 upgrade paths) ─────────────────────────────────
  "Impaction+Liquefaction":     sc("Fusion",        2, ["Fusion"],        ["Fire", "Light"]),
  "Compression+Scission":       sc("Gravitation",   2, ["Gravitation"],   ["Stone", "Dark"]),
  "Reverberation+Detonation":   sc("Fragmentation", 2, ["Fragmentation"], ["Aero", "Thunder"]),
  "Scission+Transfixion":       sc("Distortion",    2, ["Distortion"],    ["Blizzard", "Water"]),

  // ── Level 2 → Level 2 (cycling: Grav → Dist → Fusion → Frag → Grav) ────
  "Gravitation+Distortion":     sc("Gravitation",   2, ["Gravitation"],   ["Stone", "Dark"]),
  "Distortion+Fusion":          sc("Distortion",    2, ["Distortion"],    ["Blizzard", "Water"]),
  "Fusion+Distortion":          sc("Fusion",        2, ["Fusion"],        ["Fire", "Light"]),
  "Fragmentation+Gravitation":  sc("Fragmentation", 2, ["Fragmentation"], ["Aero", "Thunder"]),

  // ── Level 2 → Level 3 ────────────────────────────────────────────────────
  "Gravitation+Gravitation":    sc("Darkness",      3, ["Darkness"],      ["Stone", "Blizzard", "Water", "Dark"]),
  "Distortion+Gravitation":     sc("Darkness",      3, ["Darkness"],      ["Stone", "Blizzard", "Water", "Dark"]),
  "Fusion+Fragmentation":       sc("Light",         3, ["Light"],         ["Fire", "Aero", "Thunder", "Light"]),
  "Fragmentation+Fusion":       sc("Light",         3, ["Light"],         ["Fire", "Aero", "Thunder", "Light"]),

  // ── Level 3 → Level 4 ────────────────────────────────────────────────────
  "Light+Light":     sc("Radiance", 4, ["Radiance"], ["Fire","Aero","Thunder","Light","Stone","Blizzard","Water"]),
  "Darkness+Darkness": sc("Umbra",  4, ["Umbra"],    ["Stone","Blizzard","Water","Dark","Fire","Aero","Thunder"]),
};

function getBestChain(openerProps: SCProp[], closerProps: SCProp[]): SCResult | null {
  let best: SCResult | null = null;
  for (const op of openerProps) {
    for (const cl of closerProps) {
      const result = COMBOS[`${op}+${cl}`];
      if (result && (!best || result.level > best.level)) {
        best = result;
      }
    }
  }
  return best;
}

// ─── WEAPON SKILL DATA ──────────────────────────────────────────────────────

const WEAPON_TYPES: { name: string; skills: WS[] }[] = [
  {
    name: "Hand-to-Hand",
    skills: [
      { name: "Combo",            level: 5,          properties: [] },
      { name: "Shoulder Tackle",  level: 40,         properties: ["Impaction"] },
      { name: "One Inch Punch",   level: 75,         properties: ["Reverberation"] },
      { name: "Backhand Blow",    level: 100,        properties: ["Compression"] },
      { name: "Raging Fists",     level: 125,        properties: ["Detonation"] },
      { name: "Spinning Attack",  level: 150,        properties: ["Reverberation", "Detonation"] },
      { name: "Howling Fist",     level: 200,        properties: ["Liquefaction", "Impaction"] },
      { name: "Dragon Kick",      level: 225,        properties: ["Fragmentation"] },
      { name: "Asuran Fists",     level: "Quest",    properties: ["Gravitation", "Liquefaction"] },
      { name: "Tornado Kick",     level: 300,        properties: ["Impaction"] },
      { name: "Shijin Spiral",    level: "Aeonic",   properties: ["Light", "Fragmentation", "Impaction"] },
      { name: "Final Heaven",     level: "Relic",    properties: ["Light", "Fusion"] },
      { name: "Victory Smite",    level: "Empyrean", properties: ["Fusion", "Impaction"] },
      { name: "Ascetic's Fury",   level: "Mythic",   properties: ["Distortion", "Reverberation"] },
      { name: "Stringing Pummel", level: "Mythic",   properties: ["Darkness", "Distortion", "Reverberation"] },
      { name: "Maru Kala",        level: "Prime",    properties: ["Light", "Fragmentation"] },
    ],
  },
  {
    name: "Dagger",
    skills: [
      { name: "Wasp Sting",    level: 50,        properties: ["Scission"] },
      { name: "Viper Bite",    level: 100,       properties: ["Scission"] },
      { name: "Gust Slash",    level: 80,        properties: ["Detonation"] },
      { name: "Shadowstitch",  level: 70,        properties: ["Reverberation"] },
      { name: "Cyclone",       level: 125,       properties: ["Detonation", "Impaction"] },
      { name: "Dancing Edge",  level: 200,       properties: ["Scission", "Detonation"] },
      { name: "Shark Bite",    level: 225,       properties: ["Scission"] },
      { name: "Evisceration",  level: 230,       properties: ["Gravitation", "Transfixion"] },
      { name: "Aeolian Edge",  level: "Quest",   properties: ["Scission", "Detonation", "Impaction"] },
      { name: "Exenterator",   level: "Aeonic",  properties: ["Light", "Fragmentation", "Scission"] },
      { name: "Mercy Stroke",  level: "Relic",    properties: ["Compression", "Transfixion"] },
      { name: "Mandalic Stab", level: "Mythic",   properties: ["Distortion", "Scission"] },
      { name: "Rudra's Storm", level: "Empyrean", properties: ["Darkness", "Distortion", "Scission"] },
      { name: "Aeneas Strike", level: "Prime",    properties: ["Light", "Fragmentation", "Scission"] },
    ],
  },
  {
    name: "Sword",
    skills: [
      { name: "Fast Blade",      level: 5,         properties: ["Scission"] },
      { name: "Burning Blade",   level: 50,        properties: ["Liquefaction"] },
      { name: "Flat Blade",      level: 60,        properties: ["Impaction"] },
      { name: "Red Lotus Blade", level: 50,        properties: ["Liquefaction", "Detonation"] },
      { name: "Circle Blade",    level: 100,       properties: ["Reverberation", "Impaction"] },
      { name: "Vorpal Blade",    level: 200,       properties: ["Scission", "Impaction"] },
      { name: "Swift Blade",     level: 225,       properties: ["Gravitation"] },
      { name: "Savage Blade",    level: "Quest",   properties: ["Fragmentation", "Scission"] },
      { name: "Requiescat",        level: "Aeonic",  properties: ["Darkness", "Gravitation", "Scission"] },
      { name: "Knights of Round",  level: "Relic",    properties: ["Light", "Fusion"] },
      { name: "Death Blossom",     level: "Mythic",   properties: ["Fragmentation", "Reverberation"] },
      { name: "Chant du Cygne",    level: "Empyrean", properties: ["Darkness", "Distortion", "Transfixion"] },
      { name: "Caliburnus",        level: "Prime",    properties: ["Light", "Fusion", "Scission"] },
    ],
  },
  {
    name: "Great Sword",
    skills: [
      { name: "Hard Slash",       level: 5,         properties: ["Scission"] },
      { name: "Power Slash",      level: 30,        properties: ["Transfixion"] },
      { name: "Frostbite",        level: 125,       properties: ["Induration"] },
      { name: "Freezebite",       level: 150,       properties: ["Detonation", "Induration"] },
      { name: "Shockwave",        level: 100,       properties: ["Reverberation"] },
      { name: "Sickle Moon",      level: 150,       properties: ["Scission", "Impaction"] },
      { name: "Spinning Slash",   level: 225,       properties: ["Fragmentation"] },
      { name: "Ground Strike",    level: "Quest",   properties: ["Fragmentation"] },
      { name: "Herculean Slash",  level: "Quest",   properties: ["Detonation", "Induration", "Impaction"] },
      { name: "Resolution",        level: "Aeonic",  properties: ["Light", "Fragmentation", "Scission"] },
      { name: "Scourge",           level: "Relic",    properties: ["Gravitation", "Distortion"] },
      { name: "Torcleaver",        level: "Mythic",   properties: ["Distortion", "Impaction"] },
      { name: "Epeolatry Strike",  level: "Prime",    properties: ["Light", "Fragmentation", "Scission"] },
    ],
  },
  {
    name: "Axe",
    skills: [
      { name: "Raging Axe",    level: 50,        properties: ["Detonation", "Impaction"] },
      { name: "Smash Axe",     level: 100,       properties: ["Reverberation", "Induration"] },
      { name: "Gale Axe",      level: 125,       properties: ["Detonation"] },
      { name: "Avalanche Axe", level: 150,       properties: ["Scission", "Impaction"] },
      { name: "Rampage",       level: 175,       properties: ["Scission"] },
      { name: "Calamity",      level: 200,       properties: ["Scission", "Impaction"] },
      { name: "Mistral Axe",   level: 225,       properties: ["Fusion"] },
      { name: "Decimation",    level: "Quest",   properties: ["Fusion", "Reverberation"] },
      { name: "Ruinator",          level: "Aeonic",  properties: ["Darkness", "Distortion", "Detonation"] },
      { name: "Onslaught",         level: "Relic",    properties: ["Distortion"] },
      { name: "Primal Rend",       level: "Mythic",   properties: ["Light", "Fragmentation", "Detonation"] },
      { name: "Dolichenus Strike", level: "Prime",    properties: ["Darkness", "Distortion", "Detonation"] },
    ],
  },
  {
    name: "Great Axe",
    skills: [
      { name: "Shield Break",   level: 30,        properties: ["Impaction"] },
      { name: "Iron Tempest",   level: 50,        properties: ["Scission"] },
      { name: "Sturmwind",      level: 100,       properties: ["Scission", "Reverberation"] },
      { name: "Armor Break",    level: 150,       properties: ["Impaction"] },
      { name: "Keen Edge",      level: 200,       properties: ["Compression"] },
      { name: "Raging Rush",    level: 175,       properties: ["Reverberation", "Induration"] },
      { name: "Full Break",     level: 225,       properties: ["Distortion"] },
      { name: "Steel Cyclone",  level: "Quest",   properties: ["Distortion", "Detonation"] },
      { name: "Fell Cleave",    level: "Quest",   properties: ["Scission", "Detonation"] },
      { name: "Upheaval",         level: "Aeonic",  properties: ["Light", "Fusion", "Compression"] },
      { name: "Metatron Torment", level: "Relic",    properties: ["Fusion"] },
      { name: "King's Justice",   level: "Mythic",   properties: ["Fusion", "Impaction"] },
      { name: "Ukko's Fury",      level: "Empyrean", properties: ["Light", "Fusion", "Compression"] },
      { name: "Helheim Strike",   level: "Prime",    properties: ["Darkness", "Gravitation", "Distortion"] },
    ],
  },
  {
    name: "Scythe",
    skills: [
      { name: "Slice",            level: 5,         properties: ["Scission"] },
      { name: "Dark Harvest",     level: 30,        properties: ["Reverberation"] },
      { name: "Shadow of Death",  level: 70,        properties: ["Reverberation", "Induration"] },
      { name: "Nightmare Scythe", level: 100,       properties: ["Scission", "Compression"] },
      { name: "Spinning Scythe",  level: 150,       properties: ["Scission", "Reverberation"] },
      { name: "Vorpal Scythe",    level: 175,       properties: ["Scission", "Transfixion"] },
      { name: "Guillotine",       level: 200,       properties: ["Induration"] },
      { name: "Cross Reaper",     level: 225,       properties: ["Distortion"] },
      { name: "Spiral Hell",      level: "Quest",   properties: ["Distortion", "Scission"] },
      { name: "Infernal Scythe",  level: "Quest",   properties: ["Reverberation", "Compression"] },
      { name: "Entropy",           level: "Aeonic",  properties: ["Darkness", "Gravitation", "Reverberation"] },
      { name: "Catastrophe",       level: "Relic",    properties: ["Darkness", "Gravitation", "Reverberation"] },
      { name: "Insurgency",        level: "Mythic",   properties: ["Distortion", "Scission"] },
      { name: "Quietus",           level: "Empyrean", properties: ["Darkness", "Distortion", "Scission"] },
      { name: "Apocalypse Strike", level: "Prime",    properties: ["Darkness", "Gravitation", "Reverberation"] },
    ],
  },
  {
    name: "Polearm",
    skills: [
      { name: "Double Thrust",   level: 5,         properties: ["Transfixion"] },
      { name: "Raiden Thrust",   level: 70,        properties: ["Impaction", "Transfixion"] },
      { name: "Thunder Thrust",  level: 100,       properties: ["Impaction", "Transfixion"] },
      { name: "Leg Sweep",       level: 150,       properties: ["Impaction"] },
      { name: "Penta Thrust",    level: 175,       properties: ["Compression"] },
      { name: "Vorpal Thrust",   level: 200,       properties: ["Reverberation", "Transfixion"] },
      { name: "Skewer",          level: 200,       properties: ["Impaction", "Transfixion"] },
      { name: "Wheeling Thrust", level: 225,       properties: ["Fusion"] },
      { name: "Impulse Drive",   level: "Quest",   properties: ["Gravitation", "Induration"] },
      { name: "Sonic Thrust",    level: "Quest",   properties: ["Scission", "Transfixion"] },
      { name: "Stardiver",         level: "Aeonic",  properties: ["Darkness", "Gravitation", "Transfixion"] },
      { name: "Geirskogul",        level: "Relic",    properties: ["Darkness", "Gravitation", "Transfixion"] },
      { name: "Drakesbane",        level: "Mythic",   properties: ["Fusion", "Transfixion"] },
      { name: "Camlann's Torment", level: "Empyrean", properties: ["Darkness", "Gravitation", "Transfixion"] },
      { name: "Gungnir Strike",    level: "Prime",    properties: ["Light", "Fusion", "Transfixion"] },
    ],
  },
  {
    name: "Katana",
    skills: [
      { name: "Blade: Rin",   level: 5,         properties: ["Transfixion"] },
      { name: "Blade: Retsu", level: 40,        properties: ["Scission"] },
      { name: "Blade: Teki",  level: 50,        properties: ["Reverberation"] },
      { name: "Blade: To",    level: 100,       properties: ["Detonation", "Induration"] },
      { name: "Blade: Chi",   level: 125,       properties: ["Impaction", "Transfixion"] },
      { name: "Blade: Ei",    level: 175,       properties: ["Compression"] },
      { name: "Blade: Jin",   level: 200,       properties: ["Detonation", "Impaction"] },
      { name: "Blade: Ten",   level: 225,       properties: ["Gravitation"] },
      { name: "Blade: Ku",    level: "Quest",   properties: ["Gravitation", "Transfixion"] },
      { name: "Blade: Yu",    level: "Quest",   properties: ["Scission", "Reverberation"] },
      { name: "Blade: Shun",  level: "Aeonic",  properties: ["Light", "Fusion", "Impaction"] },
      { name: "Blade: Metsu", level: "Relic",    properties: ["Darkness", "Distortion", "Scission"] },
      { name: "Blade: Kamu",  level: "Mythic",   properties: ["Light", "Fusion", "Impaction"] },
      { name: "Blade: Hi",    level: "Empyrean", properties: ["Darkness", "Gravitation", "Transfixion"] },
      { name: "Heishi Strike",level: "Prime",    properties: ["Light", "Fusion", "Impaction"] },
    ],
  },
  {
    name: "Great Katana",
    skills: [
      { name: "Tachi: Enpi",     level: 5,         properties: ["Transfixion", "Scission"] },
      { name: "Tachi: Hobaku",   level: 50,        properties: ["Induration"] },
      { name: "Tachi: Goten",    level: 100,       properties: ["Transfixion", "Impaction"] },
      { name: "Tachi: Kagero",   level: 125,       properties: ["Liquefaction"] },
      { name: "Tachi: Jinpu",    level: 150,       properties: ["Scission", "Detonation"] },
      { name: "Tachi: Koki",     level: 175,       properties: ["Reverberation", "Impaction"] },
      { name: "Tachi: Yukikaze", level: 200,       properties: ["Induration", "Detonation"] },
      { name: "Tachi: Gekko",    level: 225,       properties: ["Distortion", "Reverberation"] },
      { name: "Tachi: Kasha",    level: "Quest",   properties: ["Fusion", "Compression"] },
      { name: "Tachi: Ageha",    level: "Quest",   properties: ["Compression", "Scission"] },
      { name: "Tachi: Shoha",    level: "Aeonic",  properties: ["Light", "Fragmentation", "Compression"] },
      { name: "Tachi: Kaiten",   level: "Relic",    properties: ["Light", "Fragmentation", "Compression"] },
      { name: "Tachi: Rana",     level: "Mythic",   properties: ["Darkness", "Distortion", "Reverberation"] },
      { name: "Tachi: Fudo",     level: "Empyrean", properties: ["Light", "Fragmentation", "Compression"] },
      { name: "Masamune Strike", level: "Prime",    properties: ["Darkness", "Gravitation", "Compression"] },
    ],
  },
  {
    name: "Club",
    skills: [
      { name: "Shining Strike", level: 40,        properties: ["Impaction"] },
      { name: "Seraph Strike",  level: 40,        properties: ["Impaction"] },
      { name: "Brainshaker",    level: 100,       properties: ["Reverberation"] },
      { name: "Skullbreaker",   level: 150,       properties: ["Induration", "Reverberation"] },
      { name: "True Strike",    level: 175,       properties: ["Detonation", "Impaction"] },
      { name: "Judgment",       level: 200,       properties: ["Impaction"] },

      { name: "Black Halo",     level: "Quest",   properties: ["Fragmentation", "Compression"] },
      { name: "Flash Nova",     level: "Quest",   properties: ["Reverberation", "Induration"] },
      { name: "Realmrazer",     level: "Aeonic",  properties: ["Light", "Fusion", "Impaction"] },
      { name: "Randgrith",      level: "Relic",    properties: ["Transfixion", "Reverberation"] },
      { name: "Hexa Strike",    level: "Mythic",   properties: ["Fusion"] },
      { name: "Dagan",          level: "Empyrean", properties: ["Light", "Fusion", "Impaction"] },
      { name: "Yagrush Strike", level: "Prime",    properties: ["Light", "Fusion", "Impaction"] },
    ],
  },
  {
    name: "Staff",
    skills: [
      { name: "Heavy Swing",   level: 5,         properties: ["Impaction"] },
      { name: "Rock Crusher",  level: 50,        properties: ["Impaction"] },
      { name: "Earth Crusher", level: 100,       properties: ["Detonation", "Impaction"] },
      { name: "Starburst",     level: 150,       properties: ["Reverberation", "Compression"] },
      { name: "Sunburst",      level: 175,       properties: ["Reverberation", "Compression"] },
      { name: "Shell Crusher", level: 175,       properties: ["Detonation"] },
      { name: "Full Swing",    level: 200,       properties: ["Liquefaction", "Impaction"] },
      { name: "Retribution",   level: "Quest",   properties: ["Gravitation", "Reverberation"] },
      { name: "Cataclysm",     level: "Quest",   properties: ["Reverberation", "Compression"] },
      { name: "Shattersoul",      level: "Aeonic",  properties: ["Darkness", "Gravitation", "Induration"] },
      { name: "Gate of Tartarus", level: "Relic",    properties: ["Darkness", "Gravitation", "Reverberation"] },
      { name: "Omniscience",      level: "Mythic",   properties: ["Darkness", "Gravitation", "Induration"] },
      { name: "Myrkr",            level: "Empyrean", properties: ["Reverberation", "Compression"] },
      { name: "Nirvana Strike",   level: "Prime",    properties: ["Darkness", "Gravitation", "Reverberation"] },
    ],
  },
  {
    name: "Archery",
    skills: [
      { name: "Flaming Arrow",   level: 30,        properties: ["Liquefaction", "Transfixion"] },
      { name: "Piercing Arrow",  level: 60,        properties: ["Reverberation", "Transfixion"] },
      { name: "Dulling Arrow",   level: 100,       properties: ["Liquefaction", "Transfixion"] },
      { name: "Sidewinder",      level: 175,       properties: ["Reverberation", "Detonation", "Transfixion"] },
      { name: "Blast Arrow",     level: 200,       properties: ["Induration", "Transfixion"] },
      { name: "Arching Arrow",   level: 225,       properties: ["Fusion"] },
      { name: "Empyreal Arrow",  level: "Quest",   properties: ["Fusion", "Transfixion"] },
      { name: "Refulgent Arrow", level: "Quest",   properties: ["Reverberation", "Transfixion"] },
      { name: "Apex Arrow",         level: "Aeonic",  properties: ["Light", "Fragmentation", "Transfixion"] },
      { name: "Namas Arrow",        level: "Relic",    properties: ["Fusion", "Transfixion"] },
      { name: "Jishnu's Radiance",  level: "Empyrean", properties: ["Light", "Fusion", "Transfixion"] },
      { name: "Gandiva Strike",     level: "Prime",    properties: ["Light", "Fusion", "Transfixion"] },
    ],
  },
  {
    name: "Marksmanship",
    skills: [
      { name: "Hot Shot",       level: 30,        properties: ["Liquefaction", "Transfixion"] },
      { name: "Split Shot",     level: 60,        properties: ["Reverberation", "Transfixion"] },
      { name: "Sniper Shot",    level: 100,       properties: ["Liquefaction", "Transfixion"] },
      { name: "Slug Shot",      level: 175,       properties: ["Reverberation", "Transfixion", "Detonation"] },
      { name: "Blast Shot",     level: 200,       properties: ["Induration", "Transfixion"] },
      { name: "Heavy Shot",     level: 225,       properties: ["Fusion"] },
      { name: "Detonator",      level: "Quest",   properties: ["Fusion", "Transfixion"] },
      { name: "Numbing Shot",   level: "Quest",   properties: ["Induration", "Detonation", "Impaction"] },
      { name: "Last Stand",       level: "Aeonic",  properties: ["Light", "Fusion", "Reverberation"] },
      { name: "Coronach",         level: "Relic",    properties: ["Darkness", "Distortion", "Reverberation"] },
      { name: "Leaden Salute",    level: "Mythic",   properties: ["Darkness", "Gravitation", "Compression"] },
      { name: "Wildfire",         level: "Empyrean", properties: ["Darkness", "Gravitation", "Fusion"] },
      { name: "Fomalhaut Strike", level: "Prime",    properties: ["Darkness", "Distortion", "Reverberation"] },
    ],
  },
  {
    name: "Blue Magic",
    skills: [
      // Transfixion
      { name: "Wild Oats",        level: "BLU", properties: ["Transfixion"] },
      { name: "Screwdriver",      level: "BLU", properties: ["Transfixion", "Scission"] },
      { name: "Spiral Spin",      level: "BLU", properties: ["Transfixion"] },
      { name: "Heavy Strike",     level: "BLU", properties: ["Transfixion", "Fragmentation"] },
      { name: "Benthic Typhoon",  level: "BLU", properties: ["Transfixion", "Gravitation"] },
      { name: "Amorphic Spikes",  level: "BLU", properties: ["Transfixion", "Gravitation"] },
      // Scission
      { name: "Claw Cyclone",     level: "BLU", properties: ["Scission"] },
      { name: "Vanity Dive",      level: "BLU", properties: ["Scission"] },
      { name: "Empty Thrash",     level: "BLU", properties: ["Scission"] },
      { name: "Quadrastrike",     level: "BLU", properties: ["Scission"] },
      { name: "Quad. Continuum",  level: "BLU", properties: ["Scission", "Distortion"] },
      { name: "Whirl of Rage",    level: "BLU", properties: ["Detonation", "Scission"] },
      // Reverberation
      { name: "Sprout Smack",     level: "BLU", properties: ["Reverberation"] },
      { name: "Hydro Shot",       level: "BLU", properties: ["Reverberation"] },
      { name: "Tail Slap",        level: "BLU", properties: ["Reverberation"] },
      // Liquefaction
      { name: "Bludgeon",         level: "BLU", properties: ["Liquefaction"] },
      { name: "Uppercut",         level: "BLU", properties: ["Liquefaction"] },
      { name: "Asuran Claws",     level: "BLU", properties: ["Liquefaction"] },
      { name: "Barbed Crescent",  level: "BLU", properties: ["Liquefaction", "Distortion"] },
      { name: "Cannonball",       level: "BLU", properties: ["Liquefaction", "Fusion"] },
      { name: "Delta Thrust",     level: "BLU", properties: ["Detonation", "Liquefaction"] },
      // Detonation
      { name: "Foot Kick",        level: "BLU", properties: ["Detonation"] },
      { name: "Smite of Rage",    level: "BLU", properties: ["Detonation"] },
      { name: "Seedspray",        level: "BLU", properties: ["Detonation"] },
      { name: "Spinal Cleave",    level: "BLU", properties: ["Detonation"] },
      { name: "Sudden Lunge",     level: "BLU", properties: ["Detonation"] },
      // Impaction
      { name: "Battle Dance",     level: "BLU", properties: ["Impaction"] },
      { name: "Head Butt",        level: "BLU", properties: ["Impaction"] },
      { name: "Jet Stream",       level: "BLU", properties: ["Impaction"] },
      { name: "Body Slam",        level: "BLU", properties: ["Impaction"] },
      { name: "Frypan",           level: "BLU", properties: ["Impaction"] },
      { name: "Terror Touch",     level: "BLU", properties: ["Compression", "Impaction"] },
      { name: "Goblin Rush",      level: "BLU", properties: ["Impaction", "Fusion"] },
      { name: "Thrashing Assault",level: "BLU", properties: ["Impaction", "Fusion"] },
      // Induration
      { name: "Grand Slam",       level: "BLU", properties: ["Induration"] },
      { name: "Mandibular Bite",  level: "BLU", properties: ["Induration"] },
      { name: "Filamented Hold",  level: "BLU", properties: ["Induration"] },
      { name: "Frenetic Rip",     level: "BLU", properties: ["Induration"] },
      // Compression
      { name: "Queasyshroom",     level: "BLU", properties: ["Compression"] },
      // Gravitation
      { name: "Vertical Cleave",  level: "BLU", properties: ["Gravitation"] },
      { name: "Sinker Drill",     level: "BLU", properties: ["Gravitation"] },
      // Distortion
      { name: "Disseverment",     level: "BLU", properties: ["Distortion"] },
      { name: "Saurian Slide",    level: "BLU", properties: ["Distortion"] },
      // Fragmentation
      { name: "Ram Charge",       level: "BLU", properties: ["Fragmentation"] },
      { name: "Sub-zero Smash",   level: "BLU", properties: ["Fragmentation"] },
      { name: "Glutinous Dart",   level: "BLU", properties: ["Fragmentation"] },
      // Light / Darkness
      { name: "Tourbillion",      level: "BLU", properties: ["Light"] },
      { name: "Bilgestorm",       level: "BLU", properties: ["Light"] },
      { name: "Bloodrake",        level: "BLU", properties: ["Darkness"] },
    ],
  },
  {
    name: "Avatar (Blood Pacts)",
    skills: [
      // Carbuncle
      { name: "Poison Nails (Carbuncle)",     level: "SMN", properties: ["Transfixion"] },
      // Cait Sith
      { name: "Regal Scratch (Cait Sith)",    level: "SMN", properties: ["Transfixion"] },
      { name: "Regal Gash (Cait Sith)",       level: "SMN", properties: ["Detonation", "Distortion"] },
      // Titan
      { name: "Rock Throw (Titan)",           level: "SMN", properties: ["Scission"] },
      { name: "Rock Buster (Titan)",          level: "SMN", properties: ["Reverberation"] },
      { name: "Megalith Throw (Titan)",       level: "SMN", properties: ["Induration"] },
      { name: "Mountain Buster (Titan)",      level: "SMN", properties: ["Gravitation"] },
      { name: "Crag Throw (Titan)",           level: "SMN", properties: ["Gravitation"] },
      // Shiva
      { name: "Double Slap (Shiva)",          level: "SMN", properties: ["Scission"] },
      { name: "Axe Kick (Shiva)",             level: "SMN", properties: ["Induration"] },
      { name: "Rush (Shiva)",                 level: "SMN", properties: ["Distortion"] },
      // Garuda
      { name: "Claw (Garuda)",               level: "SMN", properties: ["Detonation"] },
      { name: "Predator Claws (Garuda)",      level: "SMN", properties: ["Scission", "Fragmentation"] },
      // Ramuh
      { name: "Shock Strike (Ramuh)",         level: "SMN", properties: ["Impaction"] },
      { name: "Volt Strike (Ramuh)",          level: "SMN", properties: ["Scission", "Fragmentation"] },
      { name: "Chaotic Strike (Ramuh)",       level: "SMN", properties: ["Fragmentation"] },
      // Leviathan
      { name: "Barracuda Dive (Leviathan)",   level: "SMN", properties: ["Reverberation"] },
      { name: "Tail Whip (Leviathan)",        level: "SMN", properties: ["Detonation"] },
      { name: "Spinning Dive (Leviathan)",    level: "SMN", properties: ["Detonation", "Distortion"] },
      // Ifrit
      { name: "Flaming Crush (Ifrit)",        level: "SMN", properties: ["Reverberation"] },
      { name: "Burning Strike (Ifrit)",       level: "SMN", properties: ["Impaction"] },
      { name: "Double Punch (Ifrit)",         level: "SMN", properties: ["Compression"] },
      // Fenrir
      { name: "Moonlit Charge (Fenrir)",      level: "SMN", properties: ["Compression"] },
      { name: "Eclipse Bite (Fenrir)",        level: "SMN", properties: ["Gravitation"] },
      // Diabolos
      { name: "Camisado (Diabolos)",          level: "SMN", properties: ["Compression"] },
      { name: "Blindside (Diabolos)",         level: "SMN", properties: ["Gravitation"] },
      // Siren
      { name: "Welt (Siren)",                 level: "SMN", properties: ["Scission"] },
      { name: "Hysteric Assault (Siren)",     level: "SMN", properties: ["Scission", "Fragmentation"] },
    ],
  },
];

// ─── UI CONSTANTS ────────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<number, string> = {
  1: "#9CA3AF",
  2: "#60A5FA",
  3: "#FBBF24",
  4: "#C084FC",
};

const LEVEL_BG: Record<number, string> = {
  1: "#1F2937",
  2: "#1E3A5F",
  3: "#3D2C00",
  4: "#2D1B4E",
};

const STAGE_DESCRIPTIONS: Record<number, string> = {
  1: "Same-property pairs · single element burst",
  2: "Fusion · Gravitation · Fragmentation · Distortion",
  3: "Light · Darkness · multi-element burst",
  4: "Radiance · Umbra · requires Aeonic aftermath",
};

// Props that can OPEN a chain toward each stage level
const STAGE_OPENER_PROPS: Record<number, SCProp[]> = {
  1: ["Transfixion","Compression","Liquefaction","Scission","Reverberation","Detonation","Induration","Impaction"],
  2: ["Impaction","Compression","Reverberation","Scission"],
  3: ["Gravitation","Distortion","Fusion","Fragmentation"],
  4: ["Light","Darkness"],
};

// ─── FLAT WS LIST ────────────────────────────────────────────────────────────

interface FlatWS {
  name: string;
  weaponType: string;
  level: number | string;
  properties: SCProp[];
}

const ALL_WEAPON_SKILLS: FlatWS[] = WEAPON_TYPES.flatMap(wt =>
  wt.skills
    .filter(ws => ws.properties.length > 0)
    .map(ws => ({ name: ws.name, weaponType: wt.name, level: ws.level, properties: ws.properties }))
);

function getValidOpeners(stage: number): FlatWS[] {
  const targets = STAGE_OPENER_PROPS[stage] as SCProp[];
  return ALL_WEAPON_SKILLS.filter(ws => ws.properties.some(p => targets.includes(p)));
}

function getValidClosers(openerProps: SCProp[]): FlatWS[] {
  return ALL_WEAPON_SKILLS.filter(ws => getBestChain(openerProps, ws.properties) !== null);
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function SkillchainBuilder() {
  const [stageGoal, setStageGoal] = useState<1 | 2 | 3 | 4 | null>(null);
  const [steps, setSteps] = useState<FlatWS[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState("");

  // Chains between consecutive steps
  const chains = useMemo(() => {
    const result: (SCResult | null)[] = [];
    if (steps.length < 2) return result;
    let openerProps: SCProp[] = steps[0].properties;
    for (let i = 1; i < steps.length; i++) {
      const chain = getBestChain(openerProps, steps[i].properties);
      result.push(chain);
      openerProps = chain ? chain.properties : steps[i].properties;
    }
    return result;
  }, [steps]);

  const lastChain = chains.length > 0 ? chains[chains.length - 1] : null;

  // Current active props for filtering next step
  const currentProps = useMemo((): SCProp[] => {
    if (steps.length === 0) return [];
    if (chains.length === 0) return steps[0].properties;
    for (let i = chains.length - 1; i >= 0; i--) {
      if (chains[i]) return chains[i]!.properties;
    }
    return steps[steps.length - 1].properties;
  }, [steps, chains]);

  // Valid WS to show in picker
  const validWS = useMemo((): FlatWS[] => {
    if (!stageGoal) return [];
    return steps.length === 0 ? getValidOpeners(stageGoal) : getValidClosers(currentProps);
  }, [stageGoal, steps, currentProps]);

  const filteredWS = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return validWS;
    return validWS.filter(
      ws => ws.name.toLowerCase().includes(q) || ws.weaponType.toLowerCase().includes(q)
    );
  }, [validWS, search]);

  const addStep = (ws: FlatWS) => {
    setSteps(prev => [...prev, ws]);
    setPickerVisible(false);
    setSearch("");
  };

  const removeStep = (i: number) => {
    setSteps(prev => prev.filter((_, idx) => idx !== i));
  };

  const reset = () => {
    setStageGoal(null);
    setSteps([]);
    setSearch("");
  };

  // ── Stage selection screen ──────────────────────────────────────────────────
  if (!stageGoal) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.mainTitle}>Skillchain Builder</Text>
        <Text style={styles.subtitle}>Choose your target skillchain stage</Text>
        {([1, 2, 3, 4] as const).map(stage => (
          <TouchableOpacity
            key={stage}
            style={[styles.stageBtn, { borderColor: LEVEL_COLORS[stage] }]}
            onPress={() => setStageGoal(stage)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.stageBtnTitle}>Stage {stage}</Text>
              <Text style={styles.stageBtnDesc}>{STAGE_DESCRIPTIONS[stage]}</Text>
            </View>
            <Text style={[styles.stageLvBadge, { color: LEVEL_COLORS[stage] }]}>Lv {stage}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How Skillchains Work</Text>
          {([1,2,3,4] as const).map(lv => (
            <View key={lv} style={styles.infoRow}>
              <Text style={[styles.infoLevel, { color: LEVEL_COLORS[lv] }]}>Lv {lv}</Text>
              <Text style={styles.infoText}>{STAGE_DESCRIPTIONS[lv]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  // ── Builder screen ──────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.builderHeader}>
        <TouchableOpacity onPress={reset} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Stages</Text>
        </TouchableOpacity>
        <View style={[styles.goalBadge, { borderColor: LEVEL_COLORS[stageGoal] }]}>
          <Text style={[styles.goalBadgeText, { color: LEVEL_COLORS[stageGoal] }]}>
            Goal: Stage {stageGoal}
          </Text>
        </View>
      </View>

      {/* Steps */}
      {steps.map((ws, i) => {
        const chain = i < chains.length ? chains[i] : null;
        return (
          <View key={i}>
            <View style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.wsName}>{ws.name}</Text>
                <Text style={styles.wsWeapon}>{ws.weaponType} · {ws.level}</Text>
                <Text style={styles.wsProps}>{ws.properties.join(" / ")}</Text>
              </View>
              <TouchableOpacity onPress={() => removeStep(i)} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {i < steps.length - 1 && (
              <View style={[
                styles.chainBadge,
                { backgroundColor: chain ? LEVEL_BG[chain.level] : "#1A202C" },
              ]}>
                {chain ? (
                  <>
                    <Text style={[styles.chainName, { color: LEVEL_COLORS[chain.level] }]}>
                      ↓  {chain.name}  (Level {chain.level})
                    </Text>
                    <Text style={styles.chainBurst}>Burst: {chain.burstElements.join(", ")}</Text>
                  </>
                ) : (
                  <Text style={styles.noChain}>↓  No skillchain formed</Text>
                )}
              </View>
            )}
          </View>
        );
      })}

      {/* Add step */}
      {steps.length < 6 && (
        <TouchableOpacity style={styles.addBtn} onPress={() => setPickerVisible(true)}>
          <Text style={styles.addBtnText}>+ Add Step {steps.length + 1}</Text>
        </TouchableOpacity>
      )}

      {/* Final result */}
      {lastChain && (
        <View style={[styles.finalCard, { borderColor: LEVEL_COLORS[lastChain.level] }]}>
          <Text style={styles.finalLabel}>Final Skillchain</Text>
          <Text style={[styles.finalName, { color: LEVEL_COLORS[lastChain.level] }]}>
            {lastChain.name} — Level {lastChain.level}
          </Text>
          <Text style={styles.finalBurst}>Magic Burst: {lastChain.burstElements.join(", ")}</Text>
        </View>
      )}

      {/* Clear */}
      {steps.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={reset}>
          <Text style={styles.clearBtnText}>Clear &amp; Change Stage</Text>
        </TouchableOpacity>
      )}

      {/* Nuke wall info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Consecutive Elemental Damage Penalty (Nuke Wall)</Text>
        <Text style={styles.infoBody}>
          On Notorious Monsters, same-element spells back-to-back trigger a penalty:
        </Text>
        <View style={styles.penaltyRow}>
          <Text style={styles.penaltyNum}>2nd nuke</Text>
          <Text style={styles.penaltyVal}>−20% damage</Text>
        </View>
        <View style={styles.penaltyRow}>
          <Text style={styles.penaltyNum}>3rd+ nukes</Text>
          <Text style={styles.penaltyVal}>−40–50% damage</Text>
        </View>
        <Text style={styles.infoBody}>
          Resets after 5 seconds. Magic bursts off a skillchain bypass this penalty entirely.
        </Text>
      </View>

      {/* Picker Modal */}
      <Modal visible={pickerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {steps.length === 0 ? `Stage ${stageGoal} Openers` : "Choose Next Skill"}
              </Text>
              <TouchableOpacity onPress={() => { setPickerVisible(false); setSearch(""); }}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search skill or weapon type..."
              placeholderTextColor="#6B7280"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />

            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredWS.length === 0 ? (
                <Text style={styles.emptyMsg}>No matching skills.</Text>
              ) : (
                filteredWS.map((ws, i) => {
                  const chainResult = steps.length > 0
                    ? getBestChain(currentProps, ws.properties)
                    : null;
                  return (
                    <TouchableOpacity
                      key={`${ws.name}-${i}`}
                      style={styles.pickerItem}
                      onPress={() => addStep(ws)}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={styles.pickerItemRow}>
                          <Text style={styles.pickerItemText}>{ws.name}</Text>
                          {chainResult && (
                            <Text style={[
                              styles.chainResultBadge,
                              { color: LEVEL_COLORS[chainResult.level] },
                            ]}>
                              → {chainResult.name}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.pickerItemSub}>
                          {ws.weaponType} · {ws.level} · {ws.properties.join(" / ")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1A202C" },
  mainTitle: { fontSize: 28, fontWeight: "800", color: "#FFFFFF", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#9CA3AF", fontStyle: "italic", marginBottom: 24 },

  // Stage selection
  stageBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  stageBtnTitle: { color: "#F9FAFB", fontWeight: "700", fontSize: 17 },
  stageBtnDesc: { color: "#9CA3AF", fontSize: 13, marginTop: 3 },
  stageLvBadge: { fontWeight: "800", fontSize: 20, marginLeft: 12 },

  // Builder header
  builderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backLink: { paddingVertical: 6, paddingRight: 12 },
  backLinkText: { color: "#60A5FA", fontWeight: "600", fontSize: 14 },
  goalBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  goalBadgeText: { fontWeight: "700", fontSize: 13 },

  // Steps
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    borderRadius: 8,
    marginBottom: 4,
    overflow: "hidden",
  },
  stepNum: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "#4A5568",
  },
  stepNumText: { color: "#E5E7EB", fontWeight: "700", fontSize: 16 },
  stepInfo: { flex: 1, paddingVertical: 10, paddingHorizontal: 12 },
  wsName: { color: "#F9FAFB", fontWeight: "600", fontSize: 15 },
  wsWeapon: { color: "#9CA3AF", fontSize: 12, marginTop: 1 },
  wsProps: { color: "#60A5FA", fontSize: 12, marginTop: 2 },
  removeBtn: { paddingHorizontal: 14, paddingVertical: 14 },
  removeBtnText: { color: "#FC8181", fontSize: 16, fontWeight: "700" },

  // Chain badge
  chainBadge: { marginLeft: 36, marginBottom: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  chainName: { fontWeight: "700", fontSize: 14 },
  chainBurst: { color: "#9CA3AF", fontSize: 12, marginTop: 1 },
  noChain: { color: "#4B5563", fontSize: 13, fontStyle: "italic" },

  // Buttons
  addBtn: {
    borderWidth: 1,
    borderColor: "#4A5568",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  addBtnText: { color: "#60A5FA", fontWeight: "600", fontSize: 15 },
  clearBtn: { padding: 12, alignItems: "center", marginBottom: 4 },
  clearBtnText: { color: "#FC8181", fontSize: 14 },

  // Final card
  finalCard: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#111827",
  },
  finalLabel: {
    color: "#6B7280",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  finalName: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  finalBurst: { color: "#D1D5DB", fontSize: 14 },

  // Info
  infoSection: { backgroundColor: "#1F2937", borderRadius: 8, padding: 14, marginTop: 20, marginBottom: 4 },
  infoTitle: { color: "#E5E7EB", fontWeight: "700", fontSize: 15, marginBottom: 10 },
  infoRow: { flexDirection: "row", marginBottom: 8, alignItems: "flex-start" },
  infoLevel: { fontWeight: "700", fontSize: 13, width: 44, marginTop: 1 },
  infoText: { flex: 1, color: "#9CA3AF", fontSize: 13, lineHeight: 19 },
  infoBody: { color: "#9CA3AF", fontSize: 13, lineHeight: 20, marginBottom: 8 },
  penaltyRow: {
    flexDirection: "row",
    backgroundColor: "#2D3748",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    justifyContent: "space-between",
  },
  penaltyNum: { color: "#E5E7EB", fontWeight: "600", fontSize: 13 },
  penaltyVal: { color: "#FC8181", fontWeight: "700", fontSize: 13 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#1F2937", borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "80%", paddingBottom: 24 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  modalTitle: { color: "#F9FAFB", fontWeight: "700", fontSize: 17 },
  modalClose: { color: "#9CA3AF", fontSize: 20, paddingLeft: 12 },
  searchInput: {
    backgroundColor: "#111827",
    color: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  emptyMsg: { color: "#6B7280", textAlign: "center", marginTop: 24, fontSize: 14 },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  pickerItemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  pickerItemText: { color: "#E5E7EB", fontSize: 15, fontWeight: "500" },
  chainResultBadge: { fontSize: 12, fontWeight: "700" },
  pickerItemSub: { color: "#6B7280", fontSize: 12, marginTop: 2 },
});
