import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Button, Input } from "@rneui/themed";
import * as DocumentPicker from "expo-document-picker";
import { Bell, Check, FileUp, Save, Search, Trash2, X } from "lucide-react-native";
import { confirmAction } from "../lib/confirm";
import { AppHeader } from "../components/AppHeader";
import { CourseCard } from "../components/CourseCard";
import { NoteRow } from "../components/NoteRow";
import { SegmentedControl } from "../components/SegmentedControl";
import { courses as localCourses } from "../data/courses";
import { cleanFileName, extensionFromName, fileToArrayBuffer, isSupportedFile, MATERIAL_BUCKET } from "../lib/files";
import { supabase } from "../lib/supabase";
import { palette, spacing, radii } from "../theme/theme";
import type { Course, FileAsset, MaterialKind, StudentSubmission } from "../types";

function showAlert(title: string, message?: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}${message ? `\n\n${message}` : ""}`);
  } else {
    Alert.alert(title, message);
  }
}

type Tab = "review" | "upload" | "courses" | "notifications" | "users";

type Props = {
  userId: string;
  onBack: () => void;
  onPreview: (submission: StudentSubmission) => void;
};

export function AdminDashboardScreen({ userId, onBack, onPreview }: Props) {
  const [tab, setTab] = useState<Tab>("review");

  return (
    <View style={styles.wrap}>
      <AppHeader title="Admin" subtitle="Manage courses and materials" onBack={onBack} isAdmin />
      <View style={styles.tabs}>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { label: "Review", value: "review" },
            { label: "Upload", value: "upload" },
            { label: "Courses", value: "courses" },
            { label: "Broadcast", value: "notifications" },
            { label: "Users", value: "users" }
          ]}
        />
      </View>
      {tab === "review" ? (
        <ReviewPanel userId={userId} onPreview={onPreview} />
      ) : tab === "upload" ? (
        <UploadPanel userId={userId} />
      ) : tab === "courses" ? (
        <CoursePanel />
      ) : tab === "notifications" ? (
        <NotificationsPanel />
      ) : (
        <UsersPanel />
      )}
    </View>
  );
}

function ReviewPanel({ userId, onPreview }: { userId: string; onPreview: (submission: StudentSubmission) => void }) {
  const [items, setItems] = useState<StudentSubmission[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("student_submissions")
      .select("*")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: true });
    if (error) {
      showAlert("Could not load submissions", error.message);
    } else {
      setItems((data ?? []) as StudentSubmission[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function approve(item: StudentSubmission) {
    const course = localCourses.find((candidate) => candidate.id === item.course_id);
    if (!course) {
      showAlert("Course missing", "This submission references an unknown course.");
      return;
    }

    try {
      const approvedPath = `approved/${course.code}/${Date.now()}-${cleanFileName(item.title)}.${item.file_type}`;
      const { error: copyError } = await supabase.storage.from(MATERIAL_BUCKET).copy(item.file_url, approvedPath);
      if (copyError) throw copyError;

      const { error: noteError } = await supabase.from("notes").insert({
        course_id: item.course_id,
        title: item.title,
        description: item.description,
        file_url: approvedPath,
        file_type: item.file_type,
        material_kind: item.material_kind,
        uploaded_by: item.student_id,
        approval_status: "approved"
      });
      if (noteError) throw noteError;

      const { error: updateError } = await supabase
        .from("student_submissions")
        .update({
          approval_status: "approved",
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
          review_note: notes[item.id] || null
        })
        .eq("id", item.id);
      if (updateError) throw updateError;
      await load();
    } catch (error) {
      showAlert("Approval failed", error instanceof Error ? error.message : "Please try again.");
    }
  }

  async function reject(item: StudentSubmission) {
    const { error } = await supabase
      .from("student_submissions")
      .update({
        approval_status: "rejected",
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_note: notes[item.id] || "Rejected by admin."
      })
      .eq("id", item.id);

    if (error) {
      showAlert("Reject failed", error.message);
    } else {
      await load();
    }
  }

  if (loading) return <ActivityIndicator color={palette.accent} style={{ marginTop: spacing.xl }} />;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.panelList}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      renderItem={({ item }) => (
        <View style={styles.reviewCard}>
          <Text style={styles.courseLabel}>
            {localCourses.find((course) => course.id === item.course_id)?.code ?? item.course_id}
          </Text>
          <NoteRow item={item} onPreview={() => onPreview(item)} />
          <Input
            label="Review note"
            value={notes[item.id] ?? ""}
            onChangeText={(value) => setNotes((current) => ({ ...current, [item.id]: value }))}
            placeholder="Optional message for the student"
          />
          <View style={styles.actionRow}>
            <Button
              title=" Approve"
              icon={<Check size={16} color="white" />}
              buttonStyle={styles.approveBtn}
              onPress={() => void approve(item)}
            />
            <Button
              title=" Reject"
              icon={<X size={16} color="white" />}
              buttonStyle={styles.rejectBtn}
              onPress={() => void reject(item)}
            />
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No pending submissions.</Text>}
    />
  );
}

function UploadPanel({ userId }: { userId: string }) {
  const [query, setQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(localCourses[0] ?? null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<MaterialKind>("note");
  const [file, setFile] = useState<FileAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return localCourses
      .filter((course) => `${course.code} ${course.title} ${course.major ?? ""}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query]);

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/*"]
    });
    if (result.canceled || !result.assets[0]) return;
    if (!isSupportedFile(result.assets[0].name)) {
      showAlert("Unsupported file", "Upload PDF, PPT/PPTX, DOC/DOCX, or images.");
      return;
    }
    setFile(result.assets[0]);
  }

  async function upload() {
    if (!selectedCourse || !title.trim() || !file) {
      showAlert("Missing details", "Select a course, title, and file.");
      return;
    }

    setLoading(true);
    try {
      const fileType = extensionFromName(file.name);
      const path = `approved/${selectedCourse.code}/${Date.now()}-${cleanFileName(file.name)}`;
      const body = await fileToArrayBuffer(file);
      const { error: uploadError } = await supabase.storage.from(MATERIAL_BUCKET).upload(path, body, {
        contentType: file.mimeType ?? "application/octet-stream"
      });
      if (uploadError) throw uploadError;

      const { error } = await supabase.from("notes").insert({
        course_id: selectedCourse.id,
        title: title.trim(),
        description: description.trim() || null,
        file_url: path,
        file_type: fileType,
        material_kind: kind,
        uploaded_by: userId,
        approval_status: "approved"
      });
      if (error) throw error;
      setTitle("");
      setDescription("");
      setFile(null);
      showAlert("Uploaded", "The material is visible to students.");
    } catch (error) {
      showAlert("Upload failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.adminForm} showsVerticalScrollIndicator={false}>
      {/* Course Selector */}
      <Text style={styles.formLabel}>Select Course</Text>
      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Search courses..."
        leftIcon={<Search size={18} color={palette.muted} />}
        inputContainerStyle={styles.searchInput}
      />
      <View style={styles.courseChipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {filteredCourses.map((course) => {
            const isSelected = selectedCourse?.id === course.id;
            return (
              <TouchableOpacity
                key={course.id}
                style={[styles.courseChip, isSelected && styles.courseChipSelected]}
                onPress={() => setSelectedCourse(course)}
                activeOpacity={0.7}
              >
                <Text style={[styles.courseChipCode, isSelected && styles.courseChipCodeSelected]}>{course.code}</Text>
                <Text style={[styles.courseChipTitle, isSelected && styles.courseChipTitleSelected]} numberOfLines={1}>
                  {course.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Metadata Inputs */}
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>Material Title</Text>
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Lecture 01, Mid-Term Solution"
          inputContainerStyle={styles.searchInput}
        />

        <Text style={styles.formLabel}>Description (Optional)</Text>
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="Add extra context for students..."
          inputContainerStyle={styles.searchInput}
        />

        <Text style={styles.formLabel}>Material Category</Text>
        <View style={styles.segmentedWrap}>
          <SegmentedControl
            value={kind}
            onChange={setKind}
            options={[
              { label: "Note", value: "note" },
              { label: "Solution", value: "solution" },
              { label: "Slide", value: "slide" },
              { label: "Other", value: "other" }
            ]}
          />
        </View>
      </View>

      {/* File Dropzone Style Selection Area */}
      <Text style={styles.formLabel}>Upload File</Text>
      <TouchableOpacity 
        style={[styles.uploadDropzone, file && styles.uploadDropzoneActive]} 
        onPress={pickFile}
        activeOpacity={0.8}
      >
        <View style={[styles.dropzoneIconWrap, file && styles.dropzoneIconWrapActive]}>
          <FileUp size={24} color={file ? palette.accent : palette.muted} />
        </View>
        <View style={styles.dropzoneTextWrap}>
          <Text style={styles.dropzoneTitle}>
            {file ? file.name : "Choose a file to upload"}
          </Text>
          <Text style={styles.dropzoneSub}>
            {file && file.size
              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Tap to replace` 
              : "Supports PDF, PPT, DOC & Images"}
          </Text>
        </View>
      </TouchableOpacity>

      <Button
        loading={loading}
        disabled={loading}
        title="Publish Material"
        icon={<FileUp size={18} color="white" style={{ marginRight: 8 }} />}
        onPress={upload}
        buttonStyle={styles.publishBtn}
        titleStyle={styles.publishBtnText}
      />
    </ScrollView>
  );
}

function CoursePanel() {
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState<Course>(() => localCourses[0]!);
  const [title, setTitle] = useState(selected.title);
  const [credit, setCredit] = useState(selected.credit);
  const [prerequisite, setPrerequisite] = useState(selected.prerequisite ?? "");

  useEffect(() => {
    setTitle(selected.title);
    setCredit(selected.credit);
    setPrerequisite(selected.prerequisite ?? "");
  }, [selected]);

  async function save() {
    const { error } = await supabase.from("courses").upsert({
      ...selected,
      title: title.trim(),
      credit: credit.trim(),
      prerequisite: prerequisite.trim() || null
    });
    showAlert(error ? "Save failed" : "Saved", error?.message ?? "Course metadata updated in Supabase.");
  }

  async function deleteCourse() {
    confirmAction("Delete course", `Are you sure you want to delete ${selected.code}?`, async () => {
      const { error } = await supabase.from("courses").delete().eq("id", selected.id);
      if (error) {
        showAlert("Delete failed", error.message);
      } else {
        showAlert("Deleted", "Course deleted from database. Please update courselist.txt and run 'npm run generate:courses' to remove it from the UI.");
      }
    });
  }

  return (
    <View style={[styles.courseAdmin, width < 760 && styles.courseAdminStacked]}>
      <FlatList
        data={localCourses}
        keyExtractor={(item) => item.id}
        style={styles.courseColumn}
        contentContainerStyle={styles.courseColumnContent}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => <CourseCard course={item} onPress={() => setSelected(item)} />}
      />
      <ScrollView contentContainerStyle={[styles.editColumn, width < 760 && styles.editColumnMobile]}>
        <Text style={styles.editTitle}>{selected.code}</Text>
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Input label="Credit" value={credit} onChangeText={setCredit} />
        <Input label="Prerequisite" value={prerequisite} onChangeText={setPrerequisite} />
        <Button title="Save metadata" icon={<Save size={17} color="white" style={{ marginRight: 6 }} />} onPress={() => void save()} buttonStyle={{ backgroundColor: palette.accent }} />
        <Button
          title="Delete course"
          type="outline"
          icon={<Trash2 size={17} color={palette.red} style={{ marginRight: 6 }} />}
          titleStyle={{ color: palette.red }}
          buttonStyle={{ borderColor: palette.red, marginTop: spacing.sm }}
          onPress={() => void deleteCourse()}
        />
        <Text style={styles.hint}>Add or remove courses by editing `courselist.txt`, then run `npm run generate:courses` and apply the generated SQL seed.</Text>
      </ScrollView>
    </View>
  );
}

function NotificationsPanel() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendNotification() {
    if (!title.trim() || !message.trim()) {
      showAlert("Error", "Title and message are required.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("push", {
        body: { title: title.trim(), message: message.trim() }
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      setTitle("");
      setMessage("");
      showAlert(
        "Success",
        data && data.count > 0
          ? `Broadcast sent to ${data.count} device${data.count > 1 ? "s" : ""} & saved in history.`
          : "Notification saved to history board (no push devices registered yet)."
      );
    } catch (err) {
      showAlert("Broadcast failed", err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.adminForm}>
      <Text style={styles.formLabel}>Notification Title</Text>
      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. New Materials Uploaded"
        inputContainerStyle={styles.searchInput}
      />

      <Text style={styles.formLabel}>Message Body</Text>
      <Input
        value={message}
        onChangeText={setMessage}
        placeholder="e.g. Find new slides in PHY1101 Physics 1"
        multiline
        numberOfLines={3}
        inputContainerStyle={[styles.searchInput, { paddingVertical: spacing.sm }]}
      />

      <Button
        loading={loading}
        disabled={loading}
        title="Broadcast Notification"
        icon={<Bell size={18} color="white" style={{ marginRight: 8 }} />}
        onPress={() => void sendNotification()}
        buttonStyle={styles.publishBtn}
        titleStyle={styles.publishBtnText}
      />
    </ScrollView>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const renderUser = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>Role: {item.role}</Text>
        {item.push_token && <Text style={styles.userToken}>Push Token Active</Text>}
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} color={palette.accent} />;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={renderUser}
      contentContainerStyle={{ padding: spacing.md }}
      ListEmptyComponent={<Text style={{ textAlign: "center", color: palette.muted, marginTop: 20 }}>No users found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  userCard: {
    backgroundColor: palette.surface,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: spacing.sm,
  },
  userInfo: {
    gap: 4,
  },
  userEmail: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.ink,
  },
  userRole: {
    fontSize: 13,
    color: palette.secondary,
  },
  userToken: {
    fontSize: 11,
    color: palette.green,
    fontWeight: "600",
    marginTop: 2,
  },
  tabs: {
    padding: spacing.md,
  },
  panelList: {
    padding: spacing.md,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  sep: {
    height: spacing.sm,
  },
  reviewCard: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.surface,
  },
  courseLabel: {
    color: palette.accent,
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  approveBtn: {
    backgroundColor: palette.green,
    borderRadius: radii.sm,
  },
  rejectBtn: {
    backgroundColor: palette.red,
    borderRadius: radii.sm,
  },
  empty: {
    color: palette.muted,
    textAlign: "center",
    padding: spacing.xl,
    fontSize: 14,
  },
  adminForm: {
    padding: spacing.md,
    gap: spacing.sm,
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
    paddingBottom: spacing.xxl,
  },
  coursePicker: {
    gap: spacing.sm,
  },
  selectedCourse: {
    borderRadius: radii.lg + 2,
    borderWidth: 2,
    borderColor: palette.accent,
  },
  formLabel: {
    color: palette.secondary,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  searchInput: {
    borderColor: palette.line,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    backgroundColor: palette.surface,
  },
  courseChipRow: {
    marginBottom: spacing.md,
  },
  chipScroll: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  courseChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  courseChipSelected: {
    backgroundColor: palette.accentLight,
    borderColor: palette.accent,
  },
  courseChipCode: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.ink,
  },
  courseChipCodeSelected: {
    color: palette.accent,
  },
  courseChipTitle: {
    fontSize: 11,
    color: palette.muted,
    marginTop: 2,
    maxWidth: 120,
  },
  courseChipTitleSelected: {
    color: palette.accent,
    fontWeight: "500",
  },
  formSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  segmentedWrap: {
    marginBottom: spacing.sm,
  },
  uploadDropzone: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: palette.line,
    backgroundColor: palette.surface,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  uploadDropzoneActive: {
    borderColor: palette.accent,
    backgroundColor: palette.accentLight,
  },
  dropzoneIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: palette.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneIconWrapActive: {
    backgroundColor: palette.surface,
  },
  dropzoneTextWrap: {
    flex: 1,
  },
  dropzoneTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: palette.ink,
  },
  dropzoneSub: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  publishBtn: {
    backgroundColor: palette.accent,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
  },
  publishBtnText: {
    fontWeight: "700",
    fontSize: 15,
  },
  courseAdmin: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
  },
  courseAdminStacked: {
    flexDirection: "column",
  },
  courseColumn: {
    flex: 1,
  },
  courseColumnContent: {
    paddingBottom: spacing.xl,
  },
  editColumn: {
    flexGrow: 1,
    width: 360,
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.surface,
  },
  editColumnMobile: {
    width: "100%",
  },
  editTitle: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  hint: {
    color: palette.muted,
    lineHeight: 20,
    fontSize: 13,
  },
});
