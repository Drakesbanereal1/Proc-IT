import { useState } from "react";
import {
  ScrollView, Text, View, Image, TouchableOpacity,
  Modal, StyleSheet, Dimensions,
} from "react-native";

const SCREEN = Dimensions.get("window");

// ─── IMAGE MAP ───────────────────────────────────────────────────────────────

const IMGS: Record<string, any> = {
  orc:            require("../../assets/ambuscade/Orcs.png"),
  quadav:         require("../../assets/ambuscade/Quadav.png"),
  yagudo:         require("../../assets/ambuscade/Yagudo.png"),
  goblin:         require("../../assets/ambuscade/Goblin.png"),
  gigas:          require("../../assets/ambuscade/Gigas.png"),
  mamool_ja:      require("../../assets/ambuscade/Mamool Ja.png"),
  poroggo:        require("../../assets/ambuscade/Poroggo.png"),
  troll:          require("../../assets/ambuscade/Troll.png"),
  soulflayer:     require("../../assets/ambuscade/Soulflayer.png"),
  lamiae:         require("../../assets/ambuscade/lamiae.png"),
  mage_mamool_ja: require("../../assets/ambuscade/Mamool Ja.png"),
  velkk:          require("../../assets/ambuscade/Velkk.png"),
  fomor:          require("../../assets/ambuscade/Fomor.png"),
  fomor_summoner: require("../../assets/ambuscade/Fomor.png"),
  antica:         require("../../assets/ambuscade/Antica.png"),
  tonberry:       require("../../assets/ambuscade/Tonberry.png"),
  sahagin:        require("../../assets/ambuscade/Sahagin.png"),
  qiqirn:         require("../../assets/ambuscade/Qiqirn.png"),
  qutrub:         require("../../assets/ambuscade/Qutrub.png"),
  meeble:         require("../../assets/ambuscade/Meeble.png"),
  dullahan:       require("../../assets/ambuscade/Dullahan.png"),
  corse:          require("../../assets/ambuscade/Corse.png"),
  moogle:         require("../../assets/ambuscade/Moogle.png"),
  iron_giant:     require("../../assets/ambuscade/Iron Giant.png"),
};

// ─── DATA ────────────────────────────────────────────────────────────────────

interface Family {
  id: string; name: string; category: string;
  strat: string; useful_jobs: string; avoid_watch: string;
  play_by_play: string; key_mechanics: string[];
  kill_order?: string;
  resistances?: { weak?: string[]; low?: string[]; strong?: string[] };
}

const FAMILIES: Family[] = [
  {
    id: "orc", name: "Orc", category: "Beastmen",
    strat: "Crowd control the pack and prevent the boss's charm cycle by removing its aura with a physical WS from behind.",
    useful_jobs: "RUN, MNK, BLU, GEO, BRD, WHM (tank + BRD + healer + DDs setup)",
    avoid_watch: "Death from Warlock, Break, AoE debuffs from Hecteyes pet, charm if aura reset fails",
    play_by_play: "Sleep the adds, pull to corner, silence Warlock and Reaver, kill high-threat adds first, assign DD to boss aura duty from back. Do NOT kill Tamer's pet first or you may trigger AoE charm move.",
    key_mechanics: ["Charm cycle prevention via aura removal", "Physical WS from behind removes aura", "Sleep crowd control essential", "Silence priority: Warlock and Reaver"],
    kill_order: "Warlock (BLM) → Lyricist (BRD) → Swordsman (SAM) → Brawler (MNK) → Shinobi (NIN) → Garuda → Boss (Conjurer)",
  },
  {
    id: "quadav", name: "Quadav", category: "Beastmen",
    strat: "The High Vicar's shell drops only in its heal window — control add flow and use Elementalist as bait for Cure casts.",
    useful_jobs: "Any competent tank/DD core, silence support valuable",
    avoid_watch: "Wasting WS outside shell-drop windows, unsilenced casters, Benediction phases",
    play_by_play: "Kill initial melee adds, dump TP on Devout to skip Invincible, push boss to first Benediction, partially damage and silence Elementalist, then WS Vicar only when it casts Cure and Imperfect Shell Defense drops.",
    key_mechanics: ["Imperfect Shell Defense mechanic", "Shell drops during Cure window only", "Elementalist bait strategy", "Benediction phase management"],
  },
  {
    id: "yagudo", name: "Yagudo", category: "Beastmen",
    strat: "Kill/control the support jobs around the Conjurer and respect the Conjurer's enhanced TP set. Low Wind/Earth resist.",
    useful_jobs: "Tank, BRD/WHM, healer, DDx2, COR or GEO",
    avoid_watch: "Kamaitachi + Howl, general support pileup from Yagudo side mobs",
    play_by_play: "Standard tanked setup, keep support locked down, treat boss as finisher after reducing side pressure. Always kill Garuda first before attacking boss. Use Baraera for Garuda phase.",
    key_mechanics: ["Support job control priority", "Conjurer enhanced TP moves", "Garuda kill priority", "Howl must be removed to prevent Kamaitachi wipe"],
    kill_order: "Garuda (first, always) → Conjurer (boss)",
    resistances: { low: ["Wind", "Earth"] },
  },
  {
    id: "goblin", name: "Goblin", category: "Beastmen",
    strat: "Kill the Don first while managing bombs and binding side goblins.",
    useful_jobs: "Tank, DD, support with bind/sleep capabilities",
    avoid_watch: "Furious Bombers, Baby Bombers, unbound side goblins",
    play_by_play: "Focus Don first, manage bomb spawns (Furious Bombers and Baby Bombers), bind side goblins to control aggro. Job-priority hate system requires careful target management.",
    key_mechanics: ["Don-first kill priority", "Bomb management (Furious/Baby Bombers)", "Bind side goblins", "Job-priority hate system"],
  },
  {
    id: "gigas", name: "Gigas", category: "Beastmen",
    strat: "They have Regain, use job 1-hours, and reduced magic defense. Skillchain + magic burst is especially strong. Water weakness.",
    useful_jobs: "Magic burst setup, jobs with strong skillchain capabilities",
    avoid_watch: "No sleep viability, Regain keeps TP flowing",
    play_by_play: "Focus on Water element skillchains and coordinate magic bursts for maximum damage. Cannot sleep mobs. Regain mechanic means they constantly build TP.",
    key_mechanics: ["Regain passive ability", "Job 1-hour abilities active", "Reduced magic defense", "Immune to sleep"],
    resistances: { weak: ["Water"] },
  },
  {
    id: "mamool_ja", name: "Mamool Ja", category: "Beastmen",
    strat: "Remove auras via specific SC properties per add. Prevent Mijin Gakure cycle with Light/Dark skillchains.",
    useful_jobs: "Jobs that can create specific skillchain properties (Light/Dark)",
    avoid_watch: "Mijin Gakure, incorrect skillchain properties for aura removal",
    play_by_play: "Create appropriate skillchain for each add type to remove their auras. Use Light or Dark skillchains to prevent Mijin Gakure cycles. Each add requires specific SC property.",
    key_mechanics: ["Aura removal via SC properties", "Light/Dark SC prevents Mijin Gakure", "Add-specific SC requirements", "Mijin Gakure prevention critical"],
  },
  {
    id: "poroggo", name: "Poroggo", category: "Beastmen",
    strat: "Subtle Blow/TP denial fight with Mewing Lullaby spam and fast melee pressure to manage Chainspell.",
    useful_jobs: "High Subtle Blow jobs, BRD for Mewing Lullaby",
    avoid_watch: "Chainspell phases, TP moves if denial fails",
    play_by_play: "Maintain high Subtle Blow gear to deny TP gain. Spam Mewing Lullaby to control TP moves. Apply fast melee pressure to finish before Chainspell becomes overwhelming.",
    key_mechanics: ["Subtle Blow required (TP denial)", "Mewing Lullaby spam", "Chainspell pressure phases", "Fast melee finish strategy"],
  },
  {
    id: "troll", name: "Troll", category: "Beastmen",
    strat: "Aura-removal dependency fight. Zahhak add must be silenced on VD. Nullsong/Voidsong dispel mechanics.",
    useful_jobs: "Jobs with dispel capabilities, silence support essential",
    avoid_watch: "Active auras causing damage, Zahhak add on VD difficulty",
    play_by_play: "Consistently remove auras to prevent damage. On Very Difficult, silence the Zahhak add immediately. Manage Nullsong and Voidsong dispel mechanics carefully.",
    key_mechanics: ["Aura removal required", "Zahhak add silence (VD only)", "Nullsong dispels player buffs", "Voidsong dispels enemy buffs"],
  },
  {
    id: "soulflayer", name: "Soulflayer", category: "Arcana",
    strat: "Anti-buff/shield-management fight. Boss opens with Mighty Guard and has huge AoE dispel pressure with layered shields.",
    useful_jobs: "Ranged WS jobs, ranged support for safe positioning",
    avoid_watch: "AoE dispel, Terror, Sleep, Bind, Gravity, Silence aura, shield cycles getting ahead",
    play_by_play: "Kill or control imp adds first. Strip or work around boss defenses and shield layers. Finish the Soulflayer Master at range once the field is clean to avoid dispel pressure.",
    key_mechanics: ["Immortal Shield mechanics", "Mighty Guard opening", "AoE dispel pressure", "Imp protection removal"],
  },
  {
    id: "lamiae", name: "Lamiae", category: "Beastmen",
    strat: "Facing/turning fight. Gaze-based petrification and doom mechanics. Stay at range and turn away for dance/gaze moves.",
    useful_jobs: "PLD, RNG/COR, BRD, WHM, PUP (ranged comfortable)",
    avoid_watch: "Petrification, Doom, Bind, hate reset, Eagle Eye Shot, breaking gaze triggers aura chaos",
    play_by_play: "Stay at range. Tank faces targets correctly for mechanics. Turn away for dance/gaze moves to avoid petrification/doom. Kill order: Freyja → Skathi → Frigg. Avoid casting debuffs directly on Freyja to prevent draw-in.",
    key_mechanics: ["Facing mechanics (turn away for gaze)", "Gaze-based petrification/doom", "Hate reset via breaking eye contact", "Draw-in from debuffing Freyja"],
    kill_order: "Freyja → Skathi → Frigg",
  },
  {
    id: "mage_mamool_ja", name: "Mage Mamool Ja", category: "Beastmen",
    strat: "Caster-control fight. Each casts single element and absorbs same element. Manage Manafont/Chainspell timing or risk Mijin Gakure.",
    useful_jobs: "PLD/RUN, DDx2, BRD/COR, RDM, WHM (tank/DD/RDM sub NIN recommended)",
    avoid_watch: "Wrong-element skillchains, late silence timing, Hurl Anathema, status effects, Mijin Gakure",
    play_by_play: "Wall the pack. Designate target kill order. Keep Addle II on current target. Silence immediately AFTER Manafont starts (not before or Mijin triggers). Maintain correct barspell up. Never skillchain with the element the target absorbs.",
    key_mechanics: ["Single-element casters", "Elemental absorption (same as cast element)", "Manafont/Chainspell timing critical", "Mijin Gakure if silenced at wrong time"],
  },
  {
    id: "velkk", name: "Velkk", category: "Beastmen",
    strat: "Don't let Regent level up. 25k+ single-hit or SC damage triggers Nobless Oblige level-ups. 40k threshold also exists.",
    useful_jobs: "PLD, COR, DD (must avoid oversized SC spikes)",
    avoid_watch: "Killing servitors thoughtlessly, oversized bursts, Magic Shield, en-bind autos, AoE physicals",
    play_by_play: "Control servitor deaths carefully. Keep weaponskill damage under dangerous thresholds (25k and 40k). Kill Regent before the level-up spiral makes fight unwinnable. Clean up remaining adds after.",
    key_mechanics: ["Nobless Oblige level-up prevention", "25k damage threshold (first trigger)", "40k damage threshold (second trigger)", "Servitor death triggers"],
  },
  {
    id: "fomor", name: "Fomor", category: "Undead",
    strat: "Sleep random Fomori adds, pull boss away, clear adds before Chainspell phase to prevent Death spam.",
    useful_jobs: "Sleep support (BRD/WHM/RDM), mobile tank, DD",
    avoid_watch: "Chainspell Death spam, ES Sleep resistance on VD difficulty",
    play_by_play: "Sleep the random adds that spawn. Pull boss to separate location. Methodically eliminate adds before boss reaches Chainspell phase. ES Sleep has resistance on Very Difficult.",
    key_mechanics: ["Random Fomori add spawns", "Chainspell Death prevention", "ES Sleep resistance (VD)", "Add control before SP phase"],
  },
  {
    id: "fomor_summoner", name: "Fomor Summoner", category: "Undead",
    strat: "Fast avatar control is everything. Ramuh especially dangerous due to Shock Spikes and stun pressure. Focus Ramuh first.",
    useful_jobs: "PLD, BRD/BLM, SCH or WHM, multiple COR",
    avoid_watch: "Odin/Zantetsuken, Alexander/Perfect Defense, Shock Spikes, elemental SCs healing matching avatars",
    play_by_play: "Remove Ramuh's Shock Spikes first. Burst down Ramuh quickly with Earth element attacks (Earth Shot/Savage Blade). Sleep or isolate the free corner avatar. Immediately collapse on Doppleganger before Astral Flow escalates.",
    key_mechanics: ["Avatar control priority (Ramuh first)", "Shock Spikes on Ramuh", "Odin instant kill threat", "Alexander Perfect Defense", "Matching element SC heals avatars"],
    kill_order: "Ramuh (priority) → Corner Avatar (sleep/control) → Doppleganger (before Astral Flow)",
  },
  {
    id: "antica", name: "Antica", category: "Vermin",
    strat: "Consul-only win condition. Sabotender Dulce range mechanic. Consul calls more Antica over time and takes reduced damage while cactus is out of range.",
    useful_jobs: "Strong single-target DD, tank, healer (must handle unsleepable adds)",
    avoid_watch: "Adds immune to sleep, Sabotender Needles, killing adds powers up boss",
    play_by_play: "Open engagement on Consul. Burn Sabotender Dulce when it comes into reach. Control incoming add order and positioning. Finish Consul before add pressure snowballs.",
    key_mechanics: ["Consul-only win condition", "Sabotender Dulce range mechanic", "Adds unsleepable", "Killing adds powers boss"],
  },
  {
    id: "tonberry", name: "Tonberry", category: "Arcana",
    strat: "Kill in controlled order and keep Tonberry hate low. Everyone's Wrath and Revenge scale directly with Tonberry hate accumulated.",
    useful_jobs: "Tank, GEO, WHM, DDs with controlled target swaps and dispel access",
    avoid_watch: "Everyone's Wrath/Revenge (hate-scaling damage), ethereal add Darkness SC attempts, boss evasion boosts",
    play_by_play: "Kill adds in order: SMN → BLM → NIN → THF → Monarch. Always face the ethereal add when it appears to prevent Darkness skillchain. Keep Dia/Distract/Dispel on Monarch to counter evasion boosts.",
    key_mechanics: ["Tonberry hate scaling", "Everyone's Wrath/Revenge (hate-based)", "Ethereal add Darkness SC threat", "Evasion boost mechanics"],
    kill_order: "SMN → BLM → NIN → THF → Monarch",
  },
  {
    id: "sahagin", name: "Sahagin", category: "Aquan",
    strat: "Don't directly kill Songstress. Remove her HP by killing other Sahagin. Silence shuts off regen/bio support.",
    useful_jobs: "Sleep support, tank, DD (ranged or mobile compositions work well)",
    avoid_watch: "Songstress bio aura, regen while unsilenced, Cleansing Bubbles (wipes debuffs + wakes slept enemies), Virelai on VD",
    play_by_play: "Silence Songstress immediately. Sleep/control the pack. Kill required Sahagin count to damage Songstress indirectly. Resleep after Benediction-type resets. Finish remaining field mobs.",
    key_mechanics: ["Indirect damage to Songstress", "Silence removes bio/regen", "Cleansing Bubbles reset", "Sleep management essential"],
  },
  {
    id: "qiqirn", name: "Qiqirn", category: "Beastmen",
    strat: "No-buffs fight. Party songs, rolls, beneficial bubbles, and Avatar's Favor trigger Essence Steal (heal to full + level up on hit).",
    useful_jobs: "RDM (Scoundrels can be slept/bound), BLU/DD",
    avoid_watch: "Bringing standard buffs triggers Essence Steal, letting them melee players, random SP on Pilferer, mine spawns",
    play_by_play: "Go in mostly unbuffed (only safe buffs). Sleep/bind Scoundrels. Burst down Pilferer first. Kill bombs if relevant. Clean up slept targets one by one.",
    key_mechanics: ["No buffs allowed (Essence Steal trigger)", "Sleep/bind Scoundrels", "Mine spawns", "Random Pilferer SP ability"],
  },
  {
    id: "qutrub", name: "Qutrub", category: "Undead",
    strat: "Add management fight. Use Mewing Lullaby or kiting at 30% HP threshold. Prevent Triple Reversal. Handle endeath mechanics.",
    useful_jobs: "BRD for Mewing Lullaby, mobile jobs for kiting strategy",
    avoid_watch: "30% HP threshold triggers, Triple Reversal mechanic, endeath effects",
    play_by_play: "Manage adds carefully throughout fight. At 30% HP, either apply Mewing Lullaby or switch to full kiting strategy. Prevent Triple Reversal from triggering. Handle endeath mechanics when they occur.",
    key_mechanics: ["Add management required", "30% threshold (Mewing Lullaby or kite)", "Triple Reversal prevention", "Endeath mechanics"],
  },
  {
    id: "meeble", name: "Meeble", category: "Beastmen",
    strat: "Barspell reaction fight. Warble element determines status package. Matching Barspell negates Warble damage and effects.",
    useful_jobs: "WHM, RDM, SCH (strong barspell access)",
    avoid_watch: "Housemaker Earthshaker targeting, wrong barspells active",
    play_by_play: "Identify Warble element being used. Apply matching barspell to party. Manage Housemaker Earthshaker positioning and targeting. Keep appropriate barspell up for current Warble element throughout fight.",
    key_mechanics: ["Barspell reaction mechanic", "Warble element determines status", "Matching barspell negates effects", "Housemaker Earthshaker targeting"],
  },
  {
    id: "dullahan", name: "Dullahan", category: "Undead",
    strat: "State management fight (Normal/Charging/Boiling/Miasma). Damage intake affects TP move power. Eisenschneider causes instant K.O.",
    useful_jobs: "Jobs that can control damage output and adapt to state changes",
    avoid_watch: "State transitions, escalating TP move power based on damage taken, Eisenschneider instant K.O.",
    play_by_play: "Monitor boss state carefully (Normal → Charging → Boiling → Miasma). Adjust party damage output to control state transitions. Avoid damage spikes that escalate TP move power. Never trigger Eisenschneider conditions.",
    key_mechanics: ["Four states (Normal/Charging/Boiling/Miasma)", "Damage intake affects TP move power", "Eisenschneider instant K.O.", "State transition management"],
  },
  {
    id: "corse", name: "Corse", category: "Undead",
    strat: "Adds enable lethal Blood Weapon+Souleater combo. Kill/neutralize Warders before boss lines up this combination.",
    useful_jobs: "PLD, WHM, BRD, COR, MNK, BLU",
    avoid_watch: "Charm, Doom, Silence, Curse, leaving Warders up during SP windows",
    play_by_play: "Engage boss to trigger add spawn. BLU uses Feather Tickle/Reaving Wind. WHM keeps Silence on Corse. Control TP feed to avoid dangerous skillchains during heal-prone phases. Kill one Warder early to prevent lethal combo.",
    key_mechanics: ["Warders enable lethal Blood Weapon+Souleater", "Feather Tickle/Reaving Wind (BLU)", "Kill one Warder early", "TP control during heal phases"],
  },
  {
    id: "moogle", name: "Moogle", category: "Beastmen",
    strat: "Aura positioning fight. Avoid Steward DoT auras. Use friendly moogle aura during boss SP phases (inflicts amnesia trade-off). Essence Steal from buffs.",
    useful_jobs: "SMN x3, GEO, THF/PLD, RDM (VD setup), melee burns work at lower difficulties",
    avoid_watch: "Invite Over stewards, boss SP auras, amnesia timing from friendly auras, terror, sleep, disease, light damage",
    play_by_play: "Move away from spawned Steward DoT auras. During boss SP phases, move toward counter-aura friendly moogles (accept amnesia trade-off). Keep boss dispelled/silenced when relevant. Burn during safe windows between mechanics.",
    key_mechanics: ["Aura positioning (avoid Steward DoT)", "Friendly moogle counter-aura (amnesia trade)", "Essence Steal from buffs", "Invite Over mechanic"],
  },
  {
    id: "iron_giant", name: "Iron Giant", category: "Arcana",
    strat: "Dual giant split mechanic. When one deactivated, the other becomes extremely vulnerable to either physical or magical damage.",
    useful_jobs: "RUN, COR, BRD, GEO, WHM (mixed ranged or split-damage groups)",
    avoid_watch: "Cyclone Turbine dispels, terror, hate resets, max HP/MP down, weakness",
    play_by_play: "Either keep both giants' HP close to limit mechanics, or intentionally manipulate the 15% HP split to deactivate one giant. Unload the correct damage type (physical or magical) into the active giant based on which one is deactivated.",
    key_mechanics: ["Dual giant system", "15% HP deactivation threshold", "Physical vulnerable when magic giant down", "Magic vulnerable when physical giant down"],
  },
];

// ─── CATEGORY COLORS ─────────────────────────────────────────────────────────

const CAT_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  Beastmen: { bg: "#431407", text: "#FED7AA", border: "#EA580C" },
  Undead:   { bg: "#2E1065", text: "#E9D5FF", border: "#9333EA" },
  Arcana:   { bg: "#1E3A5F", text: "#BAE6FD", border: "#0EA5E9" },
  Vermin:   { bg: "#14532D", text: "#BBF7D0", border: "#16A34A" },
  Aquan:    { bg: "#164E63", text: "#A5F3FC", border: "#06B6D4" },
};

const CATEGORIES = ["All", "Beastmen", "Undead", "Arcana", "Vermin", "Aquan"];

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────

function ImageLightbox({ source, style }: { source: any; style: any }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.85}>
        <Image source={source} style={style} resizeMode="contain" />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={S.lightboxOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <Image source={source} style={{ width: SCREEN.width, height: SCREEN.height * 0.75 }} resizeMode="contain" />
          <Text style={S.lightboxHint}>tap anywhere to close</Text>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ─── FAMILY CARD ─────────────────────────────────────────────────────────────

function FamilyCard({ family }: { family: Family }) {
  const [open, setOpen] = useState(false);
  const cat = CAT_COLOR[family.category] ?? CAT_COLOR.Beastmen;

  return (
    <View style={[S.card, { borderLeftColor: cat.border }]}>
      {/* ── Header (always visible, tap to toggle) ── */}
      <TouchableOpacity onPress={() => setOpen(o => !o)} activeOpacity={0.8} style={S.cardHeader}>
        <ImageLightbox source={IMGS[family.id]} style={S.cardImg} />
        <View style={S.cardHeaderInfo}>
          <Text style={S.cardName}>{family.name}</Text>
          <View style={[S.catBadge, { backgroundColor: cat.bg, borderColor: cat.border }]}>
            <Text style={[S.catText, { color: cat.text }]}>{family.category}</Text>
          </View>
          <Text style={S.cardHint}>{open ? "tap to close ▲" : "tap to open ▼"}</Text>
        </View>
      </TouchableOpacity>

      {/* ── Detail (visible when open) ── */}
      {open && (
        <View style={S.detail}>

          {/* Strategy */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>🎯 Strategy</Text>
            <Text style={S.bodyText}>{family.strat}</Text>
          </View>

          {/* Key Mechanics */}
          {family.key_mechanics?.length > 0 && (
            <View style={S.section}>
              <Text style={S.sectionTitle}>⚙️ Key Mechanics</Text>
              {family.key_mechanics.map((m, i) => (
                <View key={i} style={S.bulletRow}>
                  <Text style={[S.bullet, { color: cat.border }]}>▸ </Text>
                  <Text style={S.bulletText}>{m}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Recommended Jobs */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>👥 Recommended Jobs</Text>
            <Text style={S.bodyText}>{family.useful_jobs}</Text>
          </View>

          {/* Avoid / Watch */}
          <View style={[S.section, S.warnBox]}>
            <Text style={[S.sectionTitle, { color: "#FCA5A5" }]}>⚠️ Avoid / Watch For</Text>
            <Text style={S.warnText}>{family.avoid_watch}</Text>
          </View>

          {/* Kill Order */}
          {family.kill_order && (
            <View style={S.section}>
              <Text style={S.sectionTitle}>💀 Kill Order</Text>
              <Text style={[S.bodyText, { fontFamily: "monospace" }]}>{family.kill_order}</Text>
            </View>
          )}

          {/* Resistances */}
          {family.resistances && (
            <View style={S.section}>
              <Text style={S.sectionTitle}>🛡️ Resistances</Text>
              {family.resistances.weak && (
                <View style={S.resRow}>
                  <Text style={S.resLabel}>Weak to: </Text>
                  {family.resistances.weak.map(e => (
                    <View key={e} style={S.resBadge}><Text style={S.resGreen}>{e}</Text></View>
                  ))}
                </View>
              )}
              {family.resistances.low && (
                <View style={S.resRow}>
                  <Text style={S.resLabel}>Low resist: </Text>
                  {family.resistances.low.map(e => (
                    <View key={e} style={S.resBadgeBlue}><Text style={S.resBlue}>{e}</Text></View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Play-by-Play */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>📋 Play-by-Play</Text>
            <Text style={S.bodyText}>{family.play_by_play}</Text>
          </View>

        </View>
      )}
    </View>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Ambuscade() {
  const [cat, setCat] = useState("All");
  const visible = cat === "All" ? FAMILIES : FAMILIES.filter(f => f.category === cat);

  return (
    <ScrollView style={S.container} contentContainerStyle={S.content}>
      <Text style={S.title}>Ambuscade Families</Text>

      <View style={S.disclaimer}>
        <Text style={S.disclaimerText}>
          Ambuscade families rotate monthly — check BG-Wiki for the current month's family.
        </Text>
      </View>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.filterRow} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
        {CATEGORIES.map(c => {
          const active = cat === c;
          const col = CAT_COLOR[c];
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCat(c)}
              style={[S.filterBtn, active && { backgroundColor: col?.bg ?? "#1E3A5F", borderColor: col?.border ?? "#60A5FA" }]}
            >
              <Text style={[S.filterText, active && { color: col?.text ?? "#BAE6FD" }]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={S.countText}>{visible.length} familie{visible.length !== 1 ? "s" : ""}</Text>

      {visible.map(f => <FamilyCard key={f.id} family={f} />)}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#1A202C" },
  content:        { padding: 14, paddingBottom: 60 },
  title:          { fontSize: 26, fontWeight: "800", color: "#FFF", marginBottom: 10 },

  disclaimer:     { backgroundColor: "#2D3748", borderRadius: 8, padding: 12, marginBottom: 14 },
  disclaimerText: { color: "#F0AD4E", fontSize: 13, textAlign: "center", lineHeight: 18 },

  filterRow:      { marginBottom: 8 },
  filterBtn:      { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#4A5568", backgroundColor: "#2D3748" },
  filterText:     { color: "#9CA3AF", fontSize: 13, fontWeight: "600" },
  countText:      { color: "#6B7280", fontSize: 12, marginBottom: 12 },

  // Card
  card:           { backgroundColor: "#1F2937", borderRadius: 10, borderLeftWidth: 4, marginBottom: 12, overflow: "hidden" },
  cardHeader:     { flexDirection: "row", alignItems: "center", padding: 12, gap: 12 },
  cardImg:        { width: 72, height: 72, borderRadius: 6, backgroundColor: "#111827" },
  cardHeaderInfo: { flex: 1 },
  cardName:       { fontSize: 17, fontWeight: "800", color: "#F9FAFB", marginBottom: 4 },
  catBadge:       { alignSelf: "flex-start", borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6 },
  catText:        { fontSize: 11, fontWeight: "700" },
  cardHint:       { fontSize: 11, color: "#6B7280", fontStyle: "italic" },

  // Detail
  detail:         { paddingHorizontal: 14, paddingBottom: 14 },
  section:        { backgroundColor: "#111827", borderRadius: 8, padding: 12, marginBottom: 10 },
  sectionTitle:   { fontSize: 14, fontWeight: "700", color: "#E5E7EB", marginBottom: 8 },
  bodyText:       { color: "#D1D5DB", fontSize: 13, lineHeight: 20 },

  bulletRow:      { flexDirection: "row", marginBottom: 4 },
  bullet:         { fontSize: 13, fontWeight: "700" },
  bulletText:     { flex: 1, color: "#D1D5DB", fontSize: 13, lineHeight: 18 },

  warnBox:        { backgroundColor: "#450A0A", borderWidth: 1, borderColor: "#7F1D1D" },
  warnText:       { color: "#FCA5A5", fontSize: 13, lineHeight: 20 },

  resRow:         { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  resLabel:       { color: "#9CA3AF", fontSize: 12 },
  resBadge:       { backgroundColor: "#14532D", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  resGreen:       { color: "#86EFAC", fontSize: 12, fontWeight: "600" },
  resBadgeBlue:   { backgroundColor: "#1E3A5F", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  resBlue:        { color: "#93C5FD", fontSize: 12, fontWeight: "600" },

  // Lightbox
  lightboxOverlay:{ flex: 1, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center", alignItems: "center" },
  lightboxHint:   { color: "#6B7280", fontSize: 12, marginTop: 12, fontStyle: "italic" },
});
