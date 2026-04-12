import { useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";

// --- DATA STRUCTURES ---
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

// --- SORTIE DATA ---
const sortieSectors: SortieSector[] = [
  {
    id: "A",
    title: "Sector A Objectives",
    objectives: [
      { chest: "Chest #A1", objective: "Open any unlocked Gate #A.", reward: "100 Gallimaufry, Ra'Kaznar Key A" },
      { chest: "Chest #A2", objective: "Cast magic next to Diaphanous Device #A.", reward: "100 Gallimaufry, Ra'Kaznar Plate A" },
      { chest: "Chest #A3", objective: "Vanquish 3 Abject foes using single-target magic for the killing blow.", reward: "100 Gallimaufry, Ra'Kaznar Shard A" },
      { chest: "Chest #A4", objective: "Vanquish 3 more Abject foes using single-target magic.", reward: "100 Gallimaufry, Ra'Kaznar Metal A" },
      { chest: "Chest #A5", objective: "Interact with Diaphanous Bitzer #A while naked.", reward: "100 Gallimaufry, Ra'Kaznar Sheet A" },
      { chest: "Casket #A1", objective: "Vanquish 5 Abject foes (excluding Abject Obdella).", reward: "Old Case / Sapphire" },
      { chest: "Casket #A2", objective: "/heal in the area between Gate #A1 and the Abject Leeches.", reward: "Old Case / Sapphire" },
      { chest: "Coffer #A", objective: "Vanquish Abject Obdella.", reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "B",
    title: "Sector B Objectives",
    objectives: [
        { chest: "Chest #B1", objective: "Open Gates #B1 through #B6 in order.", reward: "100 Gallimaufry, Ra'Kaznar Key B" },
        { chest: "Chest #B2", objective: "/hurray with Diaphanous Device #B.", reward: "100 Gallimaufry, Ra'Kaznar Plate B" },
        { chest: "Chest #B3", objective: "Perform a Weapon Skill on 5 Biune foes.", reward: "100 Gallimaufry, Ra'Kaznar Shard B" },
        { chest: "Chest #B4", objective: "Perform a Weapon Skill on 5 more Biune foes.", reward: "100 Gallimaufry, Ra'Kaznar Metal B" },
        { chest: "Chest #B5", objective: "Interact with Diaphanous Bitzer #B after traveling from the entrance on foot.", reward: "100 Gallimaufry, Ra'Kaznar Sheet B" },
        { chest: "Casket #B1", objective: "Vanquish 3 Biune foes within 30s of gaining enmity.", reward: "Old Case / Sapphire" },
        { chest: "Casket #B2", objective: "Open any Locked Gate #B.", reward: "Old Case / Sapphire" },
        { chest: "Coffer #B", objective: "Vanquish Biune Porxie after meeting the Casket #B1 objective.", reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "C",
    title: "Sector C Objectives",
    objectives: [
        { chest: "Chest #C1", objective: "Open Gate #C1 or #C2 before defeating any enemies.", reward: "100 Gallimaufry, Ra'Kaznar Key C" },
        { chest: "Chest #C2", objective: "Pull a Cachaemic foe to Device #C and defeat it there.", reward: "100 Gallimaufry, Ra'Kaznar Plate C" },
        { chest: "Chest #C3", objective: "Perform a Magic Burst on 3 Cachaemic foes.", reward: "100 Gallimaufry, Ra'Kaznar Shard C" },
        { chest: "Chest #C4", objective: "Perform a Magic Burst on 3 more Cachaemic foes.", reward: "100 Gallimaufry, Ra'Kaznar Metal C" },
        { chest: "Chest #C5", objective: "Vanquish one Cachaemic foe, Materialize foes at Device #C, then interact with Bitzer #C.", reward: "100 Gallimaufry, Ra'Kaznar Sheet C" },
        { chest: "Casket #C1", objective: "Vanquish 3 Cachaemic foes within 15s of gaining enmity.", reward: "Old Case / Sapphire" },
        { chest: "Casket #C2", objective: "Vanquish all Cachaemic foes.", reward: "Old Case / Sapphire" },
        { chest: "Coffer #C", objective: "Vanquish Cachaemic Bhoot within 5 minutes of its spawn.", reward: "Old Case / Sapphire" },
    ],
  },
  {
    id: "D",
    title: "Sector D Objectives",
    objectives: [
        { chest: "Chest #D1", objective: "Open Gates #D1 and #D2 within two minutes of each other.", reward: "100 Gallimaufry, Ra'Kaznar Key D" },
        { chest: "Chest #D2", objective: "Drop your Obsid. Wing at Diaphanous Device #D.", reward: "100 Gallimaufry, Ra'Kaznar Plate D" },
        { chest: "Chest #D3", objective: "Perform a 4-step Skillchain on 3 Demisang foes.", reward: "100 Gallimaufry, Ra'Kaznar Shard D" },
        { chest: "Chest #D4", objective: "Perform a 4-step Skillchain on 3 more Demisang foes.", reward: "100 Gallimaufry, Ra'Kaznar Metal D" },
        { chest: "Chest #D5", objective: "Vanquish all Demisang foes, then interact with Diaphanous Bitzer #D.", reward: "100 Gallimaufry, Ra'Kaznar Sheet D" },
        { chest: "Casket #D1", objective: "Vanquish 6 Demisang foes of different jobs.", reward: "Old Case / Sapphire" },
        { chest: "Casket #D2", objective: "Vanquish Demisang foes in standard job order: WAR, MNK, WHM, BLM, RDM, THF.", reward: "Old Case / Sapphire" },
        { chest: "Coffer #D", objective: "Vanquish Demisang Deleterious, then any 3 Demisang foes.", reward: "Old Case / Sapphire" },
    ],
  },
  {
      id: "E", title: "Sector E Objectives", objectives: [
          { chest: "Chest #E", objective: "Defeat Esurient Botulus with a majority of damage from behind.", reward: "100 Gallimaufry, Ra'Kaznar Metal E"},
          { chest: "Casket #E1", objective: "Vanquish 12 Esurient foes in the Bitzer room.", reward: "Old Case / Sapphire"},
          { chest: "Casket #E2", objective: "Vanquish 15 Esurient Flan.", reward: "Old Case / Sapphire"},
          { chest: "Coffer #E", objective: "Vanquish the 6 mini-Naakuals that appear after 5 minutes.", reward: "Old Case / Sapphire"},
      ]
  },
  {
      id: "F", title: "Sector F Objectives", objectives: [
          { chest: "Chest #F", objective: "Vanquish Fetid Ixion while the horn is broken.", reward: "100 Gallimaufry, Ra'Kaznar Metal F"},
          { chest: "Casket #F1", objective: "Interact with the Bitzer while wearing 5/5 Empyrean Armor.", reward: "Old Case / Sapphire"},
          { chest: "Casket #F2", objective: "Vanquish all Fetid Veela.", reward: "Old Case / Sapphire"},
          { chest: "Coffer #F", objective: "Vanquish the 6 mini-Naakuals that appear on re-entry.", reward: "Old Case / Sapphire"},
      ]
  },
  {
      id: "G", title: "Sector G Objectives", objectives: [
          { chest: "Chest #G", objective: "Vanquish Gyvewrapped Naraka.", reward: "100 Gallimaufry, Ra'Kaznar Metal G"},
          { chest: "Casket #G1", objective: "Target and stand near the Bitzer for 30 seconds.", reward: "Old Case / Sapphire"},
          { chest: "Casket #G2", objective: "Vanquish 19 Gyvewrapped Dullahan.", reward: "Old Case / Sapphire"},
          { chest: "Coffer #G", objective: "Vanquish the 6 mini-Naakuals in the correct order.", reward: "Old Case / Sapphire"},
      ]
  },
  {
      id: "H", title: "Sector H Objectives", objectives: [
          { chest: "Chest #H", objective: "Vanquish Haughty Tulittia after doing significant indirect damage.", reward: "100 Gallimaufry, Ra'Kaznar Metal H"},
          { chest: "Casket #H1", objective: "Leave and re-enter Sector H.", reward: "Old Case / Sapphire"},
          { chest: "Casket #H2", objective: "Killing all Haughty Paladin will spawn the chest.", reward: "Old Case / Sapphire"},
          { chest: "Coffer #H", objective: "Vanquish the 6 mini-Naakuals after defeating 8 different Haughty jobs.", reward: "Old Case / Sapphire"},
      ]
  }
];

// --- SECTOR CARD (collapsible) ---
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
            <Text style={[styles.tableHeader, {flex: 1.5}]}>Chest</Text>
            <Text style={[styles.tableHeader, {flex: 4}]}>Objective</Text>
            <Text style={[styles.tableHeader, {flex: 2.5}]}>Reward</Text>
          </View>
          {sector.objectives.map((obj, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, {flex: 1.5, color: '#f0ad4e'}]}>{obj.chest}</Text>
              <Text style={[styles.tableCell, {flex: 4}]}>{obj.objective}</Text>
              <Text style={[styles.tableCell, {flex: 2.5}]}>{obj.reward}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// --- MAIN COMPONENT ---
export default function Sortie() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.mainTitle}>Sortie Objectives</Text>
      <Text style={styles.description}>
        Sortie is a high-end battlefield where players complete objectives to earn rewards. This guide details the objectives for each sector.
      </Text>

      {sortieSectors.map((sector) => (
        <SectorCard key={sector.id} sector={sector} />
      ))}
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1A202C",
  },
  scrollContent: {
    paddingBottom: 50,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
    color: "#FFFFFF",
    paddingHorizontal: 5,
  },
  description: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 25,
    fontStyle: "italic",
    lineHeight: 20,
    paddingHorizontal: 5,
  },
  sectorCard: {
    marginBottom: 20,
  },
  sectorHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 6,
    marginBottom: 4,
  },
  sectorHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E5E7EB",
  },
  toggleHint: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  table: {
    backgroundColor: "#2D3748",
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
      flexDirection: 'row',
      backgroundColor: '#1A202C',
      padding: 10,
  },
  tableHeader: {
      color: '#A0AEC0',
      fontWeight: 'bold',
      fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#4A5568',
  },
  tableCell: {
    color: '#D1D5DB',
    fontSize: 12,
    paddingRight: 5,
  },
});
