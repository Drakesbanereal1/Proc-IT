import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- HELPER COMPONENTS ---
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoCard = ({ icon, text }) => (
  <View style={styles.card}>
    <Ionicons name={icon} size={24} color="#A0AEC0" style={styles.cardIcon} />
    <Text style={styles.cardText}>{text}</Text>
  </View>
);

// --- MAIN COMPONENT ---
export default function Ambuscade() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.mainTitle}>Ambuscade Mechanics</Text>

      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>
          Ambuscade mechanics change every month. This page provides general guidance. Always check BG-Wiki for the most current information.
        </Text>
      </View>

      <Section title="Core Concepts">
        <InfoCard
          icon="repeat-outline"
          text="Every month, the enemy family, specific gimmicks, and optimal strategies change."
        />
        <InfoCard
          icon="shield-checkmark-outline"
          text="Ambuscade does not use the classic Red/Blue/Yellow proc system. Instead, it relies on conditional triggers and fight-specific mechanics."
        />
      </Section>

      <Section title="Common Gimmicks & Conditions">
        <InfoCard
          icon="swap-horizontal-outline"
          text="Damage-type conditions are frequent. One month might favor Slashing, while the next punishes it and favors Magic."
        />
        <InfoCard
          icon="people-outline"
          text="Certain jobs may be favored, or specific job abilities may be required to trigger a mechanic or avoid a penalty."
        />
        <InfoCard
          icon="move-outline"
          text="Positional mechanics are common. You may need to stand in specific zones, face a certain direction, or avoid AoEs."
        />
         <InfoCard
          icon="list-outline"
          text="Kill order often matters. You may need to defeat adds before the main boss or in a specific sequence."
        />
      </Section>
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#E5E7EB",
  },
  disclaimerBox: {
    backgroundColor: "#2D3748",
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
  },
  disclaimerText: {
    color: "#F0AD4E", // Yellow for attention
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#2D3748",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardText: {
    flex: 1,
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 20,
  },
});
