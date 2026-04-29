import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bell, CheckCheck, ChevronDown, ChevronUp, Trash2 } from "lucide-react-native";
import { AppHeader } from "../components/AppHeader";
import { supabase } from "../lib/supabase";
import { palette, spacing, radii } from "../theme/theme";
import type { Notification } from "../types";

export function NotificationsScreen() {
  const [items, setItems] = useState<Notification[]>([]);
  const [clearedIds, setClearedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setItems(data as Notification[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadCleared() {
      try {
        const stored = await AsyncStorage.getItem("cleared_notifs");
        if (stored) setClearedIds(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    void loadCleared();
    void load();
  }, []);

  async function clearOne(id: string) {
    const updated = [...clearedIds, id];
    setClearedIds(updated);
    await AsyncStorage.setItem("cleared_notifs", JSON.stringify(updated));
  }

  async function clearAll() {
    const allIds = items.map((i) => i.id);
    const updated = Array.from(new Set([...clearedIds, ...allIds]));
    setClearedIds(updated);
    await AsyncStorage.setItem("cleared_notifs", JSON.stringify(updated));
  }

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  const renderItem = ({ item }: { item: Notification }) => {
    const isExpanded = expandedId === item.id;
    const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    return (
      <TouchableOpacity 
        style={[styles.card, isExpanded && styles.cardExpanded]} 
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.headerRow}>
          <View style={[styles.iconWrap, isExpanded && styles.iconWrapActive]}>
            <Bell size={18} color={isExpanded ? palette.accent : palette.muted} />
          </View>
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={isExpanded ? undefined : 1}>
              {item.title}
            </Text>
            <Text style={styles.date}>{dateStr}</Text>
          </View>
          <TouchableOpacity 
            style={styles.trashBtn} 
            onPress={(e) => {
              e.stopPropagation();
              void clearOne(item.id);
            }}
          >
            <Trash2 size={16} color={palette.red} />
          </TouchableOpacity>
          <View style={styles.chevronWrap}>
            {isExpanded ? (
              <ChevronUp size={18} color={palette.muted} />
            ) : (
              <ChevronDown size={18} color={palette.muted} />
            )}
          </View>
        </View>

        {isExpanded && (
          <View style={styles.bodyWrap}>
            <Text style={styles.bodyText}>{item.body}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const visibleItems = items.filter((item) => !clearedIds.includes(item.id));

  return (
    <View style={styles.wrap}>
      <AppHeader title="Notice Board" subtitle="Stay updated with the latest news" />
      
      {visibleItems.length > 0 && (
        <TouchableOpacity style={styles.clearAllBar} onPress={() => void clearAll()}>
          <CheckCheck size={16} color={palette.accent} style={{ marginRight: 6 }} />
          <Text style={styles.clearAllText}>Clear all notifications</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.accent} />
        </View>
      ) : (
        <FlatList
          data={visibleItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Bell size={40} color={palette.line} />
              <Text style={styles.emptyText}>No active notices.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
  },
  cardExpanded: {
    borderColor: palette.accent,
    shadowColor: palette.ink,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: palette.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapActive: {
    backgroundColor: palette.accentLight,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.ink,
  },
  date: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  chevronWrap: {
    paddingLeft: spacing.xs,
  },
  bodyWrap: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  bodyText: {
    fontSize: 14,
    color: palette.secondary,
    lineHeight: 20,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: palette.muted,
  },
  clearAllBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    backgroundColor: palette.accentLight,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radii.md,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.accent,
  },
  trashBtn: {
    padding: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: palette.surfaceAlt,
  }
});
