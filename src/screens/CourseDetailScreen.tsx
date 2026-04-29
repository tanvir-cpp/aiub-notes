import { useCallback, useEffect, useState, useMemo } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { CloudUpload, FileText, LayoutGrid, Monitor, HelpCircle, CheckSquare, FileQuestion } from "lucide-react-native";
import { AppHeader } from "../components/AppHeader";
import { NoteRow } from "../components/NoteRow";
import { supabase } from "../lib/supabase";
import { createSignedMaterialUrl, shareOrDownloadFile } from "../lib/files";
import { palette, spacing, radii } from "../theme/theme";
import type { Course, Note, MaterialKind } from "../types";

type Props = {
  course: Course;
  onBack: () => void;
  onSubmit: () => void;
  onPreview: (note: Note) => void;
};

export function CourseDetailScreen({ course, onBack, onSubmit, onPreview }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<MaterialKind | "all">("all");

  const loadNotes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("course_id", course.id)
      .eq("approval_status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Could not load notes", error.message);
    } else {
      setNotes((data ?? []) as Note[]);
    }
    
    setLoading(false);
    setRefreshing(false);
  }, [course.id]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const counts = useMemo(() => {
    const res: Record<string, number> = {
      all: notes.length,
      note: 0,
      slide: 0,
      solution: 0,
      question: 0,
      other: 0,
    };
    notes.forEach((n) => {
      const kind = n.material_kind as string;
      if (kind in res) {
        res[kind] = (res[kind] ?? 0) + 1;
      } else {
        res.other = (res.other ?? 0) + 1;
      }
    });
    return res;
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (filter === "all") return notes;
    return notes.filter(note => note.material_kind === filter);
  }, [notes, filter]);

  async function shareNote(note: Note) {
    try {
      const signedUrl = await createSignedMaterialUrl(note.file_url);
      await shareOrDownloadFile(signedUrl, `${note.title}.${note.file_type}`);
    } catch (error) {
      Alert.alert("Share failed", error instanceof Error ? error.message : "Could not prepare the file.");
    }
  }

  const filters = [
    { label: "All", value: "all" as const, icon: LayoutGrid },
    { label: "Notes", value: "note" as const, icon: FileText },
    { label: "Slides", value: "slide" as const, icon: Monitor },
    { label: "Solutions", value: "solution" as const, icon: CheckSquare },
    { label: "Questions", value: "question" as const, icon: HelpCircle },
    { label: "Other", value: "other" as const, icon: FileQuestion }
  ];

  return (
    <View style={styles.wrap}>
      <AppHeader title={course.code} subtitle={course.title} onBack={onBack} />

      {/* Course metadata panel */}
      <View style={styles.infoBar}>
        <View style={styles.infoChips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {course.semester ? `Semester ${course.semester}` : course.major || "General"}
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{course.credit} Credits</Text>
          </View>
          {course.prerequisite ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>Pre-req: {course.prerequisite}</Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} activeOpacity={0.7}>
          <CloudUpload size={16} color="#FFFFFF" />
          <Text style={styles.submitText}>Contribute</Text>
        </TouchableOpacity>
      </View>

      {/* Modern Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((f) => {
            const active = filter === f.value;
            const Icon = f.icon;
            const count = counts[f.value] || 0;

            return (
              <TouchableOpacity
                key={f.value}
                style={[
                  styles.filterPill, 
                  active && styles.filterActive,
                  count === 0 && !active && styles.filterDisabled
                ]}
                onPress={() => setFilter(f.value)}
                activeOpacity={0.7}
              >
                <Icon 
                  size={14} 
                  color={active ? "#FFFFFF" : count === 0 ? palette.faint : palette.muted} 
                />
                <Text style={[
                  styles.filterLabel, 
                  active && styles.filterLabelActive,
                  count === 0 && !active && styles.filterLabelDisabled
                ]}>
                  {f.label}
                </Text>
                <View style={[
                  styles.countBadge, 
                  active ? styles.countBadgeActive : count === 0 ? styles.countBadgeDisabled : styles.countBadgeInactive
                ]}>
                  <Text style={[
                    styles.countText, 
                    active ? styles.countTextActive : count === 0 ? styles.countTextDisabled : styles.countTextInactive
                  ]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={palette.accent} size="large" />
          <Text style={styles.loaderText}>Fetching materials...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <NoteRow item={item} onPreview={() => onPreview(item)} onShare={() => void shareNote(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrap}>
                <FileText size={40} color={palette.muted} />
              </View>
              <Text style={styles.emptyTitle}>No files found</Text>
              <Text style={styles.emptyDesc}>
                There aren't any {filter !== "all" ? `${filter}s` : "materials"} available yet.
              </Text>
              <TouchableOpacity style={styles.emptySubmitBtn} onPress={onSubmit}>
                <Text style={styles.emptySubmitText}>Be the first to upload</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadNotes(true)} tintColor={palette.accent} />
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
  infoBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  infoChips: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.line,
  },
  chipText: {
    color: palette.secondary,
    fontSize: 12,
    fontWeight: "600",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.md,
    backgroundColor: palette.accent,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  filterContainer: {
    backgroundColor: palette.canvas,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
  },
  filterActive: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  filterDisabled: {
    backgroundColor: palette.canvas,
    borderColor: palette.line,
  },
  filterLabel: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "600",
  },
  filterLabelActive: {
    color: "#FFFFFF",
  },
  filterLabelDisabled: {
    color: palette.muted,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  countBadgeInactive: {
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.line,
  },
  countBadgeDisabled: {
    backgroundColor: "transparent",
  },
  countText: {
    fontSize: 10,
    fontWeight: "700",
  },
  countTextActive: {
    color: "#FFFFFF",
  },
  countTextInactive: {
    color: palette.secondary,
  },
  countTextDisabled: {
    color: palette.faint,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loaderText: {
    color: palette.muted,
    fontSize: 13,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sep: {
    height: spacing.sm,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.md,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.ink,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: palette.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  emptySubmitBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.accent,
    borderRadius: radii.md,
  },
  emptySubmitText: {
    color: palette.accent,
    fontSize: 14,
    fontWeight: "600",
  },
});
