import { useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { PROC_COLORS } from "../../constants/procs";

// --- DATA STRUCTURES ---
interface TimeExtensionProc {
  count: string;
  type: string;
  color: string;
  probability: string;
  effect: string;
  currency: string;
}

interface JobProc {
  jobs: string;
  procClass: string;
  procRate: string;
  color: string;
}

interface JobDetail {
  job: string;
  weaknesses: string;
}

interface JobCategory {
  name: string;
  jobs: JobDetail[];
}

// --- PROC DATA ---
const timeExtensionProcs: TimeExtensionProc[] = [
  { count: "0-2", type: "None", color: "#D1D5DB", probability: "N/A", effect: "N/A", currency: "N/A" },
  { count: "3", type: "!!", color: PROC_COLORS.blue, probability: "Low", effect: "Very brief terror", currency: "Adds a single drop slot" },
  { count: "4", type: "!!", color: PROC_COLORS.yellow, probability: "Medium", effect: "Terror/Stops 2-Hour", currency: "Adds another single drop slot" },
  { count: "5", type: "!!", color: PROC_COLORS.red, probability: "High", effect: "Terror/Stops 2-Hour", currency: "Also adds a 100% single drop slot" },
  { count: "3-5", type: "!!", color: "#FFFFFF", probability: "~1%*", effect: "Terror", currency: "Adds a 100% hundred-piece drop slot" },
];

const jobProcs: JobProc[] = [
  { jobs: "RNG, NIN, BST, MNK, THF", procClass: "Job Abilities and Ready commands", procRate: "~20%", color: PROC_COLORS.yellow },
  { jobs: "BLM, WHM, RDM, SMN, BRD", procClass: "Spells and Blood Pacts",           procRate: "~8%",  color: PROC_COLORS.blue },
  { jobs: "PLD, DRK, SAM, WAR, DRG", procClass: "Weapon Skills and Automaton Attachments", procRate: "~25%", color: PROC_COLORS.red },
];

const jobDetails: JobCategory[] = [
  {
    name: "Melee & Ranged Jobs",
    jobs: [
      { job: "THF", weaknesses: "Steal, Mug, Flee, Hide, Ambush, Accomplice" },
      { job: "MNK", weaknesses: "Boost, Dodge, Focus, Chakra, Counterstance" },
      { job: "BST", weaknesses: "Familiar, Tame, Sic, Heal, Reward" },
      { job: "NIN", weaknesses: "Utsusemi, Mijin Gakure. Elemental Ninjutsu matching day's weakness." },
      { job: "RNG", weaknesses: "Barrage, Scavenge, Sharpshot, Camouflage" },
    ]
  },
  {
    name: "Mage Jobs",
    jobs: [
      { job: "WHM", weaknesses: "Benediction, Divine Seal, Cure spells, Protect spells, Shell spells, Bar-element spells, Status-curing spells" },
      { job: "BLM", weaknesses: "Manafont. All elemental magic matching the day's weakness." },
      { job: "RDM", weaknesses: "Convert, Chainspell. Elemental magic matching the day's weakness, plus Cure, Dia, Dispel, Phalanx." },
      { job: "SMN", weaknesses: "Astral Flow. All avatars." },
      { job: "BRD", weaknesses: "Soul Voice. All songs." },
    ]
  },
  {
    name: "Tank & Heavy Melee Jobs",
    jobs: [
      { job: "WAR", weaknesses: "Mighty Strikes, Berserk, Provoke, Defender. Weapon skills matching day's weakness." },
      { job: "PLD", weaknesses: "Invincible, Shield Bash, Rampart, Sentinel. Weapon skills matching day's weakness." },
      { job: "DRK", weaknesses: "Blood Weapon, Soul Eater, Last Resort. Weapon skills matching day's weakness." },
      { job: "SAM", weaknesses: "Meikyo Shisui, Meditate, Hasso, Seigan. Weapon skills matching day's weakness." },
      { job: "DRG", weaknesses: "Spirit Surge, Call Wyvern, Ancient Circle. Weapon skills matching day's weakness." },
    ]
  }
];

// --- COLLAPSIBLE SECTION ---
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <Text style={styles.procHeader}>{title}</Text>
        <Text style={styles.toggleHint}>{open ? 'tap to close' : 'tap to open'}</Text>
      </TouchableOpacity>
      {open && children}
    </View>
  );
}

// --- MAIN COMPONENT ---
export default function Dynamis() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.mainTitle}>Dynamis Procs</Text>

      {/* Time Extension-Proc Relationship */}
      <Section title="Time Extension-Proc Relationship">
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeader, { flex: 1 }]}>#</Text>
            <Text style={[styles.tableHeader, { flex: 1 }]}>Type</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Probability</Text>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Effect on Monster</Text>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Currency Drop Rate</Text>
          </View>
          {timeExtensionProcs.map((proc, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{proc.count}</Text>
              <Text style={[styles.tableCell, { flex: 1, color: proc.color, fontWeight: 'bold' }]}>{proc.type}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{proc.probability}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{proc.effect}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{proc.currency}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footerNote}>*1% of your procs, not a 1% base rate.</Text>
      </Section>

      {/* Beastman Job-Proc Relationship */}
      <Section title="Beastman Job-Proc Relationship">
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Monster Job</Text>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Proc Class</Text>
            <Text style={[styles.tableHeader, { flex: 1, textAlign: 'right' }]}>Proc Rate</Text>
          </View>
          {jobProcs.map((proc, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{proc.jobs}</Text>
              <Text style={[styles.tableCell, { flex: 3, color: proc.color, fontWeight: 'bold' }]}>{proc.procClass}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{proc.procRate}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footerNote}>*Beastman Job-Proc Rates assumes 5 Time Extensions acquired</Text>
      </Section>

      {/* Individual Job Weaknesses */}
      <Section title="Individual Job Weaknesses">
        {jobDetails.map((category, index) => (
          <View key={index} style={{ marginBottom: 20 }}>
            <Text style={styles.subHeader}>{category.name}</Text>
            {category.jobs.map((detail, i) => (
              <View key={i} style={styles.detailRow}>
                <Text style={styles.detailJob}>{detail.job}</Text>
                <Text style={styles.detailWeakness}>{detail.weaknesses}</Text>
              </View>
            ))}
          </View>
        ))}
      </Section>

      {/* Dreamworld Dynamis */}
      <Section title="Dreamworld Dynamis">
        <Text style={styles.description}>
          In Dreamworld Dynamis areas (Dynamis-Beaucedine, Dynamis-Xarcabard, and Dynamis-Valkurm), procs are simplified. Any weapon skill of the correct damage type (Slashing, Piercing, Blunt) for the zone will trigger the weakness, regardless of the monster's job.
        </Text>
      </Section>

    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container:      { flex: 1, paddingHorizontal: 15, paddingTop: 15, backgroundColor: "#1A202C" },
  scrollContent:  { paddingBottom: 50 },
  mainTitle:      { fontSize: 28, fontWeight: "800", marginBottom: 20, color: "#FFFFFF" },
  section:        { marginBottom: 16 },
  sectionHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#4A5568', paddingBottom: 8, marginBottom: 10 },
  procHeader:     { fontSize: 22, fontWeight: "700", color: "#E5E7EB" },
  toggleHint:     { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  subHeader:      { fontSize: 18, fontWeight: "600", color: "#A0AEC0", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#4A5568", paddingBottom: 5 },
  table:          { backgroundColor: "#2D3748", borderRadius: 8, overflow: 'hidden' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#1A202C', padding: 10 },
  tableHeader:    { color: '#A0AEC0', fontWeight: 'bold', fontSize: 12 },
  tableRow:       { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#4A5568' },
  tableCell:      { color: '#D1D5DB', fontSize: 12 },
  detailRow:      { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2D3748' },
  detailJob:      { width: 50, color: '#E5E7EB', fontWeight: 'bold' },
  detailWeakness: { flex: 1, color: '#D1D5DB' },
  footerNote:     { fontStyle: 'italic', color: '#9CA3AF', fontSize: 12, marginTop: 10, textAlign: 'center' },
  description:    { fontSize: 14, color: "#D1D5DB", lineHeight: 20 },
});
