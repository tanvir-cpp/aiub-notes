import { useMemo, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Search } from "lucide-react-native";
import { courses } from "../data/courses";
import { AppHeader } from "../components/AppHeader";
import { CourseCard } from "../components/CourseCard";
import { SegmentedControl } from "../components/SegmentedControl";
import { palette, spacing, radii } from "../theme/theme";
import type { Course } from "../types";

type Props = {
  isAdmin: boolean;
  onOpenCourse: (course: Course) => void;
  onOpenLeaderboard: () => void;
};

type Filter = "all" | "core" | "major";

export function CourseListScreen({ isAdmin, onOpenCourse, onOpenLeaderboard }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("pinned_courses").then((data) => {
      if (data) {
        try {
          setPinnedIds(JSON.parse(data));
        } catch {}
      }
    });
  }, []);

  async function togglePin(id: string) {
    setPinnedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id];
      AsyncStorage.setItem("pinned_courses", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }

  const visibleCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = courses.filter((course) => {
      const matchesFilter = filter === "all" || course.category === filter;
      const haystack = `${course.code} ${course.title} ${course.major ?? ""} ${course.semester ?? ""}`.toLowerCase();
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });

    return filtered.sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [filter, query, pinnedIds]);

  return (
    <View style={styles.wrap}>
      <AppHeader
        title="Courses"
        subtitle={`${courses.length} CSE courses`}
        onOpenLeaderboard={onOpenLeaderboard}
      />
      <View style={styles.toolbar}>
        <View style={styles.searchRow}>
          <Search size={17} color={palette.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search courses..."
            placeholderTextColor={palette.faint}
            style={styles.searchInput}
          />
        </View>
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          options={[
            { label: "All", value: "all" },
            { label: "Core", value: "core" },
            { label: "Major", value: "major" }
          ]}
        />
      </View>
      <FlatList
        data={visibleCourses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => onOpenCourse(item)}
            isPinned={pinnedIds.includes(item.id)}
            onTogglePin={() => togglePin(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No courses match your search.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  toolbar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: palette.ink,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sep: {
    height: spacing.sm,
  },
  empty: {
    color: palette.muted,
    textAlign: "center",
    padding: spacing.xl,
    fontSize: 14,
  },
});
