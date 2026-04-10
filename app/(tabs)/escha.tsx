import { ScrollView, Text, View, StyleSheet } from "react-native";

// --- DATA ---

interface NM {
  name: string;
  type: string;
  popItem: string;
}

interface Tier {
  label: string;
  nms: NM[];
}

interface Zone {
  zone: string;
  tiers: Tier[];
}

const eschaData: Zone[] = [
  {
    zone: "Escha - Zi'Tah",
    tiers: [
      {
        label: "Tier 1",
        nms: [
          { name: "Aglaophotis",   type: "Rafflesia", popItem: "Aglaophotis bud" },
          { name: "Angrboda",      type: "Golem",     popItem: "Angrboda's necklace" },
          { name: "Cunnast",       type: "Wyvern",    popItem: "Cunnast's talon" },
          { name: "Ferrodon",      type: "Wivre",     popItem: "Ferrodon's scale" },
          { name: "Gestalt",       type: "Hecteyes",  popItem: "Gestalt's retina" },
          { name: "Gulltop",       type: "Beetle",    popItem: "Gulltop's shell" },
          { name: "Lustful Lydia", type: "Morbol",    popItem: "Lydia's vine" },
          { name: "Revetaur",      type: "Taurus",    popItem: "Revetaur's horn" },
          { name: "Tangata Manu",  type: "Harpeia",   popItem: "Tangata's wing" },
          { name: "Vidala",        type: "Tiger",     popItem: "Vidala's claw" },
          { name: "Vyala",         type: "Coeurl",    popItem: "Vyala's prey" },
          { name: "Wepwawet",      type: "Cerberus",  popItem: "Wepwawet's tooth" },
        ],
      },
      {
        label: "Tier 2",
        nms: [
          { name: "Brittlis",      type: "Gnat",      popItem: "Brittilis's ring" },
          { name: "Ionos",         type: "Diremite",  popItem: "Ionos's webbing" },
          { name: "Kamohoalii",    type: "Orobon",    popItem: "Kamohoalii's fin" },
          { name: "Nosoi",         type: "Tulfaires", popItem: "Nosoi's feather" },
          { name: "Sensual Sandy", type: "Morbol",    popItem: "Sandy's lasher" },
          { name: "Umdhlebi",      type: "Belladonna",popItem: "Umdhlebi's flower" },
        ],
      },
      {
        label: "Tier 3",
        nms: [
          { name: "Fleetstalker",  type: "Yztarg",    popItem: "Fleetstalker's claw" },
          { name: "Shockmaw",      type: "Pteraketos", popItem: "Shockmaw's blubber" },
          { name: "Urmahlullu",    type: "Behemoth",  popItem: "Urmahlullu's armor" },
        ],
      },
      {
        label: "HELM",
        nms: [
          { name: "Alpluachra, Bucca & Puca", type: "Pixie",   popItem: "Coven's dust" },
          { name: "Blazewing",                type: "Mantid",  popItem: "Blazewing's pincer" },
          { name: "Pazuzu",                   type: "Gallu",   popItem: "Pazuzu's blade hilt" },
          { name: "Wrathare",                 type: "Rabbit",  popItem: "Wrathare's carrot" },
        ],
      },
    ],
  },
  {
    zone: "Escha - Ru'Aun",
    tiers: [
      {
        label: "Tier 1",
        nms: [
          { name: "Asida",           type: "Flan",      popItem: "Asida's gel" },
          { name: "Bia",             type: "Caturae",   popItem: "Bia's glove" },
          { name: "Emputa",          type: "Imp",       popItem: "Emputa's wing" },
          { name: "Khon",            type: "Caturae",   popItem: "Khon's scepter" },
          { name: "Khun",            type: "Caturae",   popItem: "Khun's crown" },
          { name: "Ma",              type: "Caturae",   popItem: "Ma's lance" },
          { name: "Met",             type: "Caturae",   popItem: "Met's ring" },
          { name: "Peirithoos",      type: "Monoceros", popItem: "Peirithoos's hoof" },
          { name: "Ruea",            type: "Caturae",   popItem: "Ruea's stone" },
          { name: "Sava Savanovic",  type: "Vampyr",    popItem: "Sava Savanovic's cape" },
          { name: "Tenodera",        type: "Mantid",    popItem: "Tenodera's scythe" },
          { name: "Wasserspeier",    type: "Gargouille",popItem: "Wasserspeier's horn" },
        ],
      },
      {
        label: "Tier 2",
        nms: [
          { name: "Amymone",    type: "Hydra",    popItem: "Amymone's tooth" },
          { name: "Hanbi",      type: "Gallu",    popItem: "Hanbi's nail" },
          { name: "Kammavaca",  type: "Grimoire", popItem: "Kammavaca's binding" },
          { name: "Naphula",    type: "Dvergr",   popItem: "Naphula's bracelet" },
          { name: "Palila",     type: "Waktza",   popItem: "Palila's talon" },
          { name: "Yilan",      type: "Zilant",   popItem: "Yilan's scale" },
        ],
      },
      {
        label: "Tier 3",
        nms: [
          { name: "Duke Vepar", type: "Giant Gnat", popItem: "Duke Vepar's signet" },
          { name: "Pakecet",    type: "Pteraketos", popItem: "Pakecet's blubber" },
          { name: "Vir'ava",    type: "Belladonna", popItem: "Vir'ava's stalk" },
        ],
      },
    ],
  },
  {
    zone: "Reisenjima",
    tiers: [
      {
        label: "Tier 1",
        nms: [
          { name: "Belphegor",              type: "Corse",       popItem: "Belphegor's crown" },
          { name: "Crom Dubh",              type: "Dullahan",    popItem: "Crom Dubh's helm" },
          { name: "Dazzling Dolores",       type: "Morbol",      popItem: "Dazzling Dolores's vine" },
          { name: "Golden Kist",            type: "Mimic",       popItem: "Golden Kist's key" },
          { name: "Kabandha",               type: "Ahriman",     popItem: "Kabandha's wing" },
          { name: "Mauve-wristed Gomberry", type: "Tonberry",    popItem: "Mauve-wristed Gomberry's knife" },
          { name: "Oryx",                   type: "Monoceros",   popItem: "Oryx's plumage" },
          { name: "Sabotender Royal",       type: "Sabotender",  popItem: "Sabotender Royal's needle" },
          { name: "Sang Buaya",             type: "Bugard",      popItem: "Sang Buaya's tusk" },
          { name: "Selkit",                 type: "Scorpion",    popItem: "Selkit's pincer" },
          { name: "Taelmoth the Diremaw",   type: "Soulflayer",  popItem: "Taelmoth's staff" },
          { name: "Zduhac",                 type: "Greater Bird",popItem: "Zduhac's talon" },
        ],
      },
      {
        label: "Tier 2",
        nms: [
          { name: "Bashmu",     type: "Hydra",      popItem: "Bashmu's trinket" },
          { name: "Gajasimha",  type: "Khimaira",   popItem: "Gajasimha's mane" },
          { name: "Ironside",   type: "Iron Giant",  popItem: "Ironside's maul" },
          { name: "Old Shuck",  type: "Cerberus",   popItem: "Old Shuck's tuft" },
          { name: "Sarsaok",    type: "Behemoth",   popItem: "Sarsaok's hoard" },
          { name: "Strophadia", type: "Harpeia",    popItem: "Strophadia's pearl" },
        ],
      },
      {
        label: "Tier 3",
        nms: [
          { name: "Maju",  type: "Peiste",    popItem: "Maju's claw" },
          { name: "Neak",  type: "Dragon",    popItem: "Neak's treasure" },
          { name: "Yakshi",type: "Yggdreant", popItem: "Yakshi's scroll" },
        ],
      },
      {
        label: "HELM",
        nms: [
          { name: "Albumen",      type: "Mandragora",  popItem: "Albumen's flower" },
          { name: "Erinys",       type: "Amphiptere",  popItem: "Erinys's beak" },
          { name: "Onychophora",  type: "Sandworm",    popItem: "Onychophora's soil" },
          { name: "Schah",        type: "Caturae",     popItem: "Schah's gambit" },
          { name: "Teles",        type: "Siren",       popItem: "Teles's hymn" },
          { name: "Vinipata",     type: "Naraka",      popItem: "Vinipata's blade" },
          { name: "Zerde",        type: "Botulus",     popItem: "Zerde's cup" },
        ],
      },
    ],
  },
];

// --- TIER LABEL COLORS ---
const tierColors: Record<string, string> = {
  "Tier 1": "#68D391", // green
  "Tier 2": "#F6E05E", // yellow
  "Tier 3": "#FC8181", // red
  "HELM":   "#76E4F7", // cyan
};

// --- COMPONENTS ---

const NMRow = ({ nm }: { nm: NM }) => (
  <View style={styles.row}>
    <View style={styles.nameCell}>
      <Text style={styles.nmName}>{nm.name}</Text>
      <Text style={styles.nmType}>{nm.type}</Text>
    </View>
    <Text style={styles.popItem}>{nm.popItem}</Text>
  </View>
);

const TierSection = ({ tier }: { tier: Tier }) => (
  <View style={styles.tierSection}>
    <Text style={[styles.tierLabel, { color: tierColors[tier.label] ?? "#E5E7EB" }]}>
      {tier.label}
    </Text>
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, styles.nameCell]}>NM (Type)</Text>
      <Text style={styles.headerCell}>Pop Item</Text>
    </View>
    {tier.nms.map((nm, i) => (
      <NMRow key={i} nm={nm} />
    ))}
  </View>
);

// --- MAIN COMPONENT ---
export default function Escha() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Escha / Reisenjima Pop Items</Text>
      <Text style={styles.subtitle}>
        Geas Fete NMs require a specific key item to pop. Items are obtained from regular mobs in each zone.
      </Text>

      {eschaData.map((zone, i) => (
        <View key={i} style={styles.zoneSection}>
          <Text style={styles.zoneTitle}>{zone.zone}</Text>
          {zone.tiers.map((tier, j) => (
            <TierSection key={j} tier={tier} />
          ))}
        </View>
      ))}
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
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginBottom: 24,
  },
  zoneSection: {
    marginBottom: 32,
  },
  zoneTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#BEE3F8",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#4A5568",
    paddingBottom: 6,
  },
  tierSection: {
    marginBottom: 16,
  },
  tierLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 2,
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#718096",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#2D3748",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 2,
    alignItems: "center",
  },
  nameCell: {
    flex: 1,
  },
  nmName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  nmType: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  popItem: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
    textAlign: "right",
  },
});
