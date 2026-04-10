import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- DATA STRUCTURES ---
interface BossStrategy {
  id: string; // The Sortie Sector letter
  name: string; // The proper name of the NM
  title: string; // The in-game title for the NM
  notes: string[];
}

// --- BOSS DATA ---
const sortieBosses: BossStrategy[] = [
  {
    id: "A",
    name: "Dhartok",
    title: "Abject Obdella",
    notes: [
      "Positioning is key to manage its gaze and cone attacks.",
      "Prioritize defeating adds to prevent them from empowering the boss.",
      "Be prepared for its powerful frontal cleave, 'Mortal Revolution'."
    ],
  },
  {
    id: "B",
    name: "Gartell",
    title: "Biune Porxie",
    notes: [
      "Manages a 'reinforcements' mechanic; control adds strictly.",
      "Watch for 'Muculent Absorption' which buffs the boss if adds are near.",
      "Its primary damage type is piercing; consider appropriate buffs."
    ],
  },
  {
    id: "C",
    name: "Triboulex",
    title: "Cachaemic Bhoot",
    notes: [
      "Inflicts a unique 'glowing' debuff that needs to be managed.",
      "Gains buffs over time; a faster fight is a safer fight.",
      "Has a powerful AoE that can be dangerous if not mitigated.",
    ],
  },
  {
    id: "D",
    name: "Aita",
    title: "Demisang Deleterious",
    notes: [
      "Rotates through different job abilities (e.g., WAR, MNK). Adapt your strategy accordingly.",
      "Each job form has unique strengths and weaknesses.",
      "Be prepared for its 2-hour ability, which changes based on its current job.",
    ],
  },
  {
    id: "E",
    name: "Ghatjot",
    title: "Esurient Botulus",
    notes: [
      "Primary damage is Water-based. Use Barwatera and appropriate gear.",
      "Applies Taint and Poison. Prioritize cleansing these debuffs.",
      "The fight becomes more dangerous as its HP gets lower.",
    ],
  },
  {
    id: "F",
    name: "Leshonn",
    title: "Fetid Ixion",
    notes: [
      "CRITICAL: Control Black Pudding adds to prevent Citadel Buster.",
      "Alternates between a stationary and a mobile stance. Debuff windows may open in one stance.",
      "Bring anti-stun for Citadel Buster; do not rely on repeated stuns.",
    ],
  },
  {
    id: "G",
    name: "Skomora",
    title: "Gyvewrapped Naraka",
    notes: [
      "Follow mechanics to manage its 'soul' adds.",
      "The boss's behavior changes based on how many souls are active.",
      "A high-damage strategy is often recommended to bypass complex phases.",
    ],
  },
  {
    id: "H",
    name: "Degei",
    title: "Haughty Tulittia",
    notes: [
      "A DPS race. The longer the fight goes on, the more dangerous it becomes.",
      "Manages a powerful Doom mechanic that must be cleansed.",
      "Watch out for its charm-like ability, 'Dominion'.",
    ],
  },
  {
    id: "Final",
    name: "Aminon",
    title: "The Final Boss",
    notes: [
      "Similar to Ghatjot, deals Water damage and applies Taint.",
      "Have a clear plan for cleansing Poison and Taint debuffs.",
      "This fight is a culmination of mechanics from other bosses. Be prepared for anything.",
    ],
  },
];

// --- MAIN COMPONENT ---
export default function SortieBoss() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.mainTitle}>Sortie Boss Strategies</Text>

      {sortieBosses.map((boss) => (
        <View key={boss.id} style={styles.bossCard}>
          <View style={styles.bossHeader}>
            <Text style={styles.bossId}>{boss.id}</Text>
            <View>
              <Text style={styles.bossName}>{boss.name}</Text>
              <Text style={styles.bossTitle}>{boss.title}</Text>
            </View>
          </View>

          <View style={styles.notesSection}>
            {boss.notes.map((note, i) => (
              <View key={i} style={styles.noteRow}>
                <Ionicons name="caret-forward-outline" size={16} color="#f0ad4e" style={styles.noteIcon} />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>
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
    marginBottom: 20,
    color: "#FFFFFF",
    paddingHorizontal: 5,
  },
  bossCard: {
    backgroundColor: "#2D3748",
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  bossHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bossId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  bossName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E5E7EB',
  },
  bossTitle: {
    fontSize: 14,
    color: '#A0AEC0',
    fontStyle: 'italic',
  },
  notesSection: {
    padding: 15,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
});
