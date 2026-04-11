/**
 * ActiveUsers widget
 *
 * Shows live anonymous analytics pulled from Netlify Functions + Blobs.
 * Drop this anywhere in your app. Works on web only — returns null on native.
 *
 * Usage:
 *   import { ActiveUsers } from '@/components/ActiveUsers';
 *   <ActiveUsers />
 *
 * To hide the widget but still send heartbeats, use useAnalytics() directly.
 */

import { Platform, StyleSheet, Text, View } from 'react-native';
import { useAnalytics } from '@/hooks/useAnalytics';

interface Props {
  /** Show the top-pages list (default: false) */
  showTopPages?: boolean;
  /** Compact single-line mode (default: false) */
  compact?: boolean;
}

export function ActiveUsers({ showTopPages = false, compact = false }: Props) {
  // Web only — Netlify Functions aren't reachable in native builds
  if (Platform.OS !== 'web') return null;

  return <ActiveUsersInner showTopPages={showTopPages} compact={compact} />;
}

function ActiveUsersInner({ showTopPages, compact }: Required<Props>) {
  const { stats } = useAnalytics({ showStats: true });

  if (!stats) {
    // Still sends heartbeats while loading; don't render placeholder
    return null;
  }

  if (compact) {
    return (
      <View style={styles.compact}>
        <Dot active />
        <Text style={styles.compactText}>
          {stats.activeNow} active · {stats.visitsToday} today
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Live Stats</Text>
      <View style={styles.row}>
        <StatBox label="Active now" value={stats.activeNow} accent="#4ade80" dot />
        <StatBox label="Visits today" value={stats.visitsToday} accent="#60a5fa" />
      </View>

      {showTopPages && stats.topPages.length > 0 && (
        <View style={styles.pages}>
          <Text style={styles.pagesHeading}>Top pages (last 10 min)</Text>
          {stats.topPages.map((p) => (
            <View key={p.page} style={styles.pageRow}>
              <Text style={styles.pageName} numberOfLines={1}>
                {p.page}
              </Text>
              <Text style={styles.pageCount}>{p.count}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBox({
  label,
  value,
  accent,
  dot = false,
}: {
  label: string;
  value: number;
  accent: string;
  dot?: boolean;
}) {
  return (
    <View style={styles.statBox}>
      <View style={styles.statTop}>
        {dot && <Dot active />}
        <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  return (
    <View
      style={[
        styles.dot,
        { backgroundColor: active ? '#4ade80' : '#6b7280' },
      ]}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  heading: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pages: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
  },
  pagesHeading: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  pageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageName: {
    color: '#d1d5db',
    fontSize: 13,
    flex: 1,
  },
  pageCount: {
    color: '#6b7280',
    fontSize: 13,
    marginLeft: 8,
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactText: {
    color: '#9ca3af',
    fontSize: 12,
  },
});
