import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BookOpen, ChevronRight, Pin } from "lucide-react-native";
import { palette, spacing, radii } from "../theme/theme";
import type { Course } from "../types";

type Props = {
  course: Course;
  onPress: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
};

export function CourseCard({ course, onPress, isPinned, onTogglePin }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.5}>
      <View style={styles.left}>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.title}>{course.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {course.semester ? `Sem ${course.semester}` : course.major}
          </Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.meta}>{course.credit} cr</Text>
          {course.prerequisite ? (
            <>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.meta}>Pre: {course.prerequisite}</Text>
            </>
          ) : null}
        </View>
      </View>

      {onTogglePin ? (
        <TouchableOpacity onPress={onTogglePin} hitSlop={8} style={styles.pinBtn}>
          <Pin
            size={18}
            color={isPinned ? palette.accent : palette.faint}
            fill={isPinned ? palette.accent : "transparent"}
          />
        </TouchableOpacity>
      ) : (
        <ChevronRight size={18} color={palette.faint} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.line,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  code: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 5,
  },
  meta: {
    color: palette.muted,
    fontSize: 12,
  },
  metaDot: {
    color: palette.faint,
    fontSize: 12,
  },
  pinBtn: {
    padding: spacing.sm,
  },
});
