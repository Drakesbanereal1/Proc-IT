import { useState } from "react";
import { ScrollView, Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { PROC_COLORS } from "../../constants/procs";

// --- IMAGE MAPPING ---
const elementIcons = {
  Dark: require("../../assets/icons/Dark-Icon.gif"),
  Earth: require("../../assets/icons/Earth-Icon.gif"),
  Fire: require("../../assets/icons/Fire-Icon.gif"),
  Ice: require("../../assets/icons/Ice-Icon.gif"),
  Light: require("../../assets/icons/Light-Icon.gif"),
  Thunder: require("../../assets/icons/Thunder-Icon.gif"),
  Water: require("../../assets/icons/Water-Icon.gif"),
  Wind: require("../../assets/icons/Wind-Icon.gif"),
};

// --- DATA STRUCTURES --- 
interface WeaponSkill {
  name: string;
  level?: number;
  element?: string;
  quest?: string;
}

interface WeaponGroup {
  weapon: string;
  skills: WeaponSkill[];
}

interface TimedWeaponGroup {
  time: string;
  damageType: string;
  groups: WeaponGroup[];
}

interface SpellGroup {
  day: string;
  spells: string[];
}

// --- PROC DATA ---
const redProcs: WeaponGroup[] = [
  { weapon: "Dagger", skills: [{ name: "Cyclone", level: 125, element: "Wind" }, { name: "Energy Drain", level: 175, element: "Dark" }] },
  { weapon: "Sword", skills: [{ name: "Red Lotus Blade", level: 50, element: "Fire" }, { name: "Seraph Blade", level: 125, element: "Light" }] },
  { weapon: "Great Sword", skills: [{ name: "Freezebite", level: 100, element: "Ice" }] },
  { weapon: "Scythe", skills: [{ name: "Shadow of Death", level: 70, element: "Dark" }] },
  { weapon: "Polearm", skills: [{ name: "Raiden Thrust", level: 70, element: "Thunder" }] },
  { weapon: "Katana", skills: [{ name: "Blade: Ei", level: 175, element: "Dark" }] },
  { weapon: "Great Katana", skills: [{ name: "Tachi: Jinpu", level: 150, element: "Wind" }, { name: "Tachi: Koki", level: 175, element: "Light" }] },
  { weapon: "Club", skills: [{ name: "Seraph Strike", level: 40, element: "Light" }] },
  { weapon: "Staff", skills: [{ name: "Earth Crusher", level: 70, element: "Earth" }, { name: "Sunburst", level: 150, element: "Light" }] },
];

const blueProcs: TimedWeaponGroup[] = [
  {
    time: "6:00 - 14:00",
    damageType: "Piercing",
    groups: [
      { weapon: "Dagger", skills: [{ name: "Shadowstitch", level: 70 }, { name: "Dancing Edge", level: 200 }, { name: "Shark Bite", level: 225 }, { name: "Evisceration", level: 230 }] },
      { weapon: "Polearm", skills: [{ name: "Skewer", level: 200 }, { name: "Wheeling Thrust", level: 225 }, { name: "Impulse Drive", level: 240 }] },
      { weapon: "Archery", skills: [{ name: "Sidewinder", level: 175 }, { name: "Blast Arrow", level: 200 }, { name: "Arching Arrow", level: 225 }, { name: "Empyreal Arrow", level: 250 }] },
      { weapon: "Marksmanship", skills: [{ name: "Slug Shot", level: 175 }, { name: "Blast Shot", level: 200 }, { name: "Heavy Shot", level: 225 }, { name: "Detonator", level: 250 }] },
    ],
  },
  {
    time: "14:00 - 22:00",
    damageType: "Slashing",
    groups: [
      { weapon: "Sword", skills: [{ name: "Vorpal Blade", level: 200 }, { name: "Swift Blade", level: 225 }, { name: "Savage Blade", level: 240, quest: "Savage Blade" }] },
      { weapon: "Great Sword", skills: [{ name: "Spinning Slash", level: 225 }, { name: "Ground Strike", level: 250 }] },
      { weapon: "Axe", skills: [{ name: "Mistral Axe", level: 225 }, { name: "Decimation", level: 240 }] },
      { weapon: "Great Axe", skills: [{ name: "Full Break", level: 225 }, { name: "Steel Cyclone", level: 240 }] },
      { weapon: "Scythe", skills: [{ name: "Cross Reaper", level: 225 }, { name: "Spiral Hell", level: 240 }] },
      { weapon: "Katana", skills: [{ name: "Blade: Ten", level: 225 }, { name: "Blade: Ku", level: 250 }] },
      { weapon: "Great Katana", skills: [{ name: "Tachi: Gekko", level: 225 }, { name: "Tachi: Kasha", level: 250 }] },
    ],
  },
  {
    time: "22:00 - 6:00",
    damageType: "Blunt",
    groups: [
        { weapon: "Hand-to-Hand", skills: [{ name: "Raging Fists", level: 125 }, { name: "Spinning Attack", level: 150 }, { name: "Howling Fist", level: 200 }, { name: "Dragon Kick", level: 225 }, { name: "Asuran Fists", level: 250 }] },
        { weapon: "Club", skills: [{ name: "Skullbreaker", level: 150 }, { name: "True Strike", level: 175 }, { name: "Judgment", level: 200 }, { name: "Hexa Strike", level: 220 }, { name: "Black Halo", level: 230 }] },
        { weapon: "Staff", skills: [{ name: "Heavy Swing", level: 5 }, { name: "Shell Crusher", level: 175 }, { name: "Full Swing", level: 200 }, { name: "Spirit Taker", level: 215 }, { name: "Retribution", level: 230 }] },
    ],
  },
];

const yellowProcs: SpellGroup[] = [
  { day: "Firesday", spells: ["Fire III", "Fire IV", "Firaga III", "Flare", "Katon: Ni"] },
  { day: "Earthsday", spells: ["Stone III", "Stone IV", "Stonega III", "Quake", "Doton: Ni"] },
  { day: "Watersday", spells: ["Water III", "Water IV", "Waterga III", "Flood", "Suiton: Ni"] },
  { day: "Windsday", spells: ["Aero III", "Aero IV", "Aeroga III", "Tornado", "Huton: Ni"] },
  { day: "Lightsday", spells: ["Banish II", "Banish III", "Banishga II", "Holy", "Flash"] },
  { day: "Darksday", spells: ["Drain", "Aspir", "Dispel", "Bio II", "Kurayami: Ni"] },
];

// --- HELPER COMPONENTS ---
const ProcHeader = ({ title, color, open, onToggle }: { title: string; color: string; open: boolean; onToggle: () => void }) => (
  <TouchableOpacity style={styles.procHeaderRow} onPress={onToggle} activeOpacity={0.7}>
    <Text style={[styles.procHeader, { color }]}>{title}</Text>
    <Text style={[styles.chevron, { color }]}>{open ? '▼' : '▶'}</Text>
  </TouchableOpacity>
);

const SectionDescription = ({ text }) => (
  <Text style={styles.description}>{text}</Text>
);

const SkillDisplay = ({ skill }) => (
  <View style={styles.skillRow}>
    <Text style={styles.text}>{skill.name} </Text>
    {skill.element && elementIcons[skill.element] && (
      <Image source={elementIcons[skill.element]} style={styles.icon} />
    )}
    {skill.level && !skill.quest && <Text style={styles.text}>({skill.level})</Text>}
    {skill.quest && <Text style={[styles.text, styles.questText]}> ({skill.quest})</Text>}
  </View>
);

// --- MAIN COMPONENT ---
export default function Abyssea() {
  const [redOpen,    setRedOpen]    = useState(false);
  const [blueOpen,   setBlueOpen]   = useState(false);
  const [yellowOpen, setYellowOpen] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Abyssea Procs</Text>

      {/* RED PROCS */}
      <View style={styles.section}>
        <ProcHeader title="Red !!" color={PROC_COLORS.red} open={redOpen} onToggle={() => setRedOpen(o => !o)} />
        {redOpen && (
          <>
            <SectionDescription text="A pair of red exclamation points means that an elemental weapon skill has staggered the monster. The elemental weapon skill that triggers the Red !! is random." />
            {redProcs.map((group, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.headerCell}>{group.weapon}</Text>
                <View style={styles.valueCell}>
                  {group.skills.map((skill, i) => (
                    <SkillDisplay key={i} skill={skill} />
                  ))}
                </View>
              </View>
            ))}
          </>
        )}
      </View>

      {/* BLUE PROCS */}
      <View style={styles.section}>
        <ProcHeader title="Blue !!" color={PROC_COLORS.blue} open={blueOpen} onToggle={() => setBlueOpen(o => !o)} />
        {blueOpen && (
          <>
            <SectionDescription text="A pair of blue exclamation points means that a physical weapon skill has staggered the monster. The time of day a monster was claimed will determine which type of weapon skill can stagger the monster." />
            {blueProcs.map((timedGroup, index) => (
              <View key={index} style={styles.subSection}>
                <Text style={styles.subHeader}>{timedGroup.damageType} ({timedGroup.time})</Text>
                {timedGroup.groups.map((group, i) => (
                  <View key={i} style={styles.row}>
                    <Text style={styles.headerCell}>{group.weapon}</Text>
                    <View style={styles.valueCell}>
                      {group.skills.map((skill, j) => (
                        <SkillDisplay key={j} skill={skill} />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}
      </View>

      {/* YELLOW PROCS */}
      <View style={styles.section}>
        <ProcHeader title="Yellow !!" color={PROC_COLORS.yellow} open={yellowOpen} onToggle={() => setYellowOpen(o => !o)} />
        {yellowOpen && (
          <>
            <SectionDescription text="A pair of yellow exclamation points means that a spell has staggered the monster. The element of the day determines which spell can cause this effect." />
            {yellowProcs.map((group, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.headerCell}>{group.day}</Text>
                <View style={styles.valueCell}>
                  <Text style={styles.text}>{group.spells.join(", ")}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1A202C",
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
  subSection: {
    marginTop: 15,
  },
  procHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 2,
  },
  procHeader: {
    fontSize: 24,
    fontWeight: "700",
  },
  chevron: {
    fontSize: 16,
    fontWeight: "700",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 10,
  },
  description: {
    color: "#D1D5DB",
    marginBottom: 15,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#2D3748",
    marginBottom: 2,
    paddingVertical: 12,
    paddingHorizontal: 5, // Adjusted horizontal padding
    borderRadius: 8,
    alignItems: 'center',
  },
  headerCell: {
    width: 120,
    fontWeight: "bold",
    color: "#E5E7EB",
    fontSize: 14,
    borderRightWidth: 1,
    borderRightColor: '#4A5568',
    paddingRight: 10,
    textAlign: 'left', // Ensure text is aligned left
  },
  valueCell: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  text: {
    color: "#D1D5DB",
    fontSize: 14,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  questText: {
    fontStyle: 'italic',
  },
  icon: {
    width: 16,
    height: 16,
    marginHorizontal: 5,
  },
});
