import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  filterByJobAndSlot, compareItems, scoreItem, generateExplanation,
  type GearItem, type GearSlot, type JobCode, type CompareMode, type StatDiff,
} from '../../data/gear';

// ─── Constants ────────────────────────────────────────────────────────────────

const JOBS: JobCode[] = [
  'WAR','MNK','WHM','BLM','RDM','THF','PLD','DRK','BST','BRD',
  'RNG','SAM','NIN','DRG','SMN','BLU','COR','PUP','DNC','SCH','GEO','RUN',
];

const SLOTS: { label: string; value: GearSlot }[] = [
  { label: 'Main Hand', value: 'main' },
  { label: 'Sub / Shield', value: 'sub' },
  { label: 'Ranged', value: 'range' },
  { label: 'Head', value: 'head' },
  { label: 'Body', value: 'body' },
  { label: 'Hands', value: 'hands' },
  { label: 'Legs', value: 'legs' },
  { label: 'Feet', value: 'feet' },
  { label: 'Neck', value: 'neck' },
  { label: 'Waist', value: 'waist' },
  { label: 'Back', value: 'back' },
  { label: 'Left Ear', value: 'left_ear' },
  { label: 'Right Ear', value: 'right_ear' },
  { label: 'Left Ring', value: 'left_ring' },
  { label: 'Right Ring', value: 'right_ring' },
];

const MODES: CompareMode[] = ['TP', 'WS', 'Tank', 'Idle', 'MagicAccuracy', 'FastCast'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statLabel(stat: string): string {
  const map: Record<string, string> = {
    hp: 'HP', mp: 'MP', str: 'STR', dex: 'DEX', vit: 'VIT', agi: 'AGI',
    int: 'INT', mnd: 'MND', chr: 'CHR', accuracy: 'Accuracy', attack: 'Attack',
    rangedAccuracy: 'R.Accuracy', rangedAttack: 'R.Attack',
    magicAccuracy: 'M.Accuracy', magicAttackBonus: 'MAB',
    defense: 'DEF', evasion: 'Evasion', magicEvasion: 'M.Evasion',
    haste: 'Haste%', storeTP: 'Store TP', dualWield: 'Dual Wield',
    fastCast: 'Fast Cast%', dt: 'DT%', pdt: 'PDT%', mdt: 'MDT%',
    enmity: 'Enmity', curePotency: 'Cure Potency%',
    weaponSkillDamage: 'WSD%', tpBonus: 'TP Bonus', critRate: 'Crit Rate%',
    critDamage: 'Crit Dmg%', subtleBlow: 'Subtle Blow%',
    treasureHunter: 'TH',
  };
  return map[stat] ?? stat;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChipRow<T extends string>({
  options, selected, onSelect, labelOf,
}: {
  options: T[];
  selected: T | null;
  onSelect: (v: T) => void;
  labelOf?: (v: T) => string;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          onPress={() => onSelect(opt)}
          style={[styles.chip, selected === opt && styles.chipActive]}
        >
          <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>
            {labelOf ? labelOf(opt) : opt}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ItemCard({
  item, label, onClear,
}: { item: GearItem; label: string; onClear: () => void }) {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemCardHeader}>
        <Text style={styles.itemCardLabel}>{label}</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearBtn}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      {item.source && <Text style={styles.itemSource}>{item.source}</Text>}
      {item.weapon && (
        <Text style={styles.itemStat}>DMG {item.weapon.damage}  Delay {item.weapon.delay}</Text>
      )}
    </View>
  );
}

function DiffTable({ diffs, nameA, nameB }: { diffs: StatDiff[]; nameA: string; nameB: string }) {
  return (
    <View style={styles.diffTable}>
      <View style={styles.diffHeader}>
        <Text style={[styles.diffCell, styles.diffStatCol, styles.diffHeaderText]}>Stat</Text>
        <Text style={[styles.diffCell, styles.diffValueCol, styles.diffHeaderText]}>{nameA}</Text>
        <Text style={[styles.diffCell, styles.diffValueCol, styles.diffHeaderText]}>{nameB}</Text>
        <Text style={[styles.diffCell, styles.diffValueCol, styles.diffHeaderText]}>Δ</Text>
      </View>
      {diffs.map(d => {
        const aWins = d.delta < 0;
        const bWins = d.delta > 0;
        return (
          <View key={d.stat} style={styles.diffRow}>
            <Text style={[styles.diffCell, styles.diffStatCol, styles.diffStatText]}>
              {statLabel(d.stat)}
            </Text>
            <Text style={[styles.diffCell, styles.diffValueCol, aWins && styles.winText]}>
              {d.a !== 0 ? (d.a > 0 ? `+${d.a}` : d.a) : '—'}
            </Text>
            <Text style={[styles.diffCell, styles.diffValueCol, bWins && styles.winText]}>
              {d.b !== 0 ? (d.b > 0 ? `+${d.b}` : d.b) : '—'}
            </Text>
            <Text style={[
              styles.diffCell, styles.diffValueCol,
              bWins ? styles.winText : aWins ? styles.loseText : styles.tieText,
            ]}>
              {d.delta > 0 ? `+${d.delta}` : d.delta < 0 ? d.delta : '='}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GearChecker() {
  const [job, setJob] = useState<JobCode | null>(null);
  const [slot, setSlot] = useState<GearSlot | null>(null);
  const [mode, setMode] = useState<CompareMode>('TP');
  const [itemA, setItemA] = useState<GearItem | null>(null);
  const [itemB, setItemB] = useState<GearItem | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const candidates = job && slot ? filterByJobAndSlot(job, slot) : [];
  const diffs = itemA && itemB ? compareItems(itemA, itemB) : [];

  const pickItem = useCallback((item: GearItem) => {
    if (!itemA) { setItemA(item); return; }
    if (!itemB && item.id !== itemA.id) { setItemB(item); return; }
  }, [itemA, itemB]);

  const handleExplain = useCallback(() => {
    if (!itemA || !itemB) return;
    setExplanation(generateExplanation(itemA, itemB, mode, diffs));
  }, [itemA, itemB, mode, diffs]);

  const reset = () => {
    setItemA(null); setItemB(null);
    setExplanation(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Gear Checker</Text>

      {/* Job */}
      <Text style={styles.sectionLabel}>Job</Text>
      <ChipRow options={JOBS} selected={job} onSelect={j => { setJob(j); reset(); }} />

      {/* Slot */}
      <Text style={styles.sectionLabel}>Slot</Text>
      <ChipRow
        options={SLOTS.map(s => s.value)}
        selected={slot}
        onSelect={s => { setSlot(s); reset(); }}
        labelOf={v => SLOTS.find(x => x.value === v)?.label ?? v}
      />

      {/* Mode */}
      <Text style={styles.sectionLabel}>Compare Mode</Text>
      <ChipRow options={MODES} selected={mode} onSelect={setMode} />

      {/* Item list */}
      {candidates.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>
            Items for {job} / {SLOTS.find(s => s.value === slot)?.label}
            {' '}— tap to pick A then B
          </Text>
          {candidates
            .sort((a, b) => scoreItem(b, mode) - scoreItem(a, mode))
            .map(item => {
              const isA = itemA?.id === item.id;
              const isB = itemB?.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => pickItem(item)}
                  style={[
                    styles.listItem,
                    isA && styles.listItemA,
                    isB && styles.listItemB,
                  ]}
                  disabled={!!(itemA && itemB && !isA && !isB)}
                >
                  <View style={styles.listItemRow}>
                    <Text style={styles.listItemName}>{item.name}</Text>
                    {item.source && (
                      <Text style={styles.listItemSource}>{item.source}</Text>
                    )}
                    {(isA || isB) && (
                      <Text style={styles.listItemBadge}>{isA ? 'A' : 'B'}</Text>
                    )}
                  </View>
                  {item.weapon && (
                    <Text style={styles.listItemSub}>
                      DMG {item.weapon.damage}  Delay {item.weapon.delay}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
        </>
      )}

      {/* Compare panel */}
      {itemA && itemB && (
        <View style={styles.comparePanel}>
          <View style={styles.compareCards}>
            <ItemCard item={itemA} label="Item A" onClear={() => { setItemA(null); setExplanation(null); }} />
            <ItemCard item={itemB} label="Item B" onClear={() => { setItemB(null); setExplanation(null); }} />
          </View>

          {diffs.length > 0 && (
            <DiffTable diffs={diffs} nameA={itemA.name} nameB={itemB.name} />
          )}

          {/* Explain button */}
          <TouchableOpacity style={styles.explainBtn} onPress={handleExplain}>
            <Text style={styles.explainBtnText}>Explain: Which is better for {mode}?</Text>
          </TouchableOpacity>

          {explanation && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>Claude's Analysis</Text>
              <Text style={styles.explanationText}>{explanation}</Text>
            </View>
          )}
        </View>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const C = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  yellow: '#F6C90E',
  green: '#39D353',
  red: '#F85149',
  muted: '#8B949E',
  text: '#E6EDF3',
  aColor: '#58A6FF',
  bColor: '#BC8CFF',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: C.yellow, marginBottom: 16 },
  sectionLabel: { fontSize: 12, color: C.muted, marginTop: 14, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },

  chipScroll: { flexDirection: 'row', marginBottom: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginRight: 8, backgroundColor: C.surface },
  chipActive: { backgroundColor: C.yellow, borderColor: C.yellow },
  chipText: { color: C.muted, fontSize: 13 },
  chipTextActive: { color: '#000', fontWeight: '700' },

  listItem: { backgroundColor: C.surface, borderRadius: 8, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: C.border },
  listItemA: { borderColor: C.aColor },
  listItemB: { borderColor: C.bColor },
  listItemRow: { flexDirection: 'row', alignItems: 'center' },
  listItemName: { flex: 1, color: C.text, fontWeight: '600' },
  listItemSource: { color: C.muted, fontSize: 12 },
  listItemBadge: { fontWeight: '800', fontSize: 14, color: C.yellow, marginLeft: 8 },
  listItemSub: { color: C.muted, fontSize: 12, marginTop: 2 },

  comparePanel: { marginTop: 20 },
  compareCards: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  itemCard: { flex: 1, backgroundColor: C.surface, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: C.border },
  itemCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemCardLabel: { color: C.muted, fontSize: 11, textTransform: 'uppercase' },
  clearBtn: { color: C.red, fontWeight: '700' },
  itemName: { color: C.text, fontWeight: '700', fontSize: 13 },
  itemSource: { color: C.muted, fontSize: 11, marginTop: 2 },
  itemStat: { color: C.muted, fontSize: 11, marginTop: 4 },

  diffTable: { backgroundColor: C.surface, borderRadius: 8, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: C.border },
  diffHeader: { flexDirection: 'row', backgroundColor: '#1C2128', padding: 8 },
  diffHeaderText: { color: C.muted, fontSize: 12, fontWeight: '700' },
  diffRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: C.border },
  diffCell: { fontSize: 13 },
  diffStatCol: { flex: 2, color: C.text },
  diffValueCol: { flex: 1, textAlign: 'right', color: C.text },
  diffStatText: { color: C.muted },
  winText: { color: C.green, fontWeight: '700' },
  loseText: { color: C.red },
  tieText: { color: C.muted },

  explainBtn: { backgroundColor: C.yellow, borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  explainBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },

  explanationBox: { backgroundColor: '#1C2128', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: C.border },
  explanationLabel: { color: C.yellow, fontWeight: '700', marginBottom: 8, fontSize: 13 },
  explanationText: { color: C.text, lineHeight: 22 },
});
