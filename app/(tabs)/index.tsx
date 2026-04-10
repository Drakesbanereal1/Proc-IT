import { ScrollView, Text, View, StyleSheet } from "react-native";

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Trigger = ({ icon, color, text, subtext }) => (
  <View style={styles.triggerRow}>
    <Text style={[styles.triggerIcon, { color }]}>{icon}</Text>
    <View>
      <Text style={styles.triggerText}>{text}</Text>
      {subtext && <Text style={styles.triggerSubtext}>{subtext}</Text>}
    </View>
  </View>
);

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>FFXI Weakness Triggers (PROC)</Text>
      <Text style={styles.description}>
        Notorious Monsters in Abyssea and Voidwatch and all in Dynamis have
        vulnerabilites that are procedural random occurances, or "PROC's".
      </Text>

      <Section title="Abyssea Notorious Monsters">
        <Trigger
          icon="!!"
          color="#d9534f" // red
          text="Weapon Skills"
          subtext="Atmas and NM key items"
        />
        <Trigger
          icon="!!"
          color="#f0ad4e" // yellow
          text="Magic Spells"
          subtext="EX Empyrean armor upgrade items"
        />
        <Trigger
          icon="!!"
          color="#0275d8" // blue
          text="Weapon Skills"
          subtext="RA/EX weapons and armor"
        />
      </Section>

      <Section title="Dynamis (# of Time Extensions)">
        <Trigger icon="3×" color="#FFFFFF" text="TE" subtext="single currency drop slot" />
        <Trigger icon="4×" color="#FFFFFF" text="TE" subtext="additional currency drop slot" />
        <Trigger icon="5×" color="#f0ad4e" text="TE" subtext="additional 100% drop slot" />
        <Trigger
          icon="!!"
          color="#d9534f" // red
          text="No sub job (CoP areas)"
          subtext="100% hundred-piece drop slot"
        />
      </Section>

      <Text style={styles.footer}>Tap ☰ and select a category.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1A202C",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#D1D5DB",
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 15,
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  triggerIcon: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
    width: 30,
  },
  triggerText: {
    fontSize: 16,
    color: "#D1D5DB",
    fontWeight: "500",
  },
  triggerSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  footer: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
  },
});
