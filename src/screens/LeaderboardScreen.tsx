import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { Trophy } from "lucide-react-native";
import { AppHeader } from "../components/AppHeader";
import { supabase } from "../lib/supabase";
import { palette, spacing, radii } from "../theme/theme";

type LeaderboardUser = {
  id: string;
  email: string;
  full_name: string | null;
  contributions: number;
};

type Props = {
  onBack: () => void;
};

export function LeaderboardScreen({ onBack }: Props) {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("contributions", { ascending: false });
      if (!error && data) {
        setUsers(data as LeaderboardUser[]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLeaderboard();
  }, []);

  const renderItem = ({ item, index }: { item: LeaderboardUser; index: number }) => {
    const rank = index + 1;
    const isTop3 = rank <= 3;

    return (
      <View style={[styles.card, isTop3 && styles.topCard]}>
        <View style={[styles.rankWrap, rank === 1 ? styles.rank1 : rank === 2 ? styles.rank2 : rank === 3 ? styles.rank3 : null]}>
          <Text style={[styles.rankText, isTop3 && styles.topRankText]}>{rank}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.full_name || item.email.split("@")[0]}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <View style={styles.scoreWrap}>
          <Trophy size={16} color={rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : palette.muted} style={{ marginRight: 6 }} />
          <Text style={styles.score}>{item.contributions} materials</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrap}>
      <AppHeader title="Leaderboard" subtitle="Top community contributors" onBack={onBack} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.accent} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No contributions yet. Start uploading materials!</Text>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.line,
  },
  topCard: {
    borderColor: palette.accent,
    backgroundColor: palette.surfaceAlt,
  },
  rankWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.canvas,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  rank1: { backgroundColor: "#FFD700" },
  rank2: { backgroundColor: "#C0C0C0" },
  rank3: { backgroundColor: "#CD7F32" },
  rankText: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.secondary,
  },
  topRankText: {
    color: "#000",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.ink,
  },
  email: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  scoreWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.secondary,
  },
  empty: {
    textAlign: "center",
    color: palette.muted,
    marginTop: 40,
  }
});
