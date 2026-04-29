import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Download, Eye, FileText, Share2 } from "lucide-react-native";
import { palette, spacing, radii } from "../theme/theme";
import type { Note, StudentSubmission } from "../types";
import { StatusBadge } from "./StatusBadge";

type Props = {
  item: Note | StudentSubmission;
  onPreview?: () => void;
  onShare?: () => void;
};

export function NoteRow({ item, onPreview, onShare }: Props) {
  const formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <View style={styles.topLine}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <StatusBadge status={item.approval_status} />
        </View>
        <View style={styles.metaLine}>
          <Text style={styles.meta}>{item.material_kind}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.meta}>{item.file_type.toUpperCase()}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.meta}>{formattedDate}</Text>
        </View>
        {item.description ? (
          <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        {onPreview ? (
          <TouchableOpacity accessibilityLabel="Preview" onPress={onPreview} style={styles.actionBtn}>
            <Eye size={17} color={palette.secondary} />
          </TouchableOpacity>
        ) : null}
        {onShare ? (
          <TouchableOpacity accessibilityLabel="Share" onPress={onShare} style={styles.actionBtn}>
            {onPreview ? (
              <Share2 size={16} color={palette.secondary} />
            ) : (
              <Download size={16} color={palette.secondary} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.line,
  },
  content: {
    flex: 1,
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    color: palette.ink,
    fontSize: 15,
    fontWeight: "600",
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 5,
  },
  meta: {
    color: palette.muted,
    fontSize: 12,
    textTransform: "capitalize",
  },
  metaDot: {
    color: palette.faint,
    fontSize: 12,
  },
  desc: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 4,
    marginLeft: spacing.sm,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
});
