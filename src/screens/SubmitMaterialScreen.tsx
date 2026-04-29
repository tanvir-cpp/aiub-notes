import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import * as DocumentPicker from "expo-document-picker";
import { FileUp, Paperclip, Check } from "lucide-react-native";
import { AppHeader } from "../components/AppHeader";
import { SegmentedControl } from "../components/SegmentedControl";
import { cleanFileName, extensionFromName, fileToArrayBuffer, isSupportedFile, MATERIAL_BUCKET } from "../lib/files";
import { supabase } from "../lib/supabase";
import { palette, spacing, radii } from "../theme/theme";
import type { Course, FileAsset, MaterialKind } from "../types";

type Props = {
  course: Course;
  userId: string;
  onBack: () => void;
  onDone: () => void;
};

export function SubmitMaterialScreen({ course, userId, onBack, onDone }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<MaterialKind>("note");
  const [file, setFile] = useState<FileAsset | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/*"
      ]
    });

    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    if (!isSupportedFile(asset.name)) {
      Alert.alert("Unsupported file", "Upload PDF, PPT/PPTX, DOC/DOCX, or image files.");
      return;
    }
    setFile({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
      size: asset.size
    });
    
    if (!title.trim()) {
      const nameWithoutExt = asset.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  }

  async function submit() {
    if (!title.trim() || !file) {
      Alert.alert("Missing details", "Add a title and select a file.");
      return;
    }

    setLoading(true);
    try {
      const fileType = extensionFromName(file.name);
      const path = `submissions/${userId}/${course.code}/${Date.now()}-${cleanFileName(file.name)}`;
      const body = await fileToArrayBuffer(file);
      const { error: uploadError } = await supabase.storage.from(MATERIAL_BUCKET).upload(path, body, {
        contentType: file.mimeType ?? "application/octet-stream"
      });
      if (uploadError) throw uploadError;

      const { error } = await supabase.from("student_submissions").insert({
        course_id: course.id,
        title: title.trim(),
        description: description.trim() || null,
        file_url: path,
        file_type: fileType,
        material_kind: kind,
        student_id: userId,
        approval_status: "pending"
      });
      if (error) throw error;

      Alert.alert("Submitted", "Your material is pending admin review.");
      onDone();
    } catch (error) {
      Alert.alert("Submission failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrap}>
      <AppHeader title="Submit material" subtitle={course.code} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Midterm solution, lecture slide..." />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Optional context"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Material type</Text>
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

        <TouchableOpacity style={styles.fileArea} onPress={pickFile} activeOpacity={0.6}>
          {file ? (
            <Check size={18} color={palette.green} />
          ) : (
            <Paperclip size={18} color={palette.muted} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName}>{file ? file.name : "Choose a file"}</Text>
            <Text style={styles.fileHint}>
              {file ? `${((file.size ?? 0) / 1024).toFixed(0)} KB` : "PDF, PPT, DOC, or images"}
            </Text>
          </View>
        </TouchableOpacity>

        <Button
          loading={loading}
          disabled={loading}
          title="Submit for review"
          icon={<FileUp size={17} color="white" style={{ marginRight: 8 }} />}
          onPress={submit}
          buttonStyle={styles.submitBtn}
          disabledStyle={{ opacity: 0.4 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  label: {
    color: palette.secondary,
    fontWeight: "500",
    fontSize: 14,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  fileArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.line,
    borderStyle: "dashed",
    backgroundColor: palette.surface,
    marginVertical: spacing.md,
  },
  fileName: {
    color: palette.ink,
    fontWeight: "500",
    fontSize: 14,
  },
  fileHint: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: palette.accent,
    borderRadius: radii.md,
    paddingVertical: 14,
  },
});
