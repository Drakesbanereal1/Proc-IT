import { ScrollView, Text, View, StyleSheet } from "react-native";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface PhysSpell {
  name: string;
  pts: number;
  sc: string[];
}

interface JobAbility {
  name: string;
  level: string;
  recast: string;
  desc: string;
}

// ─── SC COLOR ────────────────────────────────────────────────────────────────

function scColor(prop: string): string {
  const map: Record<string, string> = {
    Transfixion:   "#A78BFA",
    Compression:   "#2DD4BF",
    Liquefaction:  "#F97316",
    Scission:      "#4ADE80",
    Reverberation: "#60A5FA",
    Detonation:    "#FB923C",
    Induration:    "#38BDF8",
    Impaction:     "#FBBF24",
    Gravitation:   "#6EE7B7",
    Distortion:    "#93C5FD",
    Fusion:        "#F9A8D4",
    Fragmentation: "#FCA5A5",
    Light:         "#FDE68A",
    Darkness:      "#C084FC",
  };
  return map[prop] ?? "#9CA3AF";
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const PHYS_SPELLS: PhysSpell[] = [
  // ── 1 pt ──────────────────────────────────────────────────────────────────
  { name: "Wild Oats",        pts: 1, sc: ["Transfixion"] },
  { name: "Foot Kick",        pts: 1, sc: ["Detonation"] },
  { name: "Sprout Smack",     pts: 1, sc: ["Reverberation"] },
  { name: "Queasyshroom",     pts: 1, sc: ["Compression"] },
  // ── 2 pt ──────────────────────────────────────────────────────────────────
  { name: "Battle Dance",     pts: 2, sc: ["Impaction"] },
  { name: "Head Butt",        pts: 2, sc: ["Impaction"] },
  { name: "Bludgeon",         pts: 2, sc: ["Liquefaction"] },
  { name: "Claw Cyclone",     pts: 2, sc: ["Scission"] },
  { name: "Grand Slam",       pts: 2, sc: ["Induration"] },
  { name: "Uppercut",         pts: 2, sc: ["Liquefaction"] },
  { name: "Screwdriver",      pts: 2, sc: ["Transfixion", "Scission"] },
  { name: "Smite of Rage",    pts: 2, sc: ["Detonation"] },
  { name: "Jet Stream",       pts: 2, sc: ["Impaction"] },
  { name: "Body Slam",        pts: 2, sc: ["Impaction"] },
  { name: "Spiral Spin",      pts: 2, sc: ["Transfixion"] },
  { name: "Tail Slap",        pts: 2, sc: ["Reverberation"] },
  { name: "Hydro Shot",       pts: 2, sc: ["Reverberation"] },
  { name: "Mandibular Bite",  pts: 2, sc: ["Induration"] },
  { name: "Frypan",           pts: 2, sc: ["Impaction"] },
  { name: "Seedspray",        pts: 2, sc: ["Detonation"] },
  { name: "Spinal Cleave",    pts: 2, sc: ["Detonation"] },
  { name: "Vanity Dive",      pts: 2, sc: ["Scission"] },
  { name: "Ram Charge",       pts: 2, sc: ["Fragmentation"] },
  { name: "Terror Touch",     pts: 2, sc: ["Compression", "Impaction"] },
  { name: "Sudden Lunge",     pts: 2, sc: ["Detonation"] },
  { name: "Empty Thrash",     pts: 2, sc: ["Scission"] },
  { name: "Disseverment",     pts: 2, sc: ["Distortion"] },
  { name: "Filamented Hold",  pts: 2, sc: ["Induration"] },
  // ── 3 pt ──────────────────────────────────────────────────────────────────
  { name: "Asuran Claws",     pts: 3, sc: ["Liquefaction"] },
  { name: "Heavy Strike",     pts: 3, sc: ["Transfixion", "Fragmentation"] },
  { name: "Cannonball",       pts: 3, sc: ["Liquefaction", "Fusion"] },
  { name: "Frenetic Rip",     pts: 3, sc: ["Induration"] },
  { name: "Vertical Cleave",  pts: 3, sc: ["Gravitation"] },
  { name: "Sub-zero Smash",   pts: 3, sc: ["Fragmentation"] },
  { name: "Goblin Rush",      pts: 3, sc: ["Impaction", "Fusion"] },
  { name: "Quadrastrike",     pts: 3, sc: ["Scission"] },
  // ── 4 pt ──────────────────────────────────────────────────────────────────
  { name: "Thrashing Assault",pts: 4, sc: ["Impaction", "Fusion"] },
  { name: "Benthic Typhoon",  pts: 4, sc: ["Transfixion", "Gravitation"] },
  { name: "Glutinous Dart",   pts: 4, sc: ["Fragmentation"] },
  { name: "Delta Thrust",     pts: 4, sc: ["Detonation", "Liquefaction"] },
  { name: "Sinker Drill",     pts: 4, sc: ["Gravitation"] },
  { name: "Barbed Crescent",  pts: 4, sc: ["Liquefaction", "Distortion"] },
  { name: "Saurian Slide",    pts: 4, sc: ["Distortion"] },
  { name: "Whirl of Rage",    pts: 4, sc: ["Detonation", "Scission"] },
  { name: "Quad. Continuum",  pts: 4, sc: ["Scission", "Distortion"] },
  { name: "Amorphic Spikes",  pts: 4, sc: ["Transfixion", "Gravitation"] },
  // ── 5 pt ──────────────────────────────────────────────────────────────────
  { name: "Tourbillion",      pts: 5, sc: ["Light"] },
  { name: "Bilgestorm",       pts: 5, sc: ["Light"] },
  { name: "Bloodrake",        pts: 5, sc: ["Darkness"] },
];

// Notable self-skillchain pairs (Chain Affinity x2, opener → closer)
const SELF_SC: { opener: string; closer: string; result: string; level: number }[] = [
  { opener: "Goblin Rush (Impaction)",   closer: "Cannonball (Liquefaction)",    result: "Fusion",        level: 2 },
  { opener: "Goblin Rush (Impaction)",   closer: "Delta Thrust (Liquefaction)",  result: "Fusion",        level: 2 },
  { opener: "Disseverment (Distortion)", closer: "Vertical Cleave (Gravitation)",result: "Darkness",      level: 3 },
  { opener: "Vertical Cleave (Grav.)",   closer: "Sinker Drill (Gravitation)",   result: "Darkness",      level: 3 },
  { opener: "Tourbillion (Light)",       closer: "Bilgestorm (Light)",           result: "Radiance",      level: 4 },
  { opener: "Bloodrake (Darkness)",      closer: "Bloodrake* (Darkness)",        result: "Umbra",         level: 4 },
];

const JOB_ABILITIES: JobAbility[] = [
  { name: "Azure Lore",          level: "1",   recast: "1:00:00", desc: "Boosts blue magic spell damage temporarily." },
  { name: "Burst Affinity",      level: "25",  recast: "Merit",   desc: "Next qualifying blue magic spell can magic burst. Available as /BLU sub at Lv25." },
  { name: "Chain Affinity",      level: "40",  recast: "Merit",   desc: "Next physical blue magic spell acts as a weapon skill for skillchaining. Available as /BLU sub at Lv40." },
  { name: "Convergence",         level: "75",  recast: "Merit",   desc: "Reduces blue magic spell range; adds magic acc/atk bonus." },
  { name: "Diffusion",           level: "75",  recast: "Merit",   desc: "Extends single-target support blue magic to the whole party at reduced effect." },
  { name: "Efflux",              level: "83",  recast: "Merit",   desc: "Adds Mag.Atk.Bonus +30 and raises the critical hit rate of the next blue magic spell." },
  { name: "Unbridled Learning",  level: "95",  recast: "10:00",   desc: "Cast one blue magic spell from outside your current set." },
  { name: "Unbridled Wisdom",    level: "96",  recast: "10:00",   desc: "Temporarily cast any blue magic spell regardless of what is set." },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const PT_COLORS: Record<number, string> = {
  1: "#9CA3AF",
  2: "#60A5FA",
  3: "#4ADE80",
  4: "#FBBF24",
  5: "#F87171",
};

const SC_LEVEL_COLORS: Record<number, string> = {
  2: "#60A5FA",
  3: "#FBBF24",
  4: "#C084FC",
};

function SpellCard({ spell }: { spell: PhysSpell }) {
  const ptColor = PT_COLORS[spell.pts] ?? "#9CA3AF";
  return (
    <View style={styles.spellCard}>
      <View style={[styles.ptBadge, { backgroundColor: ptColor + "20", borderColor: ptColor }]}>
        <Text style={[styles.ptText, { color: ptColor }]}>{spell.pts}pt</Text>
      </View>
      <Text style={styles.spellName}>{spell.name}</Text>
      <View style={styles.scTags}>
        {spell.sc.map((prop) => {
          const c = scColor(prop);
          return (
            <View key={prop} style={[styles.scTag, { backgroundColor: c + "25", borderColor: c }]}>
              <Text style={[styles.scTagText, { color: c }]}>{prop}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function BLU() {
  const grouped = [1, 2, 3, 4, 5].map((pts) => ({
    pts,
    spells: PHYS_SPELLS.filter((s) => s.pts === pts),
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Blue Mage (BLU)</Text>
      <Text style={styles.subtitle}>
        Physical blue magic spells can be used as weapon skills via{" "}
        <Text style={styles.highlight}>Chain Affinity</Text>. Use two charges to self-skillchain.
        Magical spells can magic burst with{" "}
        <Text style={styles.highlight}>Burst Affinity</Text>.
      </Text>

      {/* ── Physical Spells ── */}
      <Text style={styles.sectionTitle}>Physical Spells</Text>
      <Text style={styles.sectionNote}>Organized by point cost (1–5 pts)</Text>

      {grouped.map(({ pts, spells }) => {
        const ptColor = PT_COLORS[pts];
        return (
          <View key={pts} style={styles.ptGroup}>
            <View style={styles.ptHeader}>
              <View style={[styles.ptHeaderBadge, { backgroundColor: ptColor + "25", borderColor: ptColor }]}>
                <Text style={[styles.ptHeaderText, { color: ptColor }]}>{pts} Point{pts > 1 ? "s" : ""}</Text>
              </View>
            </View>
            {spells.map((s) => (
              <SpellCard key={s.name} spell={s} />
            ))}
          </View>
        );
      })}

      {/* ── Self-Skillchain Reference ── */}
      <Text style={styles.sectionTitle}>Self-Skillchain Guide</Text>
      <Text style={styles.sectionNote}>
        Requires Chain Affinity (x2 with merits). Opener → Closer format.
        *Bloodrake requires two BLUs.
      </Text>
      {SELF_SC.map((pair, i) => {
        const c = SC_LEVEL_COLORS[pair.level] ?? "#9CA3AF";
        return (
          <View key={i} style={styles.scPairCard}>
            <View style={styles.scPairLeft}>
              <Text style={styles.scPairOpener}>{pair.opener}</Text>
              <Text style={styles.scPairArrow}>→</Text>
              <Text style={styles.scPairCloser}>{pair.closer}</Text>
            </View>
            <View style={[styles.scPairResult, { backgroundColor: c + "20", borderColor: c }]}>
              <Text style={[styles.scPairResultText, { color: c }]}>{pair.result}</Text>
              <Text style={[styles.scPairLevel, { color: c }]}>Lv{pair.level}</Text>
            </View>
          </View>
        );
      })}

      {/* ── Job Abilities ── */}
      <Text style={styles.sectionTitle}>Job Abilities</Text>
      {JOB_ABILITIES.map((ja) => (
        <View key={ja.name} style={styles.jaCard}>
          <View style={styles.jaHeader}>
            <Text style={styles.jaName}>{ja.name}</Text>
            <View style={styles.jaMeta}>
              <Text style={styles.jaLevel}>Lv{ja.level}</Text>
              <Text style={styles.jaRecast}>{ja.recast}</Text>
            </View>
          </View>
          <Text style={styles.jaDesc}>{ja.desc}</Text>
        </View>
      ))}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 16, backgroundColor: "#1A202C" },
  mainTitle:    { fontSize: 26, fontWeight: "800", color: "#FFFFFF", marginBottom: 6 },
  subtitle:     { fontSize: 13, color: "#9CA3AF", fontStyle: "italic", marginBottom: 20, lineHeight: 19 },
  highlight:    { color: "#7DD3FC", fontWeight: "700", fontStyle: "normal" },

  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#BEE3F8", marginTop: 24, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: "#4A5568", paddingBottom: 5 },
  sectionNote:  { fontSize: 11, color: "#6B7280", fontStyle: "italic", marginBottom: 10 },

  // Point groups
  ptGroup:      { marginBottom: 12 },
  ptHeader:     { marginBottom: 6 },
  ptHeaderBadge:{ alignSelf: "flex-start", borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 3 },
  ptHeaderText: { fontSize: 12, fontWeight: "700" },

  // Spell cards
  spellCard:    { flexDirection: "row", alignItems: "center", backgroundColor: "#2D3748", borderRadius: 6, marginBottom: 3, paddingHorizontal: 10, paddingVertical: 7, gap: 8 },
  ptBadge:      { borderWidth: 1, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, minWidth: 30, alignItems: "center" },
  ptText:       { fontSize: 10, fontWeight: "700" },
  spellName:    { flex: 1, color: "#F9FAFB", fontSize: 13, fontWeight: "500" },
  scTags:       { flexDirection: "row", gap: 4, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 220 },
  scTag:        { borderWidth: 1, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  scTagText:    { fontSize: 10, fontWeight: "700" },

  // Self-SC cards
  scPairCard:   { flexDirection: "row", alignItems: "center", backgroundColor: "#2D3748", borderRadius: 6, marginBottom: 4, paddingHorizontal: 10, paddingVertical: 8, gap: 8 },
  scPairLeft:   { flex: 1, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4 },
  scPairOpener: { color: "#E5E7EB", fontSize: 12 },
  scPairArrow:  { color: "#6B7280", fontSize: 12 },
  scPairCloser: { color: "#E5E7EB", fontSize: 12 },
  scPairResult: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4, alignItems: "center" },
  scPairResultText: { fontSize: 12, fontWeight: "700" },
  scPairLevel:  { fontSize: 10, fontWeight: "600" },

  // Job ability cards
  jaCard:       { backgroundColor: "#2D3748", borderRadius: 7, marginBottom: 6, padding: 10 },
  jaHeader:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  jaName:       { color: "#7DD3FC", fontSize: 14, fontWeight: "700" },
  jaMeta:       { flexDirection: "row", gap: 8 },
  jaLevel:      { color: "#9CA3AF", fontSize: 11 },
  jaRecast:     { color: "#6B7280", fontSize: 11, fontStyle: "italic" },
  jaDesc:       { color: "#D1D5DB", fontSize: 12, lineHeight: 18 },
});
