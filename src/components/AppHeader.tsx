import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeft, Shield, Trophy, UserRound } from "lucide-react-native";
import { palette, spacing } from "../theme/theme";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  isAdmin?: boolean;
};

export function AppHeader({ title, subtitle, onBack, onOpenProfile, onOpenLeaderboard, isAdmin }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity accessibilityLabel="Go back" onPress={onBack} style={styles.backBtn}>
            <ArrowLeft size={20} color={palette.ink} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.rightActions}>
          {onOpenLeaderboard ? (
            <TouchableOpacity onPress={onOpenLeaderboard} style={styles.actionBtn}>
              <Trophy size={22} color={palette.accent} />
            </TouchableOpacity>
          ) : null}
          {onOpenProfile ? (
            <TouchableOpacity onPress={onOpenProfile} style={styles.profileBtn}>
              {isAdmin ? (
                <View style={styles.adminPill}>
                  <Shield size={13} color={palette.accent} />
                  <Text style={styles.adminText}>Admin</Text>
                </View>
              ) : (
                <UserRound size={22} color={palette.secondary} />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm + 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: palette.canvas,
  },
  titleBlock: {
    flex: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  actionBtn: {
    padding: spacing.xs,
  },
  profileBtn: {
    padding: spacing.xs,
  },
  adminPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: palette.accentLight,
  },
  adminText: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 1,
  },
});
