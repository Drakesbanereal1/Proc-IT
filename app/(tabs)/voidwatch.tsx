import { useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { PROC_COLORS } from "../../constants/procs";

// --- DATA STRUCTURES ---
interface TriggerDetail {
  name: string;
  triggers: string;
}

interface TriggerCategory {
  title: string;
  color: string;
  data: TriggerDetail[];
}

// --- PROC DATA ---
const voidwatchWeaknesses: TriggerCategory[] = [
  {
    title: "Job Ability",
    color: PROC_COLORS.yellow,
    data: [
      { name: "BLM", triggers: "Enmity Douse" },
      { name: "COR", triggers: "Fire Shot, Ice Shot, Wind Shot, Earth Shot, Thunder Shot, Water Shot" },
      { name: "DNC", triggers: "Quickstep, Stutter Step, Box Step, Feather Step, Violent Flourish, Animated Flourish" },
      { name: "DRK", triggers: "Weapon Bash" },
      { name: "DRG", triggers: "Jump, High Jump, Spirit Jump, Soul Jump" },
      { name: "MNK", triggers: "Chi Blast" },
      { name: "PLD", triggers: "Shield Bash" },
      { name: "RNG", triggers: "Shadowbind" },
      { name: "SCH", triggers: "Libra" },
      { name: "THF", triggers: "Bully" },
      { name: "WAR", triggers: "Provoke" },
    ],
  },
  {
    title: "Weapon Skills",
    color: PROC_COLORS.yellow,
    data: [
        { name: "Archery", triggers: "Flaming Arrow, Piercing Arrow, Dulling Arrow, Sidewinder, Blast Arrow, Arching Arrow, Empyreal Arrow, Refulgent Arrow" },
        { name: "Axe", triggers: "Raging Axe, Smash Axe, Gale Axe, Avalanche Axe, Spinning Axe, Rampage, Calamity, Mistral Axe, Decimation, Bora Axe" },
        { name: "Club", triggers: "Shining Strike, Seraph Strike, Brainshaker, Skullbreaker, True Strike, Judgment, Hexa Strike, Black Halo, Flash Nova" },
        { name: "Dagger", triggers: "Wasp Sting, Gust Slash, Shadowstitch, Viper Bite, Cyclone, Energy Steal, Energy Drain, Dancing Edge, Shark Bite, Evisceration, Aeolian Edge" },
        { name: "Great Axe", triggers: "Shield Break, Iron Tempest, Sturmwind, Armor Break, Keen Edge, Weapon Break, Raging Rush, Full Break, Steel Cyclone, Fell Cleave" },
        { name: "Great Katana", triggers: "Tachi: Enpi, Tachi: Hobaku, Tachi: Goten, Tachi: Kagero, Tachi: Jinpu, Tachi: Koki, Tachi: Yukikaze, Tachi: Gekko, Tachi: Kasha, Tachi: Ageha" },
        { name: "Great Sword", triggers: "Hard Slash, Power Slash, Frostbite, Freezebite, Shockwave, Crescent Moon, Sickle Moon, Spinning Slash, Ground Strike, Herculean Slash" },
        { name: "Hand-to-Hand", triggers: "Combo, Shoulder Tackle, One Inch Punch, Backhand Blow, Raging Fists, Spinning Attack, Howling Fist, Dragon Kick, Asuran Fists, Tornado Kick" },
        { name: "Katana", triggers: "Blade: Rin, Blade: Retsu, Blade: Teki, Blade: To, Blade: Chi, Blade: Ei, Blade: Jin, Blade: Ten, Blade: Ku, Blade: Yu" },
        { name: "Marksmanship", triggers: "Hot Shot, Split Shot, Sniper Shot, Slug Shot, Blast Shot, Heavy Shot, Detonator, Numbing Shot" },
        { name: "Polearm", triggers: "Double Thrust, Thunder Thrust, Raiden Thrust, Leg Sweep, Penta Thrust, Vorpal Thrust, Skewer, Wheeling Thrust, Impulse Drive, Sonic Thrust" },
        { name: "Scythe", triggers: "Slice, Dark Harvest, Shadow of Death, Nightmare Scythe, Spinning Scythe, Vorpal Scythe, Guillotine, Cross Reaper, Spiral Hell, Infernal Scythe" },
        { name: "Staff", triggers: "Heavy Swing, Rock Crusher, Earth Crusher, Starburst, Sunburst, Shell Crusher, Full Swing, Spirit Taker, Retribution, Cataclysm" },
        { name: "Sword", triggers: "Fast Blade, Burning Blade, Red Lotus Blade, Flat Blade, Shining Blade, Seraph Blade, Circle Blade, Spirits Within, Vorpal Blade, Swift Blade, Savage Blade, Sanguine Blade" },
    ]
  },
  {
    title: "Pet Abilities",
    color: PROC_COLORS.yellow,
    data: [
        { name: "Beastmaster", triggers: "Offensive abilities from jug pets." },
        { name: "Puppetmaster", triggers: "All Automaton offensive abilities and weapon skills." },
        { name: "Summoner", triggers: "Holy Mist (Carbuncle), Night Terror (Diabolos), Lunar Bay (Fenrir), and elemental Blood Pacts (e.g., Fire IV, Blizzard IV)." },
    ]
  },
  {
    title: "Black & White Magic",
    color: PROC_COLORS.blue,
    data: [
        { name: "Fire", triggers: "Pyrohelix, Fire II, Fire III, Fire IV, Firaga, Firaga II, Firaga III, Firaja, Flare, Burn, Poison, Poison II, Poisonga, Dia II, Addle" },
        { name: "Earth", triggers: "Geohelix, Stone II, Stone III, Stone IV, Stonega, Stonega II, Stonega III, Stoneja, Quake, Rasp, Slow" },
        { name: "Water", triggers: "Hydrohelix, Water II, Water III, Water IV, Waterga, Waterga II, Waterga III, Waterja, Flood, Drown, Paralyze" },
        { name: "Wind", triggers: "Anemohelix, Aero II, Aero III, Aero IV, Aeroga, Aeroga II, Aeroga III, Aeroja, Tornado, Choke" },
        { name: "Ice", triggers: "Cryohelix, Blizzard II, Blizzard III, Blizzard IV, Blizzaga, Blizzaga II, Blizzaga III, Blizzaja, Freeze, Frost" },
        { name: "Lightning", triggers: "Ionohelix, Thunder II, Thunder III, Thunder IV, Thundaga, Thundaga II, Thundaja, Burst, Shock" },
        { name: "Light", triggers: "Luminohelix, Banish II, Banish III, Banishga, Banishga II, Holy, Flash, Diaga" },
        { name: "Dark", triggers: "Noctohelix, Drain, Aspir, Absorb-TP, Absorb-ACC, Absorb-STR, Absorb-DEX, Absorb-AGI, Absorb-VIT, Absorb-INT, Absorb-MND, Absorb-CHR, Bio II, Dispel, Blind" }
    ]
  },
  {
      title: "Ninjutsu",
      color: PROC_COLORS.blue,
      data: [
          { name: "Fire", triggers: "Katon: Ichi, Katon: Ni" },
          { name: "Earth", triggers: "Doton: Ichi, Doton: Ni, Dokumori: Ichi, Aisha: Ichi" },
          { name: "Water", triggers: "Suiton: Ichi, Suiton: Ni" },
          { name: "Wind", triggers: "Huton: Ichi, Huton: Ni, Jubaku: Ichi" },
          { name: "Ice", triggers: "Hyoton: Ichi, Hyoton: Ni, Hojo: Ichi, Hojo: Ni" },
          { name: "Lightning", triggers: "Raiton: Ichi, Raiton: Ni" },
          { name: "Dark", triggers: "Kurayami: Ichi, Kurayami: Ni, Yurin: Ichi" },
      ]
  },
  {
      title: "Bard Songs",
      color: PROC_COLORS.blue,
      data: [
          { name: "Elemental", triggers: "Ice Threnody, Lightning Threnody, Fire Threnody, Earth Threnody, Wind Threnody, Water Threnody" },
          { name: "Other", triggers: "Battlefield Elegy, Carnage Elegy, Magic Finale, Light Threnody, Dark Threnody" },
      ]
  },
  {
      title: "Blue Magic",
      color: PROC_COLORS.blue,
      data: [
          { name: "Fire", triggers: "Firespit, Heat Breath, Thermal Pulse, Blastbomb" },
          { name: "Earth", triggers: "Sandspin, Magnetite Cloud, Cim. Discharge, Bad Breath" },
          { name: "Water", triggers: "Acrid Stream, Maelstrom, Corrosive Ooze, Cursed Sphere" },
          { name: "Wind", triggers: "Hecatomb Wave, Myster. Light, Leafstorm, Reaving Wind" },
          { name: "Ice", triggers: "Infrasonics, Ice Break, Cold Wave, Frost Breath" },
          { name: "Lightning", triggers: "Temporal Shift, Mind Blast, Chrgd. Whisker, Blitzstrahl" },
          { name: "Light", triggers: "Actinic Burst, Radiant Breath, Blank Gaze, Lgt. of Penance" },
          { name: "Dark", triggers: "Death Ray, Eyes on Me, Sandspray" },
      ]
  }
];

// --- MAIN COMPONENT ---
export default function Voidwatch() {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.mainTitle}>Voidwatch Weaknesses</Text>
      <Text style={styles.description}>
        Voidwatch Notorious Monsters have their weaknesses revealed in a specific order, starting with Yellow, then Blue, then Red. Use the triggers below to proc the appropriate weakness.
      </Text>

      {voidwatchWeaknesses.map((category, index) => {
        const isOpen = openSections.has(index);
        return (
          <View key={index} style={styles.section}>
            <TouchableOpacity style={styles.headerRow} onPress={() => toggle(index)} activeOpacity={0.7}>
              <Text style={[styles.procHeader, { color: category.color }]}>{category.title}</Text>
              <Text style={styles.toggleHint}>{isOpen ? 'tap to close' : 'tap to open'}</Text>
            </TouchableOpacity>
            {isOpen && (
              <View style={styles.table}>
                {category.data.map((item, i) => (
                  <View key={i} style={styles.tableRow}>
                    <Text style={styles.headerCell}>{item.name}</Text>
                    <Text style={styles.tableCell}>{item.triggers}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
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
  },
  description: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 25,
    fontStyle: "italic",
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 2,
  },
  procHeader: {
    fontSize: 22,
    fontWeight: "bold",
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
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#4A5568',
  },
  headerCell: {
    width: 120,
    fontWeight: "bold",
    color: "#E5E7EB",
    fontSize: 14,
    paddingRight: 10,
  },
  tableCell: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
});
