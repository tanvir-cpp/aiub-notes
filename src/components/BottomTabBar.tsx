import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Bell, BookOpen, ClipboardList, Shield, UserRound } from "lucide-react-native";
import { palette, spacing, radii } from "../theme/theme";
import type { RouteName } from "../types";

type Props = {
  currentRoute: RouteName;
  onNavigate: (route: RouteName) => void;
  isAdmin?: boolean;
};

export function BottomTabBar({ currentRoute, onNavigate, isAdmin }: Props) {
  const tabs = [
    { name: "Home", route: "courses" as RouteName, icon: BookOpen },
    { name: "Notice", route: "notifications" as RouteName, icon: Bell },
    { name: "Profile", route: "profile" as RouteName, icon: UserRound }
  ];

  if (isAdmin) {
    tabs.splice(2, 0, { name: "Admin", route: "admin" as RouteName, icon: Shield });
  }

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => onNavigate(tab.route)}
            activeOpacity={0.6}
          >
            <tab.icon
              size={21}
              color={isActive ? palette.accent : palette.muted}
              strokeWidth={isActive ? 2.2 : 1.7}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.line,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md + 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    fontSize: 11,
    color: palette.muted,
    fontWeight: "500",
  },
  labelActive: {
    color: palette.accent,
    fontWeight: "600",
  },
});
