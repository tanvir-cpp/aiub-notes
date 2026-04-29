import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { NoteRow } from "../components/NoteRow";
import { courses } from "../data/courses";
import { createSignedMaterialUrl, shareOrDownloadFile } from "../lib/files";
import { supabase } from "../lib/supabase";
import { palette, spacing } from "../theme/theme";
import type { StudentSubmission } from "../types";

type Props = {
  userId: string;
  onBack: () => void;
  onPreview: (submission: StudentSubmission) => void;
};

export function SubmissionStatusScreen({ userId, onBack, onPreview }: Props) {
  const [items, setItems] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("student_submissions")
      .select("*")
      .eq("student_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      Alert.alert("Could not load submissions", error.message);
    } else {
      setItems(
        ((data ?? []) as StudentSubmission[]).map((item) => ({
          ...item,
          course: courses.find((course) => course.id === item.course_id)
        }))
      );
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function share(item: StudentSubmission) {
    const signedUrl = await createSignedMaterialUrl(item.file_url);
    await shareOrDownloadFile(signedUrl, `${item.title}.${item.file_type}`);
  }

  return (
    <View style={styles.wrap}>
      <AppHeader title="My Submissions" subtitle="Track your uploads" onBack={onBack} />
      {loading ? (
        <ActivityIndicator color={palette.accent} style={{ marginTop: spacing.xxl }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View style={styles.itemWrap}>
              <Text style={styles.courseLabel}>{item.course?.code ?? item.course_id}</Text>
              <NoteRow item={item} onPreview={() => onPreview(item)} onShare={() => void share(item)} />
              {item.review_note ? (
                <Text style={styles.review}>Admin: {item.review_note}</Text>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No submissions yet.</Text>
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
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sep: {
    height: spacing.md,
  },
  itemWrap: {
    gap: spacing.xs,
  },
  courseLabel: {
    color: palette.accent,
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.3,
    marginLeft: spacing.xs,
  },
  review: {
    color: palette.muted,
    fontSize: 13,
    paddingHorizontal: spacing.sm,
    fontStyle: "italic",
  },
  empty: {
    color: palette.muted,
    textAlign: "center",
    padding: spacing.xl,
    fontSize: 14,
  },
});
