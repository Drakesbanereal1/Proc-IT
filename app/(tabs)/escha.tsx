import { useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface NM {
  name: string;
  type: string;
  popItem: string;
  requiredItems?: string; // undefined = uses shared T1 pool for the zone
  vorseal: string;
}

interface Tier {
  label: string;
  level: string;
  sharedItems?: string; // T1 zones: everyone uses the same item pool
  note?: string;
  nms: NM[];
}

interface Zone {
  zone: string;
  tiers: Tier[];
}

// ─── VORSEAL COLORS ──────────────────────────────────────────────────────────

function vorsealColor(v: string): string {
  if (v.includes("Attack/Ranged")) return "#F97316";
  if (v.includes("Magic Attack"))  return "#FBBF24";
  if (v.includes("Magic Acc"))     return "#A78BFA";
  if (v.includes("Accuracy"))      return "#60A5FA";
  if (v.includes("Magic Defense")) return "#2DD4BF";
  if (v.includes("Defense"))       return "#4ADE80";
  if (v.includes("STR") || v.includes("VIT")) return "#FB923C";
  if (v.includes("DEX") || v.includes("AGI")) return "#38BDF8";
  if (v.includes("INT") || v.includes("MND") || v.includes("CHR")) return "#C084FC";
  if (v.includes("Damage Taken"))  return "#F87171";
  if (v.includes("Killer"))        return "#E879F9";
  if (v.includes("Occasionally"))  return "#FCD34D";
  if (v.includes("Luck"))          return "#FFD700";
  if (v.includes("Rare Enemy"))    return "#FF6B6B";
  return "#9CA3AF";
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const ZONES: Zone[] = [
  // ══════════════════════════════════════════════════════════════════
  {
    zone: "Escha - Zi'Tah",
    tiers: [
      {
        label: "Tier 1",
        level: "Level 119",
        sharedItems: "Darksteel Ingot x2  ·  Mahogany Lumber x3  ·  Silk Cloth x2  ·  Buffalo Leather x2  ·  Gold Ingot x2  ·  Carapace Gorget  ·  Flame Blade  ·  Holy Sword  ·  Fish Mithkabob x6",
        note: "Trade any ONE item above to Affi to receive the NM's Grisly Trinket.",
        nms: [
          { name: "Aglaophotis",   type: "Rafflesia", popItem: "Aglaophotis bud",    vorseal: "Attack/Ranged Attack" },
          { name: "Angrboda",      type: "Golem",     popItem: "Angrboda's necklace", vorseal: "Accuracy/Evasion" },
          { name: "Cunnast",       type: "Wyvern",    popItem: "Cunnast's talon",     vorseal: "Defense" },
          { name: "Ferrodon",      type: "Wivre",     popItem: "Ferrodon's scale",    vorseal: "Magic Accuracy/Magic Evasion" },
          { name: "Gestalt",       type: "Hecteyes",  popItem: "Gestalt's retina",    vorseal: "Magic Attack" },
          { name: "Gulltop",       type: "Beetle",    popItem: "Gulltop's shell",     vorseal: "Magic Defense" },
          { name: "Lustful Lydia", type: "Morbol",    popItem: "Lydia's vine",        vorseal: "Defense" },
          { name: "Revetaur",      type: "Taurus",    popItem: "Revetaur's horn",     vorseal: "Attack/Ranged Attack" },
          { name: "Tangata Manu",  type: "Harpeia",   popItem: "Tangata's wing",      vorseal: "Magic Accuracy/Magic Evasion" },
          { name: "Vidala",        type: "Tiger",     popItem: "Vidala's claw",       vorseal: "Magic Defense" },
          { name: "Vyala",         type: "Coeurl",    popItem: "Vyala's prey",        vorseal: "Magic Attack" },
          { name: "Wepwawet",      type: "Cerberus",  popItem: "Wepwawet's tooth",    vorseal: "Accuracy/Evasion" },
        ],
      },
      {
        label: "Tier 2",
        level: "Level 125",
        nms: [
          { name: "Brittlis",      type: "Giant Gnat",  popItem: "Brittilis's ring",    requiredItems: "Ethereal Incense x5",  vorseal: "DEX/AGI" },
          { name: "Ionos",         type: "Diremite",    popItem: "Ionos's webbing",     requiredItems: "Ayapec's Shell x5",    vorseal: "DEX/AGI" },
          { name: "Kamohoalii",    type: "Orobon",      popItem: "Kamohoalii's fin",    requiredItems: "Ayapec's Shell x5",    vorseal: "STR/VIT" },
          { name: "Nosoi",         type: "Tulfaires",   popItem: "Nosoi's feather",     requiredItems: "Ayapec's Shell x5",    vorseal: "INT/MND/CHR" },
          { name: "Sensual Sandy", type: "Morbol",      popItem: "Sandy's lasher",      requiredItems: "Ethereal Incense x5",  vorseal: "STR/VIT" },
          { name: "Umdhlebi",      type: "Belladonna",  popItem: "Umdhlebi's flower",   requiredItems: "Ethereal Incense x5",  vorseal: "INT/MND/CHR" },
        ],
      },
      {
        label: "Tier 3",
        level: "Level 135",
        nms: [
          { name: "Fleetstalker", type: "Yztarg",    popItem: "Fleetstalker's claw", requiredItems: "Riftborn Boulder x5", vorseal: "Occasionally Ignore Damage" },
          { name: "Shockmaw",     type: "Pteraketos", popItem: "Shockmaw's blubber", requiredItems: "Beitetsu x5",         vorseal: "Killer Effects" },
          { name: "Urmahlullu",   type: "Behemoth",  popItem: "Urmahlullu's armor",  requiredItems: "Pluton x5",           vorseal: "Damage Taken" },
        ],
      },
      {
        label: "HELM",
        level: "Level 135",
        note: "Requires Tribulens to participate. Spawns after defeating Geas Fete NM while holding rare enemy vorseal — use Mollifier to prevent.",
        nms: [
          { name: "Alpluachra, Bucca & Puca", type: "Pixies", popItem: "Coven's dust",        requiredItems: "Ashweed + Gravewood Log",                vorseal: "STR/VIT" },
          { name: "Blazewing",                type: "Mantid", popItem: "Blazewing's pincer",  requiredItems: "Duskcrawler + Gravewood Log",            vorseal: "DEX/AGI" },
          { name: "Pazuzu",                   type: "Gallu",  popItem: "Pazuzu's blade hilt", requiredItems: "Ashweed + Duskcrawler",                  vorseal: "INT/MND/CHR" },
          { name: "Wrathare",                 type: "Rabbit", popItem: "Wrathare's carrot",   requiredItems: "Ashweed + Duskcrawler + Gravewood Log",  vorseal: "Luck+" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  {
    zone: "Escha - Ru'Aun",
    tiers: [
      {
        label: "Tier 1",
        level: "Level 119",
        sharedItems: "Steel Ingot x2  ·  Ebony Lumber x2  ·  Karakul Cloth x2  ·  Catoblepas Leather x2  ·  Platinum Ingot x2  ·  Cermet Chunk x2  ·  Turtle Bangles  ·  Pamama Tart  ·  Bhefhel Marlin",
        note: "Trade any ONE item above to Dremi to receive the NM's Grisly Trinket.",
        nms: [
          { name: "Asida",          type: "Flan",       popItem: "Asida's gel",            vorseal: "Magic Accuracy/Magic Evasion" },
          { name: "Bia",            type: "Caturae",    popItem: "Bia's glove",            vorseal: "Accuracy/Evasion" },
          { name: "Emputa",         type: "Imp",        popItem: "Emputa's wing",          vorseal: "Defense" },
          { name: "Khon",           type: "Caturae",    popItem: "Khon's scepter",         vorseal: "Magic Accuracy/Magic Evasion" },
          { name: "Khun",           type: "Caturae",    popItem: "Khun's crown",           vorseal: "Magic Attack" },
          { name: "Ma",             type: "Caturae",    popItem: "Ma's lance",             vorseal: "Attack/Ranged Attack" },
          { name: "Met",            type: "Caturae",    popItem: "Met's ring",             vorseal: "Magic Defense" },
          { name: "Peirithoos",     type: "Monoceros",  popItem: "Peirithoos's hoof",      vorseal: "Attack/Ranged Attack" },
          { name: "Ruea",           type: "Caturae",    popItem: "Ruea's stone",           vorseal: "Defense" },
          { name: "Sava Savanovic", type: "Vampyr",     popItem: "Sava Savanovic's cape",  vorseal: "Magic Attack" },
          { name: "Tenodera",       type: "Mantid",     popItem: "Tenodera's scythe",      vorseal: "Magic Defense" },
          { name: "Wasserspeier",   type: "Gargouille", popItem: "Wasserspeier's horn",    vorseal: "Accuracy/Evasion" },
        ],
      },
      {
        label: "Tier 2",
        level: "Level 125",
        nms: [
          { name: "Amymone",   type: "Hydra",    popItem: "Amymone's tooth",     requiredItems: "Mhuufya's Beak x5",            vorseal: "DEX/AGI" },
          { name: "Hanbi",     type: "Gallu",    popItem: "Hanbi's nail",        requiredItems: "Azrael's Eye x5",              vorseal: "STR/VIT" },
          { name: "Kammavaca", type: "Grimoire", popItem: "Kammavaca's binding", requiredItems: "Vedrfolnir's Wing x5",          vorseal: "INT/MND/CHR" },
          { name: "Naphula",   type: "Dvergr",   popItem: "Naphula's bracelet",  requiredItems: "Tuft of Camahueto's Fur x5",   vorseal: "STR/VIT" },
          { name: "Palila",    type: "Waktza",   popItem: "Palila's talon",      requiredItems: "Vidmapire's Claw x5",           vorseal: "DEX/AGI" },
          { name: "Yilan",     type: "Zilant",   popItem: "Yilan's scale",       requiredItems: "Centurio's Armor x5",           vorseal: "INT/MND/CHR" },
        ],
      },
      {
        label: "Tier 3",
        level: "Level 135",
        nms: [
          { name: "Duke Vepar", type: "Giant Gnat", popItem: "Duke Vepar's signet", requiredItems: "Yggdreant Root",  vorseal: "Killer Effects" },
          { name: "Pakecet",    type: "Pteraketos", popItem: "Pakecet's blubber",   requiredItems: "Waktza Crest",    vorseal: "Occasionally Ignore Damage" },
          { name: "Vir'ava",    type: "Belladonna", popItem: "Vir'ava's stalk",     requiredItems: "Cehuetzi Pelt",   vorseal: "Damage Taken" },
        ],
      },
      {
        label: "Ark Angels",
        level: "Level 140",
        note: "All require: Parchment x5 · Illuminink x5 total across all 5.",
        nms: [
          { name: "Ark Angel EV", type: "Elvaan",  popItem: "Ark Angel EV's sash",    requiredItems: "Parchment + Illuminink + Ashen Crayfish + Ashweed",        vorseal: "Luck+" },
          { name: "Ark Angel GK", type: "Galka",   popItem: "Ark Angel GK's bangle",  requiredItems: "Parchment + Illuminink + Ashen Crayfish + Gravewood Log",   vorseal: "Luck+" },
          { name: "Ark Angel HM", type: "Hume",    popItem: "Ark Angel HM's coat",    requiredItems: "Parchment + Illuminink + Ashweed + Gravewood Log",          vorseal: "DEX/AGI" },
          { name: "Ark Angel MR", type: "Mithra",  popItem: "Ark Angel MR's buckle",  requiredItems: "Parchment + Illuminink + Ashen Crayfish + Duskcrawler",     vorseal: "INT/MND/CHR" },
          { name: "Ark Angel TT", type: "Tarutaru",popItem: "Ark Angel TT's necklace",requiredItems: "Parchment + Illuminink + Duskcrawler + Gravewood Log",      vorseal: "STR/VIT" },
        ],
      },
      {
        label: "Heavenly Beasts",
        level: "Level 140–150",
        note: "Requires title 'Kirin Captivator' to obtain Grisly Trinkets. Kirin is Level 150.",
        nms: [
          { name: "Byakko", type: "Tiger",         popItem: "Byakko's Pride",     requiredItems: "Byakko Scrap x3",                                  vorseal: "DEX/AGI" },
          { name: "Genbu",  type: "Adamantoise",   popItem: "Genbu's Honor",      requiredItems: "Genbu Scrap x3",                                   vorseal: "STR/VIT" },
          { name: "Seiryu", type: "Wyvern",        popItem: "Seiryu's Nobility",  requiredItems: "Seiryu Scrap x3",                                  vorseal: "INT/MND/CHR" },
          { name: "Suzaku", type: "Greater Bird",  popItem: "Suzaku's Benefaction",requiredItems: "Suzaku Scrap x3",                                 vorseal: "Luck+" },
          { name: "Kirin",  type: "Manticore",     popItem: "Kirin's Fervor",     requiredItems: "Byakko, Genbu, Seiryu & Suzaku Scraps x5 each",    vorseal: "Rare Enemy+" },
        ],
      },
      {
        label: "Nazar NM",
        level: "Level 150",
        nms: [
          { name: "Warder of Courage", type: "Aern", popItem: "Primal nazar", requiredItems: "Primary + Secondary + Tertiary + Quaternary + Quinary + Senary + Septenary + Octonary + Nonary + Denary nazar", vorseal: "Rare Enemy+" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  {
    zone: "Reisenjima",
    tiers: [
      {
        label: "Tier 1",
        level: "Level 129",
        sharedItems: "Darksteel Buckler  ·  Ancient Lumber x2  ·  Gold Obi  ·  Behemoth Leather  ·  Gold Bangles  ·  Demon's Knife  ·  Turtle Soup  ·  Bladefish",
        note: "Trade any ONE item above to obtain the NM's Grisly Trinket.",
        nms: [
          { name: "Belphegor",              type: "Corse",        popItem: "Belphegor's crown",             vorseal: "Magic Attack" },
          { name: "Crom Dubh",              type: "Dullahan",     popItem: "Crom Dubh's helm",              vorseal: "Accuracy/Evasion" },
          { name: "Dazzling Dolores",       type: "Morbol",       popItem: "Dazzling Dolores's vine",       vorseal: "Magic Accuracy/Magic Evasion" },
          { name: "Golden Kist",            type: "Mimic",        popItem: "Golden Kist's key",             vorseal: "Defense" },
          { name: "Kabandha",               type: "Ahriman",      popItem: "Kabandha's wing",               vorseal: "Accuracy/Evasion" },
          { name: "Mauve-wristed Gomberry", type: "Gomberry",     popItem: "Mauve-wristed Gomberry's knife",vorseal: "Attack/Ranged Attack" },
          { name: "Oryx",                   type: "Monoceros",    popItem: "Oryx's plumage",                vorseal: "Magic Attack" },
          { name: "Sabotender Royal",       type: "Sabotender",   popItem: "Sabotender Royal's needle",     vorseal: "Magic Accuracy/Magic Evasion" },
          { name: "Sang Buaya",             type: "Bugard",       popItem: "Sang Buaya's tusk",             vorseal: "Attack/Ranged Attack" },
          { name: "Selkit",                 type: "Scorpion",     popItem: "Selkit's pincer",               vorseal: "Defense" },
          { name: "Taelmoth the Diremaw",   type: "Soulflayer",   popItem: "Taelmoth's staff",              vorseal: "Magic Defense" },
          { name: "Zduhac",                 type: "Greater Bird", popItem: "Zduhac's talon",                vorseal: "Magic Defense" },
        ],
      },
      {
        label: "Tier 2",
        level: "Level 135",
        note: "Grand Coffers drop from specific NMs in Reisenjima.",
        nms: [
          { name: "Bashmu",     type: "Hydra",      popItem: "Bashmu's trinket",  requiredItems: "Gramk-Droog's Grand Coffer",   vorseal: "INT/MND/CHR" },
          { name: "Gajasimha",  type: "Khimaira",   popItem: "Gajasimha's mane",  requiredItems: "Ignor-Mnt's Grand Coffer x2",  vorseal: "STR/VIT" },
          { name: "Ironside",   type: "Iron Giant",  popItem: "Ironside's maul",   requiredItems: "Durs-Vike's Grand Coffer x2",  vorseal: "INT/MND/CHR" },
          { name: "Old Shuck",  type: "Orthrus",    popItem: "Old Shuck's tuft",  requiredItems: "Liij-Vok's Grand Coffer x2",   vorseal: "STR/VIT" },
          { name: "Sarsaok",    type: "Elasmoth",   popItem: "Sarsaok's hoard",   requiredItems: "Tryl-Wuj's Grand Coffer x2",   vorseal: "DEX/AGI" },
          { name: "Strophadia", type: "Harpeia",    popItem: "Strophadia's pearl", requiredItems: "Ymmr-Ulvid's Grand Coffer x2", vorseal: "DEX/AGI" },
        ],
      },
      {
        label: "Tier 3",
        level: "Level 145",
        nms: [
          { name: "Maju",  type: "Peiste",    popItem: "Maju's claw",    requiredItems: "Sovereign Behemoth's Hide", vorseal: "Occasionally Ignore Damage" },
          { name: "Neak",  type: "Dahak",     popItem: "Neak's treasure",requiredItems: "Tolba's Shell",             vorseal: "Damage Taken" },
          { name: "Yakshi",type: "Yggdreant", popItem: "Yakshi's scroll", requiredItems: "Hidhaegg's Scale",          vorseal: "Killer Effects" },
        ],
      },
      {
        label: "HELM",
        level: "Level 150",
        note: "HELM Multiples needed total: Ashen Crayfish x3 · Ashweed x6 · Bone Chip x10 · Duskcrawler x3 · Flan Meat x10 · Gravewood Log x3 · Titanite x10 · Void Crystal x9 · Void Grass x9 · Voidsnapper x9",
        nms: [
          { name: "Albumen",     type: "Mandragora",  popItem: "Albumen's flower",   requiredItems: "Ashweed x3 + Void Grass x3 + Vermihumus + Coalition Humus",                    vorseal: "Luck" },
          { name: "Erinys",      type: "Amphiptere",  popItem: "Erinys's beak",      requiredItems: "Voidsnapper x3 + Ashweed x3 + Mistmelt + Scroll of Tornado",                  vorseal: "Luck" },
          { name: "Onychophora", type: "Sandworm",    popItem: "Onychophora's soil", requiredItems: "Void Crystal x3 + Void Grass x3 + Titanite x10 + Worm Mulch",                 vorseal: "Luck" },
          { name: "Schah",       type: "Caturae",     popItem: "Schah's gambit",     requiredItems: "Voidsnapper x3 + Gravewood Log x3 + Leisure Table + Trump Card Case",          vorseal: "Luck" },
          { name: "Teles",       type: "Siren",       popItem: "Teles's hymn",       requiredItems: "Void Crystal x3 + Voidsnapper x3 + Siren's Hair + Scroll of Maiden's Virelai", vorseal: "DEX/AGI" },
          { name: "Vinipata",    type: "Naraka",      popItem: "Vinipata's blade",   requiredItems: "Void Crystal x3 + Duskcrawler x3 + Bone Chip x10 + Scarletite Ingot",          vorseal: "INT/MND/CHR" },
          { name: "Zerde",       type: "Botulus",     popItem: "Zerde's cup",        requiredItems: "Void Grass x3 + Ashen Crayfish x3 + Flan Meat x10 + Black Pudding",            vorseal: "STR/VIT" },
        ],
      },
    ],
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  "Tier 1":          "#68D391",
  "Tier 2":          "#F6E05E",
  "Tier 3":          "#FC8181",
  "HELM":            "#76E4F7",
  "Ark Angels":      "#F9A8D4",
  "Heavenly Beasts": "#FCD34D",
  "Nazar NM":        "#FF6B6B",
};

function NMCard({ nm }: { nm: NM }) {
  const color = vorsealColor(nm.vorseal);
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.nmName}>{nm.name}</Text>
        <Text style={styles.nmType}>{nm.type}</Text>
      </View>
      <View style={styles.cardRight}>
        <View style={[styles.vorsealBadge, { backgroundColor: color + "30", borderColor: color }]}>
          <Text style={[styles.vorsealText, { color }]}>{nm.vorseal}</Text>
        </View>
        <Text style={styles.popItemLabel}>Pop: <Text style={styles.popItemValue}>{nm.popItem}</Text></Text>
        {nm.requiredItems && (
          <Text style={styles.requiredItems}>Needs: {nm.requiredItems}</Text>
        )}
      </View>
    </View>
  );
}

function TierSection({ tier }: { tier: Tier }) {
  const [open, setOpen] = useState(false);
  const color = TIER_COLORS[tier.label] ?? "#E5E7EB";
  return (
    <View style={styles.tierSection}>
      <TouchableOpacity style={styles.tierHeader} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <Text style={[styles.tierLabel, { color }]}>{tier.label}</Text>
        <Text style={styles.tierLevel}>{tier.level}</Text>
        <Text style={styles.toggleHint}>{open ? 'tap to close' : 'tap to open'}</Text>
      </TouchableOpacity>

      {open && (
        <>
          {tier.sharedItems && (
            <View style={styles.sharedBox}>
              <Text style={styles.sharedTitle}>Trade any one of these to the NPC:</Text>
              <Text style={styles.sharedItems}>{tier.sharedItems}</Text>
            </View>
          )}

          {tier.note && (
            <Text style={styles.tierNote}>{tier.note}</Text>
          )}

          {tier.nms.map((nm, i) => (
            <NMCard key={i} nm={nm} />
          ))}
        </>
      )}
    </View>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Escha() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Escha / Reisenjima</Text>
      <Text style={styles.subtitle}>
        Geas Fete NMs require a Grisly Trinket key item to pop. Obtain it by trading the required items to the zone NPC.
      </Text>

      {ZONES.map((zone, i) => (
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

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:   { flex: 1, padding: 16, backgroundColor: "#1A202C" },
  mainTitle:   { fontSize: 26, fontWeight: "800", color: "#FFFFFF", marginBottom: 6 },
  subtitle:    { fontSize: 13, color: "#9CA3AF", fontStyle: "italic", marginBottom: 20 },

  zoneSection: { marginBottom: 28 },
  zoneTitle:   { fontSize: 20, fontWeight: "700", color: "#BEE3F8", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#4A5568", paddingBottom: 6 },

  tierSection: { marginBottom: 14 },
  tierHeader:  { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 10 },
  tierLabel:   { fontSize: 15, fontWeight: "700" },
  tierLevel:   { fontSize: 12, color: "#6B7280" },
  toggleHint:  { fontSize: 12, color: "#6B7280", fontStyle: "italic", marginLeft: "auto" },

  sharedBox:    { backgroundColor: "#1F2937", borderRadius: 6, padding: 10, marginBottom: 8 },
  sharedTitle:  { color: "#9CA3AF", fontSize: 11, fontWeight: "600", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  sharedItems:  { color: "#D1D5DB", fontSize: 12, lineHeight: 18 },

  tierNote:     { color: "#6B7280", fontSize: 12, fontStyle: "italic", marginBottom: 6 },

  card:         { flexDirection: "row", backgroundColor: "#2D3748", borderRadius: 7, marginBottom: 3, padding: 10, gap: 10 },
  cardLeft:     { width: 120, justifyContent: "center" },
  cardRight:    { flex: 1 },
  nmName:       { color: "#F9FAFB", fontWeight: "600", fontSize: 13 },
  nmType:       { color: "#9CA3AF", fontSize: 11, marginTop: 1 },

  vorsealBadge: { alignSelf: "flex-start", borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 4 },
  vorsealText:  { fontSize: 11, fontWeight: "700" },

  popItemLabel: { color: "#9CA3AF", fontSize: 12 },
  popItemValue: { color: "#E5E7EB", fontWeight: "500" },
  requiredItems:{ color: "#6B7280", fontSize: 11, marginTop: 3, fontStyle: "italic" },
});
