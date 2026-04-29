import { StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock3, XCircle } from "lucide-react-native";
import { palette } from "../theme/theme";
import type { ApprovalStatus } from "../types";

const config: Record<ApprovalStatus, { color: string; bg: string }> = {
  pending: { color: palette.amber, bg: palette.amberBg },
  approved: { color: palette.green, bg: palette.greenBg },
  rejected: { color: palette.red, bg: palette.redBg },
};

type Props = {
  status: ApprovalStatus;
};

export function StatusBadge({ status }: Props) {
  const { color, bg } = config[status];
  const Icon = status === "approved" ? CheckCircle2 : status === "rejected" ? XCircle : Clock3;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Icon size={12} color={color} />
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
