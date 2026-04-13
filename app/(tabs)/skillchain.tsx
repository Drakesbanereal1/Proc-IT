import { useState, useMemo } from "react";
import {
  ScrollView, Text, View, TouchableOpacity,
  StyleSheet, Modal, TextInput, FlatList,
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

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

interface Slot { weaponType: string; weaponSkill: string; }

const EMPTY_SLOT: Slot = { weaponType: '', weaponSkill: '' };

const LEVEL_COLORS: Record<number, string> = {
  1: "#9CA3AF", 2: "#60A5FA", 3: "#FBBF24", 4: "#C084FC",
};

const LEVEL_BG: Record<number, string> = {
  1: "#1F2937", 2: "#1E3A5F", 3: "#3D2C00", 4: "#2D1B4E",
};

const SPECIAL_TYPES = ["Relic","Mythic","Empyrean","Aeonic","Quest","Prime","BLU","SMN"];
const ELEMENTS = ["Fire","Wind","Lightning","Light","Earth","Ice","Water","Dark"];
const ELEMENT_MAP: Record<string, string[]> = {
  Fire: ["Fire"], Wind: ["Aero"], Lightning: ["Thunder"], Light: ["Light","Holy"],
  Earth: ["Stone"], Ice: ["Blizzard"], Water: ["Water"], Dark: ["Dark","Drain"],
};

function getWSForType(weaponType: string): WS[] {
  return WEAPON_TYPES.find(wt => wt.name === weaponType)?.skills.filter(ws => ws.properties.length > 0) ?? [];
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function SkillchainBuilder() {
  const [slots, setSlots] = useState<Slot[]>(Array(6).fill(null).map(() => ({ ...EMPTY_SLOT })));
  const [levelFilters, setLevelFilters] = useState({ 1: true, 2: true, 3: true, 4: false });
  const [specialFilters, setSpecialFilters] = useState({
    Relic: true, Quest: true, Mythic: true, Empyrean: true, Aeonic: true, Prime: true, BLU: true, SMN: true,
  });
  const [elemFilters, setElemFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(ELEMENTS.map(e => [e, false]))
  );
  const [modal, setModal] = useState<{ slotIdx: number; mode: 'type' | 'ws' } | null>(null);
  const [search, setSearch] = useState('');

  const updateSlot = (idx: number, patch: Partial<Slot>) =>
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, ...patch } : s));

  // ── Auto-calculate all chains from slot pairs ────────────────────────────
  const results = useMemo(() => {
    const grouped = new Map<string, { chain: SCResult; pairs: { oName: string; cName: string; oType: string; cType: string; oLv: any; cLv: any }[] }>();

    for (let i = 0; i < slots.length - 1; i++) {
      const slotA = slots[i];
      const slotB = slots[i + 1];
      if (!slotA.weaponType || !slotB.weaponType) continue;

      const openers = slotA.weaponSkill
        ? getWSForType(slotA.weaponType).filter(ws => ws.name === slotA.weaponSkill)
        : getWSForType(slotA.weaponType);
      const closers = slotB.weaponSkill
        ? getWSForType(slotB.weaponType).filter(ws => ws.name === slotB.weaponSkill)
        : getWSForType(slotB.weaponType);

      for (const opener of openers) {
        const opLv = String(opener.level);
        if (SPECIAL_TYPES.includes(opLv) && !specialFilters[opLv as keyof typeof specialFilters]) continue;
        for (const closer of closers) {
          const clLv = String(closer.level);
          if (SPECIAL_TYPES.includes(clLv) && !specialFilters[clLv as keyof typeof specialFilters]) continue;
          const chain = getBestChain(opener.properties as SCProp[], closer.properties as SCProp[]);
          if (!chain) continue;
          if (!levelFilters[chain.level as keyof typeof levelFilters]) continue;
          const anyElem = Object.values(elemFilters).some(v => v);
          if (anyElem) {
            const mapped = ELEMENTS.filter(e => elemFilters[e]).flatMap(e => ELEMENT_MAP[e]);
            if (!chain.burstElements.some(be => mapped.includes(be))) continue;
          }
          const key = `${chain.name}-${chain.level}`;
          if (!grouped.has(key)) grouped.set(key, { chain, pairs: [] });
          grouped.get(key)!.pairs.push({ oName: opener.name, cName: closer.name, oType: slotA.weaponType, cType: slotB.weaponType, oLv: opener.level, cLv: closer.level });
        }
      }
    }

    return Array.from(grouped.values()).sort((a, b) => b.chain.level - a.chain.level);
  }, [slots, levelFilters, specialFilters, elemFilters]);

  const Toggle = ({ active, onPress, label, color }: { active: boolean; onPress: () => void; label: string; color?: string }) => (
    <TouchableOpacity style={[S.toggle, active && S.toggleOn]} onPress={onPress} activeOpacity={0.7}>
      {active && <Text style={S.toggleCheck}>✓ </Text>}
      <Text style={[S.toggleLabel, active && { color: color ?? '#60A5FA' }]}>{label}</Text>
    </TouchableOpacity>
  );

  const activeCount = slots.filter(s => s.weaponType).length;

  return (
    <ScrollView style={S.container} contentContainerStyle={S.content}>
      <Text style={S.title}>Skillchain Builder</Text>

      {/* ── 6 Weapon Slots ── */}
      <Text style={S.sectionLabel}>Weapon Slots  <Text style={S.sectionHint}>(tap slot to set weapon type)</Text></Text>
      <View style={S.slotsGrid}>
        {slots.map((slot, i) => (
          <View key={i} style={[S.slotCard, slot.weaponType && S.slotCardActive]}>
            <Text style={S.slotNum}>{i + 1}</Text>
            <TouchableOpacity onPress={() => { setModal({ slotIdx: i, mode: 'type' }); setSearch(''); }} style={{ flex: 1 }}>
              <Text style={S.slotType} numberOfLines={1}>{slot.weaponType || '—  tap to set'}</Text>
            </TouchableOpacity>
            {slot.weaponType && (
              <TouchableOpacity onPress={() => { setModal({ slotIdx: i, mode: 'ws' }); setSearch(''); }} style={S.slotWSBtn}>
                <Text style={S.slotWSText} numberOfLines={1}>{slot.weaponSkill || 'Any WS'}</Text>
              </TouchableOpacity>
            )}
            {slot.weaponType && (
              <TouchableOpacity onPress={() => updateSlot(i, EMPTY_SLOT)} style={S.slotX}>
                <Text style={S.slotXText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* ── Skillchain Levels ── */}
      <Text style={S.sectionLabel}>Skillchain Levels</Text>
      <View style={S.row}>
        {([1, 2, 3] as const).map(lv => (
          <Toggle key={lv} active={levelFilters[lv]} color={LEVEL_COLORS[lv]} label={`Level ${lv}`}
            onPress={() => setLevelFilters(f => ({ ...f, [lv]: !f[lv] }))} />
        ))}
        <Toggle active={levelFilters[4]} color={LEVEL_COLORS[4]} label="Aeonic Lv 4"
          onPress={() => setLevelFilters(f => ({ ...f, 4: !f[4] }))} />
      </View>

      {/* ── Special WS ── */}
      <Text style={S.sectionLabel}>Special Weapon Skills</Text>
      <View style={S.row}>
        {(['Relic','Quest','Mythic','Empyrean','Aeonic','Prime'] as const).map(k => (
          <Toggle key={k} active={specialFilters[k]} label={k}
            onPress={() => setSpecialFilters(f => ({ ...f, [k]: !f[k] }))} />
        ))}
      </View>

      {/* ── Monster Weakness ── */}
      <Text style={S.sectionLabel}>Monster Weakness</Text>
      <View style={S.row}>
        {ELEMENTS.map(e => (
          <Toggle key={e} active={elemFilters[e]} color="#F87171" label={e}
            onPress={() => setElemFilters(f => ({ ...f, [e]: !f[e] }))} />
        ))}
      </View>

      {/* ── Results ── */}
      <Text style={S.sectionLabel}>
        Results {results.length > 0 ? `— ${results.length} chain type${results.length > 1 ? 's' : ''}` : ''}
      </Text>

      {activeCount < 2 ? (
        <View style={S.emptyBox}>
          <Text style={S.emptyText}>Set at least 2 consecutive weapon slots to see skillchains.</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={S.emptyBox}>
          <Text style={S.emptyText}>No skillchains with current slots + filters.</Text>
        </View>
      ) : (
        results.map(({ chain, pairs }) => (
          <View key={`${chain.name}-${chain.level}`} style={[S.chainGroup, { borderLeftColor: LEVEL_COLORS[chain.level] }]}>
            <View style={S.chainGroupHeader}>
              <Text style={[S.chainName, { color: LEVEL_COLORS[chain.level] }]}>{chain.name}</Text>
              <View style={[S.lvBadge, { backgroundColor: LEVEL_BG[chain.level] }]}>
                <Text style={[S.lvText, { color: LEVEL_COLORS[chain.level] }]}>Lv {chain.level}</Text>
              </View>
            </View>
            <Text style={S.burstLine}>Burst: {chain.burstElements.join(', ')}</Text>
            {pairs.map((p, i) => (
              <View key={i} style={S.pairRow}>
                <Text style={S.pairText}>
                  <Text style={S.pairWS}>{p.oName}</Text>
                  <Text style={S.pairArrow}> → </Text>
                  <Text style={S.pairWS}>{p.cName}</Text>
                </Text>
                <Text style={S.pairSub}>{p.oType !== p.cType ? `${p.oType} / ${p.cType}` : p.oType}</Text>
              </View>
            ))}
          </View>
        ))
      )}

      <View style={{ height: 40 }} />

      {/* ── Modal ── */}
      <Modal visible={!!modal} animationType="slide" transparent onRequestClose={() => setModal(null)}>
        <View style={S.overlay}>
          <View style={S.modalBox}>
            <View style={S.modalHeader}>
              <Text style={S.modalTitle}>
                {modal?.mode === 'type'
                  ? `Slot ${(modal?.slotIdx ?? 0) + 1} — Weapon Type`
                  : `Slot ${(modal?.slotIdx ?? 0) + 1} — Weapon Skill`}
              </Text>
              <TouchableOpacity onPress={() => { setModal(null); setSearch(''); }}>
                <Text style={S.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={S.searchInput}
              placeholder="Search..."
              placeholderTextColor="#6B7280"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 420 }}>
              {modal?.mode === 'type'
                ? WEAPON_TYPES
                    .filter(wt => !search.trim() || wt.name.toLowerCase().includes(search.trim().toLowerCase()))
                    .map((wt, i) => (
                      <TouchableOpacity key={i} style={S.modalItem} onPress={() => {
                        if (modal) updateSlot(modal.slotIdx, { weaponType: wt.name, weaponSkill: '' });
                        setModal(null); setSearch('');
                      }}>
                        <Text style={S.modalItemText}>{wt.name}</Text>
                        <Text style={S.modalItemSub}>{wt.skills.filter(ws => ws.properties.length > 0).length} weapon skills</Text>
                      </TouchableOpacity>
                    ))
                : [{ name: '-Any Weapon Skill-', level: '' as any, properties: [] as SCProp[] },
                   ...getWSForType(slots[modal?.slotIdx ?? 0]?.weaponType ?? '')]
                    .filter(ws => !search.trim() || ws.name.toLowerCase().includes(search.trim().toLowerCase()))
                    .map((ws, i) => (
                      <TouchableOpacity key={i} style={S.modalItem} onPress={() => {
                        if (modal) updateSlot(modal.slotIdx, { weaponSkill: ws.name === '-Any Weapon Skill-' ? '' : ws.name });
                        setModal(null); setSearch('');
                      }}>
                        <Text style={S.modalItemText}>{ws.name}</Text>
                        {ws.properties.length > 0 && (
                          <Text style={S.modalItemSub}>{ws.properties.join(' / ')} · {ws.level}</Text>
                        )}
                      </TouchableOpacity>
                    ))
              }
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#1A202C' },
  content:         { padding: 16, paddingBottom: 60 },
  title:           { fontSize: 26, fontWeight: '800', color: '#FFF', marginBottom: 16 },
  sectionLabel:    { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginTop: 18, marginBottom: 8 },
  sectionHint:     { fontSize: 11, fontWeight: '400', color: '#6B7280', textTransform: 'none', letterSpacing: 0 },

  // Slots
  slotsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  slotCard:        { width: '31%', backgroundColor: '#2D3748', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#4A5568', minHeight: 80 },
  slotCardActive:  { borderColor: '#60A5FA' },
  slotNum:         { fontSize: 18, fontWeight: '800', color: '#6B7280', marginBottom: 4 },
  slotType:        { fontSize: 12, color: '#E5E7EB', fontWeight: '600' },
  slotWSBtn:       { marginTop: 6, backgroundColor: '#374151', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  slotWSText:      { fontSize: 11, color: '#93C5FD' },
  slotX:           { position: 'absolute', top: 6, right: 6 },
  slotXText:       { color: '#6B7280', fontSize: 12 },

  // Toggles
  row:             { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  toggle:          { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2D3748', borderWidth: 1, borderColor: '#4A5568', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  toggleOn:        { borderColor: '#60A5FA', backgroundColor: '#1E3A5F' },
  toggleCheck:     { color: '#60A5FA', fontSize: 11, fontWeight: '700' },
  toggleLabel:     { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },

  // Results
  emptyBox:        { backgroundColor: '#2D3748', borderRadius: 8, padding: 20, alignItems: 'center' },
  emptyText:       { color: '#6B7280', fontSize: 13, textAlign: 'center' },
  chainGroup:      { backgroundColor: '#1F2937', borderRadius: 8, borderLeftWidth: 4, padding: 12, marginBottom: 10 },
  chainGroupHeader:{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  chainName:       { fontSize: 17, fontWeight: '800', flex: 1 },
  lvBadge:         { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  lvText:          { fontSize: 12, fontWeight: '700' },
  burstLine:       { color: '#6B7280', fontSize: 11, marginBottom: 8, fontStyle: 'italic' },
  pairRow:         { paddingVertical: 5, borderTopWidth: 1, borderTopColor: '#374151' },
  pairText:        { fontSize: 13 },
  pairWS:          { color: '#E5E7EB', fontWeight: '600' },
  pairArrow:       { color: '#6B7280' },
  pairSub:         { color: '#4B5563', fontSize: 11, marginTop: 1 },

  // Modal
  overlay:         { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalBox:        { backgroundColor: '#1F2937', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '85%', paddingBottom: 24 },
  modalHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#374151' },
  modalTitle:      { color: '#F9FAFB', fontWeight: '700', fontSize: 16 },
  modalClose:      { color: '#9CA3AF', fontSize: 20, paddingLeft: 12 },
  searchInput:     { backgroundColor: '#111827', color: '#F9FAFB', paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#374151' },
  modalItem:       { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#374151' },
  modalItemText:   { color: '#E5E7EB', fontSize: 15, fontWeight: '500' },
  modalItemSub:    { color: '#6B7280', fontSize: 11, marginTop: 2 },
});
