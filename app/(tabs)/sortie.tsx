import { useState } from "react";
import { ScrollView, Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface SortieObjective {
  chest: string;
  objective: string;
  reward: string;
}

interface SortieSector {
  id: string;
  title: string;
  objectives: SortieObjective[];
}

interface BossData {
  id: string;
  name: string;
  sector: string;
  image: any;
  targetTime?: string;
  buffs?: string[];
  mechanics?: string[];
  strategy: string[];
  tips?: string[];
}

// ─── SECTOR OBJECTIVES DATA ──────────────────────────────────────────────────

const sortieSectors: SortieSector[] = [
  {
    id: "A", title: "Sector A Objectives",
    objectives: [
      { chest: "Chest #A1",  objective: "Open any unlocked Gate #A.",                                                           reward: "100 Gallimaufry, Ra'Kaznar Key A" },
      { chest: "Chest #A2",  objective: "Cast magic next to Diaphanous Device #A.",                                             reward: "100 Gallimaufry, Ra'Kaznar Plate A" },
      { chest: "Chest #A3",  objective: "Vanquish 3 Abject foes using single-target magic for the killing blow.",               reward: "100 Gallimaufry, Ra'Kaznar Shard A" },
      { chest: "Chest #A4",  objective: "Vanquish 3 more Abject foes using single-target magic.",                               reward: "100 Gallimaufry, Ra'Kaznar Metal A" },
      { chest: "Chest #A5",  objective: "Interact with Diaphanous Bitzer #A while naked.",                                      reward: "100 Gallimaufry, Ra'Kaznar Sheet A" },
      { chest: "Casket #A1", objective: "Vanquish 5 Abject foes (excluding Abject Obdella).",                                   reward: "Old Case / Sapphire" },
      { chest: "Casket #A2", objective: "/heal in the area between Gate #A1 and the Abject Leeches.",                           reward: "Old Case / Sapphire" },
      { chest: "Coffer #A",  objective: "Vanquish Abject Obdella.",                                                             reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "B", title: "Sector B Objectives",
    objectives: [
      { chest: "Chest #B1",  objective: "Open Gates #B1 through #B6 in order.",                                                 reward: "100 Gallimaufry, Ra'Kaznar Key B" },
      { chest: "Chest #B2",  objective: "/hurray with Diaphanous Device #B.",                                                   reward: "100 Gallimaufry, Ra'Kaznar Plate B" },
      { chest: "Chest #B3",  objective: "Perform a Weapon Skill on 5 Biune foes.",                                              reward: "100 Gallimaufry, Ra'Kaznar Shard B" },
      { chest: "Chest #B4",  objective: "Perform a Weapon Skill on 5 more Biune foes.",                                         reward: "100 Gallimaufry, Ra'Kaznar Metal B" },
      { chest: "Chest #B5",  objective: "Interact with Diaphanous Bitzer #B after traveling from entrance on foot.",            reward: "100 Gallimaufry, Ra'Kaznar Sheet B" },
      { chest: "Casket #B1", objective: "Vanquish 3 Biune foes within 30s of gaining enmity.",                                  reward: "Old Case / Sapphire" },
      { chest: "Casket #B2", objective: "Open any Locked Gate #B.",                                                             reward: "Old Case / Sapphire" },
      { chest: "Coffer #B",  objective: "Vanquish Biune Porxie after meeting the Casket #B1 objective.",                        reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "C", title: "Sector C Objectives",
    objectives: [
      { chest: "Chest #C1",  objective: "Open Gate #C1 or #C2 before defeating any enemies.",                                   reward: "100 Gallimaufry, Ra'Kaznar Key C" },
      { chest: "Chest #C2",  objective: "Pull a Cachaemic foe to Device #C and defeat it there.",                               reward: "100 Gallimaufry, Ra'Kaznar Plate C" },
      { chest: "Chest #C3",  objective: "Perform a Magic Burst on 3 Cachaemic foes.",                                           reward: "100 Gallimaufry, Ra'Kaznar Shard C" },
      { chest: "Chest #C4",  objective: "Perform a Magic Burst on 3 more Cachaemic foes.",                                      reward: "100 Gallimaufry, Ra'Kaznar Metal C" },
      { chest: "Chest #C5",  objective: "Vanquish one Cachaemic foe, Materialize foes at Device #C, then interact with Bitzer #C.", reward: "100 Gallimaufry, Ra'Kaznar Sheet C" },
      { chest: "Casket #C1", objective: "Vanquish 3 Cachaemic foes within 15s of gaining enmity.",                              reward: "Old Case / Sapphire" },
      { chest: "Casket #C2", objective: "Vanquish all Cachaemic foes.",                                                         reward: "Old Case / Sapphire" },
      { chest: "Coffer #C",  objective: "Vanquish Cachaemic Bhoot within 5 minutes of its spawn.",                              reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "D", title: "Sector D Objectives",
    objectives: [
      { chest: "Chest #D1",  objective: "Open Gates #D1 and #D2 within two minutes of each other.",                             reward: "100 Gallimaufry, Ra'Kaznar Key D" },
      { chest: "Chest #D2",  objective: "Drop your Obsid. Wing at Diaphanous Device #D.",                                       reward: "100 Gallimaufry, Ra'Kaznar Plate D" },
      { chest: "Chest #D3",  objective: "Perform a 4-step Skillchain on 3 Demisang foes.",                                      reward: "100 Gallimaufry, Ra'Kaznar Shard D" },
      { chest: "Chest #D4",  objective: "Perform a 4-step Skillchain on 3 more Demisang foes.",                                 reward: "100 Gallimaufry, Ra'Kaznar Metal D" },
      { chest: "Chest #D5",  objective: "Vanquish all Demisang foes, then interact with Diaphanous Bitzer #D.",                 reward: "100 Gallimaufry, Ra'Kaznar Sheet D" },
      { chest: "Casket #D1", objective: "Vanquish 6 Demisang foes of different jobs.",                                          reward: "Old Case / Sapphire" },
      { chest: "Casket #D2", objective: "Vanquish Demisang foes in order: WAR, MNK, WHM, BLM, RDM, THF.",                      reward: "Old Case / Sapphire" },
      { chest: "Coffer #D",  objective: "Vanquish Demisang Deleterious, then any 3 Demisang foes.",                             reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "E", title: "Sector E Objectives",
    objectives: [
      { chest: "Chest #E",   objective: "Defeat Esurient Botulus with majority damage from behind.",                            reward: "100 Gallimaufry, Ra'Kaznar Metal E" },
      { chest: "Casket #E1", objective: "Vanquish 12 Esurient foes in the Bitzer room.",                                        reward: "Old Case / Sapphire" },
      { chest: "Casket #E2", objective: "Vanquish 15 Esurient Flan.",                                                           reward: "Old Case / Sapphire" },
      { chest: "Coffer #E",  objective: "Vanquish the 6 mini-Naakuals that appear after 5 minutes.",                            reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "F", title: "Sector F Objectives",
    objectives: [
      { chest: "Chest #F",   objective: "Vanquish Fetid Ixion while the horn is broken.",                                       reward: "100 Gallimaufry, Ra'Kaznar Metal F" },
      { chest: "Casket #F1", objective: "Interact with the Bitzer while wearing 5/5 Empyrean Armor.",                           reward: "Old Case / Sapphire" },
      { chest: "Casket #F2", objective: "Vanquish all Fetid Veela.",                                                             reward: "Old Case / Sapphire" },
      { chest: "Coffer #F",  objective: "Vanquish the 6 mini-Naakuals that appear on re-entry.",                                reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "G", title: "Sector G Objectives",
    objectives: [
      { chest: "Chest #G",   objective: "Vanquish Gyvewrapped Naraka.",                                                         reward: "100 Gallimaufry, Ra'Kaznar Metal G" },
      { chest: "Casket #G1", objective: "Target and stand near the Bitzer for 30 seconds.",                                     reward: "Old Case / Sapphire" },
      { chest: "Casket #G2", objective: "Vanquish 19 Gyvewrapped Dullahan.",                                                    reward: "Old Case / Sapphire" },
      { chest: "Coffer #G",  objective: "Vanquish the 6 mini-Naakuals in the correct order.",                                   reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "H", title: "Sector H Objectives",
    objectives: [
      { chest: "Chest #H",   objective: "Vanquish Haughty Tulittia after doing significant indirect damage.",                   reward: "100 Gallimaufry, Ra'Kaznar Metal H" },
      { chest: "Casket #H1", objective: "Leave and re-enter Sector H.",                                                         reward: "Old Case / Sapphire" },
      { chest: "Casket #H2", objective: "Killing all Haughty Paladin will spawn the chest.",                                    reward: "Old Case / Sapphire" },
      { chest: "Coffer #H",  objective: "Vanquish 6 mini-Naakuals after defeating 8 different Haughty jobs.",                   reward: "Old Case / Sapphire" },
    ],
  },
];

// ─── BOSS DATA ────────────────────────────────────────────────────────────────

const sortieBosses: BossData[] = [
  {
    id: "degei", name: "Degei", sector: "Zone D",
    image: require("../../assets/images/Degei.png"),
    targetTime: "≤4 minutes",
    buffs: [
      "BRD: HM, Min5, Min4, Mad, Aria",
      "RDM: Haste, Phalanx, Dia, Distract",
      "GEO: Indi-Fury, Geo-Frailty (optional BoG)",
      "COR: Crooked Chaos, Sam",
    ],
    strategy: [
      "Handle elemental procs efficiently",
      "Keep rolls active",
      "Defeat cleanly before adds spawn",
    ],
  },
  {
    id: "aita", name: "Aita", sector: "Zone H",
    image: require("../../assets/images/Aita.png"),
    targetTime: "≤6 minutes",
    buffs: [
      "BRD: HM, Min5, Min4, Mad, Aria",
      "RDM: Haste, Phalanx, Gravity, Refresh",
      "GEO: Indi-Gravity, BoG Geo-Frailty, Entrust Haste or Fury",
      "COR: Crooked Chaos, Sam",
    ],
    strategy: [
      "RDM: Stymie + Spontaneity → Gravity II",
      "PLD: Stay 20–25y away to avoid TP cleaves",
      "GEO: Handle !! procs when needed",
      "DNC: Super Jump after two WS to shed hate",
    ],
  },
  {
    id: "ghatjot", name: "Ghatjot", sector: "Zone A",
    image: require("../../assets/images/Ghatjot.png"),
    targetTime: "≤5 minutes",
    buffs: [
      "BRD: HM, Min5, Min4, Mad, Aria",
      "RDM: Haste, Phalanx, Frazzle III, Impact",
      "GEO: Indi-Fury, Geo-Frailty",
      "COR: Crooked Chaos, Sam",
    ],
    strategy: [
      "Maintain debuffs (Frazzle III, Impact)",
      "Prioritize stability over burst",
    ],
  },
  {
    id: "leshonn", name: "Leshonn", sector: "Zone B",
    image: require("../../assets/images/Leshonn.png"),
    targetTime: "≤4 minutes",
    buffs: [
      "BRD: HM, Min5, Min4, Mad, Aria",
      "RDM: Haste, Phalanx, Dia",
      "GEO: Indi-Fury, Geo-Frailty",
      "COR: Crooked Chaos, Sam",
    ],
    strategy: [
      "Standard buff rotation",
      "Maintain DPS uptime",
      "Handle mechanics cleanly",
    ],
  },
  {
    id: "skomora", name: "Skomora", sector: "Zone C",
    image: require("../../assets/images/Skomora.png"),
    targetTime: "≤5 minutes",
    buffs: [
      "BRD: HM, Min5, Min4, Mad, Aria",
      "RDM: Haste, Phalanx, Dia",
      "GEO: Indi-Fury, Geo-Frailty",
      "COR: Crooked Chaos, Sam",
    ],
    strategy: [
      "GEO & DNC: Defeat 3 Corse for objective",
      "3rd kill on center tile spawns extra chest",
      "Maintain Indi-Fury",
    ],
  },
  {
    id: "triboulex", name: "Triboulex", sector: "Basement G",
    image: require("../../assets/images/Triboulex.png"),
    targetTime: "≤6 minutes",
    buffs: [
      "BRD: HM, Min5, Min4, Mad, Aria",
      "RDM: Haste, Phalanx, Distract",
      "GEO: Indi-Fury, Geo-Frailty",
      "COR: Crooked Chaos, Sam",
      "PLD: Holy Circle, Enlight, Crusade",
    ],
    strategy: [
      "PLD: Face-tank north side; DDs attack south at 5y",
      "Avoid unnecessary burst to prevent double AoEs",
    ],
    tips: ["One member locate exit before entering boss"],
  },
  {
    id: "gartell", name: "Gartell", sector: "Basement F",
    image: require("../../assets/images/Gartell.png"),
    targetTime: "≤6 minutes",
    buffs: [
      "BRD: HM, Min5, Min4, Mad, Aria (or double Mad if acc capped)",
      "RDM: Haste, Phalanx, Gravity, Distract",
      "GEO: Indi-Gravity, BoG Geo-Frailty, Entrust Fury",
      "COR: Crooked Chaos, Sam",
    ],
    strategy: [
      "RDM: Bind → Gravity II for control",
      "PLD: Stay 20–25y from boss",
      "DNC: Super Jump after two WS to drop hate",
      "GEO/RDM: MB Blizzard for proc only if safe",
      "Avoid melee WS during TP drain phase",
    ],
    tips: ["One member locate exit before entering boss"],
  },
  {
    id: "dhartok", name: "Dhartok", sector: "Basement E",
    image: require("../../assets/images/Dhartok.png"),
    targetTime: "≤5 minutes",
    buffs: [
      "BRD: HM, Min5, Min4, Mad, Aria",
      "RDM: Haste, Phalanx, Distract",
      "GEO: Indi-Fury, Geo-Frailty (optional BoG)",
      "COR: Crooked Chaos, Sam",
    ],
    strategy: [
      "PLD: Kite and ignore ranged spit damage",
      "Skip TP procs under 25% HP and finish cleanly",
    ],
  },
  {
    id: "aminon", name: "Aminon", sector: "Final Area",
    image: require("../../assets/images/Aminon.png"),
    targetTime: "Varies",
    buffs: [
      "BRD (SV): HM, Min5, Mad, Mad, Aria, Dark Threnody II",
      "RDM: Haste, Phalanx, Frazzle, Refresh",
      "GEO: Indi-Fury, (Bolster) Geo-Frailty, Entrust Indi-STR",
      "COR: Crooked Tactician's, Miser's",
      "PLD: Enlight, Crusade",
    ],
    mechanics: [
      "Bane of Tartarus: Large AoE (magic + dispels) every ~4 minutes",
      "Incessant Void: Full dispel — rebuff after it resolves",
      "Elemental Rotation: Each TP move grants absorb; cast opposite element to proc blue",
      "Chain 5 correct procs → Red proc → Clears fetters",
    ],
    strategy: [
      "PLD pulls Aminon to entrance corner; party stacks opposite",
      "RDM handles first counter-element proc",
      "COR + RDM alternate Absorb-TP casts every 10–12s",
      "DNC maintains Steps and Waltzes; Fan Dance during Bane",
      "GEO Bolster + BRD SV for burst windows",
    ],
    tips: [
      "GEO may use Fade for HM safety",
      "Avoid blind WS macros — latency can desync procs",
      "Missing Absorb-TP casts increases TP spikes",
      "Incorrect elements heal Aminon — verify before casting",
      "Never WS before buffs and bubbles stabilize",
    ],
  },
];


// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function SectorCard({ sector }: { sector: SortieSector }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.sectorCard}>
      <TouchableOpacity style={styles.sectorHeaderRow} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <Text style={styles.sectorHeader}>{sector.title}</Text>
        <Text style={styles.toggleHint}>{open ? 'tap to close' : 'tap to open'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeader, { flex: 1.5 }]}>Chest</Text>
            <Text style={[styles.tableHeader, { flex: 4 }]}>Objective</Text>
            <Text style={[styles.tableHeader, { flex: 2.5 }]}>Reward</Text>
          </View>
          {sector.objectives.map((obj, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5, color: '#F6C90E' }]}>{obj.chest}</Text>
              <Text style={[styles.tableCell, { flex: 4 }]}>{obj.objective}</Text>
              <Text style={[styles.tableCell, { flex: 2.5 }]}>{obj.reward}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function BossCard({ boss }: { boss: BossData }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.bossCard}>
      <TouchableOpacity style={styles.bossHeader} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <Image source={boss.image} style={styles.bossThumbnail} resizeMode="cover" />
        <View style={styles.bossHeaderText}>
          <Text style={styles.bossName}>{boss.name}</Text>
          <Text style={styles.bossSector}>{boss.sector}</Text>
          {boss.targetTime && <Text style={styles.bossTarget}>Target: {boss.targetTime}</Text>}
        </View>
        <Text style={styles.toggleHint}>{open ? 'tap to close' : 'tap to open'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.bossBody}>
          <Image source={boss.image} style={styles.bossImage} resizeMode="contain" />

          {boss.buffs && boss.buffs.length > 0 && (
            <View style={styles.bossSection}>
              <Text style={styles.bossSectionTitle}>Buffs</Text>
              {boss.buffs.map((b, i) => <Text key={i} style={styles.bullet}>• {b}</Text>)}
            </View>
          )}

          {boss.mechanics && boss.mechanics.length > 0 && (
            <View style={styles.bossSection}>
              <Text style={[styles.bossSectionTitle, { color: '#F87171' }]}>Mechanics</Text>
              {boss.mechanics.map((m, i) => <Text key={i} style={styles.bullet}>• {m}</Text>)}
            </View>
          )}

          <View style={styles.bossSection}>
            <Text style={styles.bossSectionTitle}>Strategy</Text>
            {boss.strategy.map((s, i) => <Text key={i} style={styles.bullet}>• {s}</Text>)}
          </View>

          {boss.tips && boss.tips.length > 0 && (
            <View style={styles.bossSection}>
              <Text style={[styles.bossSectionTitle, { color: '#FBBF24' }]}>Tips</Text>
              {boss.tips.map((t, i) => <Text key={i} style={styles.bullet}>• {t}</Text>)}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Sortie() {
  const [tab, setTab] = useState<'objectives' | 'bosses'>('objectives');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.mainTitle}>Sortie</Text>

      {/* Route + Party */}
      <View style={styles.infoRow}>
        <View style={[styles.infoBox, { borderLeftColor: '#39D353' }]}>
          <Text style={styles.infoLabel}>Route</Text>
          <Text style={styles.infoValue}>D → H → A → B → C → G → F → E → Aminon</Text>
          <Text style={styles.infoSub}>~42–46 min normal · ~54–58 min hard</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={[styles.infoBox, { borderLeftColor: '#60A5FA' }]}>
          <Text style={styles.infoLabel}>Party</Text>
          <Text style={styles.infoValue}>PLD / DNC / COR / RDM / GEO / BRD</Text>
          <Text style={styles.infoSub}>Alt: replace DNC with DRK for hybrid Absorb-TP</Text>
        </View>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabs}>
        {(['objectives', 'bosses'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'objectives' ? 'Objectives' : 'Bosses'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Objectives tab */}
      {tab === 'objectives' && (
        <View>
          <Text style={styles.description}>
            Sortie is a high-end battlefield where players complete objectives to earn rewards.
          </Text>
          {sortieSectors.map(s => <SectorCard key={s.id} sector={s} />)}
        </View>
      )}

      {/* Bosses tab */}
      {tab === 'bosses' && (
        <View>
          <Text style={styles.description}>
            Tap each boss to expand buffs, mechanics, and strategy.
          </Text>
          {sortieBosses.map(b => <BossCard key={b.id} boss={b} />)}

          {/* ── Gallimaufry Tables ── */}
          <Text style={styles.galliTitle}>Minor NM Gallimaufry</Text>
          <View style={styles.galliTable}>
            <View style={styles.galliHeaderRow}>
              <Text style={[styles.galliHeader, { flex: 1 }]}>Sector</Text>
              <Text style={[styles.galliHeader, { flex: 3 }]}>NM</Text>
              <Text style={[styles.galliHeader, { flex: 2, textAlign: 'right' }]}>Gallimaufry</Text>
            </View>
            {[
              { sector: 'A', nm: 'Abject Obdella',      galli: '195' },
              { sector: 'B', nm: 'Biune Porxie',         galli: '255' },
              { sector: 'C', nm: 'Cachaemic Bhoot',      galli: '315' },
              { sector: 'D', nm: 'Demisang Deleterious', galli: '375' },
              { sector: 'E', nm: 'Esurient Botulus',     galli: '435' },
              { sector: 'F', nm: 'Fetid Ixion',          galli: '450' },
              { sector: 'G', nm: 'Gyvewrapped Naraka',   galli: '465' },
              { sector: 'H', nm: 'Haughty Tulittia',     galli: '480' },
            ].map((r, i) => (
              <View key={i} style={[styles.galliRow, i % 2 === 1 && styles.galliRowAlt]}>
                <Text style={[styles.galliCell, { flex: 1, fontWeight: '700', color: C.yellow }]}>{r.sector}</Text>
                <Text style={[styles.galliCell, { flex: 3, color: '#A78BFA' }]}>{r.nm}</Text>
                <Text style={[styles.galliCell, { flex: 2, textAlign: 'right' }]}>{r.galli}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.galliTitle}>Major NM Gallimaufry</Text>
          <View style={styles.galliTable}>
            <View style={styles.galliHeaderRow}>
              <Text style={[styles.galliHeader, { flex: 1 }]}>Sector</Text>
              <Text style={[styles.galliHeader, { flex: 3 }]}>NM</Text>
              <Text style={[styles.galliHeader, { flex: 2, textAlign: 'right' }]}>Gallimaufry</Text>
            </View>
            {[
              { sector: 'A', nm: 'Ghatjot',   galli: '2000'  },
              { sector: 'B', nm: 'Leshonn',   galli: ''      },
              { sector: 'C', nm: 'Skomora',   galli: ''      },
              { sector: 'D', nm: 'Degei',     galli: ''      },
              { sector: 'E', nm: 'Dhartok',   galli: '10000' },
              { sector: 'F', nm: 'Gartell',   galli: ''      },
              { sector: 'G', nm: 'Triboulex', galli: ''      },
              { sector: 'H', nm: 'Aita',      galli: ''      },
            ].map((r, i) => (
              <View key={i} style={[styles.galliRow, i % 2 === 1 && styles.galliRowAlt]}>
                <Text style={[styles.galliCell, { flex: 1, fontWeight: '700', color: C.yellow }]}>{r.sector}</Text>
                <Text style={[styles.galliCell, { flex: 3, color: '#A78BFA' }]}>{r.nm}</Text>
                <Text style={[styles.galliCell, { flex: 2, textAlign: 'right' }]}>{r.galli}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

    </ScrollView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const C = {
  bg:      '#0D1117',
  surface: '#161B22',
  border:  '#30363D',
  yellow:  '#F6C90E',
  green:   '#39D353',
  red:     '#F85149',
  muted:   '#8B949E',
  text:    '#E6EDF3',
  blue:    '#58A6FF',
};

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: C.bg },
  scrollContent:  { padding: 16, paddingBottom: 60 },
  mainTitle:      { fontSize: 26, fontWeight: '800', color: C.yellow, marginBottom: 12 },
  description:    { color: C.muted, fontSize: 13, fontStyle: 'italic', marginBottom: 12 },

  infoRow:        { marginBottom: 8 },
  infoBox:        { backgroundColor: C.surface, borderRadius: 8, padding: 12, borderLeftWidth: 3 },
  infoLabel:      { color: C.muted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  infoValue:      { color: C.text, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  infoSub:        { color: C.muted, fontSize: 12 },

  tabs:           { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 14 },
  tab:            { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center' },
  tabActive:      { backgroundColor: C.yellow, borderColor: C.yellow },
  tabText:        { color: C.muted, fontSize: 13, fontWeight: '600' },
  tabTextActive:  { color: '#000' },

  // Sector objectives
  sectorCard:     { marginBottom: 10 },
  sectorHeaderRow:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 4 },
  sectorHeader:   { fontSize: 18, fontWeight: '700', color: C.text },
  toggleHint:     { fontSize: 12, color: C.muted, fontStyle: 'italic' },
  table:          { backgroundColor: C.surface, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#1C2128', padding: 8 },
  tableHeader:    { color: C.muted, fontWeight: '700', fontSize: 11 },
  tableRow:       { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: C.border },
  tableCell:      { color: C.text, fontSize: 12, paddingRight: 4, lineHeight: 16 },

  // Boss cards
  bossCard:       { backgroundColor: C.surface, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  bossHeader:     { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  bossThumbnail:  { width: 56, height: 56, borderRadius: 6 },
  bossHeaderText: { flex: 1 },
  bossName:       { color: C.text, fontWeight: '700', fontSize: 16 },
  bossSector:     { color: C.muted, fontSize: 12, marginTop: 2 },
  bossTarget:     { color: C.green, fontSize: 12, fontWeight: '600', marginTop: 2 },
  bossBody:       { backgroundColor: '#0A0F16', padding: 14, gap: 12 },
  bossImage:      { width: '100%', height: 180, borderRadius: 8, marginBottom: 4 },
  bossSection:    { gap: 4 },
  bossSectionTitle: { color: C.blue, fontWeight: '700', fontSize: 14, marginBottom: 2 },
  bullet:         { color: C.text, fontSize: 13, lineHeight: 20 },

  // Gallimaufry tables
  galliTitle:     { fontSize: 16, fontWeight: '700', color: '#C084FC', marginTop: 20, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#3D2A5A', paddingBottom: 4 },
  galliTable:     { backgroundColor: C.surface, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#3D2A5A', marginBottom: 16 },
  galliHeaderRow: { flexDirection: 'row', backgroundColor: '#2D1B4E', padding: 10 },
  galliHeader:    { color: '#E9D5FF', fontWeight: '700', fontSize: 12 },
  galliRow:       { flexDirection: 'row', padding: 10 },
  galliRowAlt:    { backgroundColor: '#1A1030' },
  galliCell:      { color: C.text, fontSize: 13 },
});
