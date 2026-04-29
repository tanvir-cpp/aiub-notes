import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Download, ExternalLink, Trash2, X, Check } from "lucide-react-native";
import WebView from "react-native-webview";
import { AppHeader } from "../components/AppHeader";
import { createSignedMaterialUrl, isImageFile, previewUrlForFile, MATERIAL_BUCKET } from "../lib/files";
import { supabase } from "../lib/supabase";
import { palette, spacing, radii } from "../theme/theme";
import type { Note, StudentSubmission } from "../types";

type Props = {
  item: Note | StudentSubmission;
  onBack: () => void;
  isAdmin?: boolean;
};

export function NotePreviewScreen({ item, onBack, isAdmin }: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    createSignedMaterialUrl(item.file_url)
      .then((url) => {
        if (mounted) setSignedUrl(url);
      })
      .catch((error) => {
        Alert.alert("Preview unavailable", error instanceof Error ? error.message : "Could not open file.");
      });
    return () => {
      mounted = false;
    };
  }, [item.file_url]);

  function download() {
    if (!signedUrl) return;
    if (Platform.OS === "web") {
      const a = document.createElement("a");
      a.href = signedUrl;
      a.target = "_blank";
      a.download = `${item.title}.${item.file_type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const a = document.createElement("a");
      a.href = signedUrl;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      if (item.file_url) {
        const { error: storageError } = await supabase.storage.from(MATERIAL_BUCKET).remove([item.file_url]);
        if (storageError) throw storageError;
      }
      const table = "student_id" in item ? "student_submissions" : "notes";
      const { error: dbError } = await supabase.from(table).delete().eq("id", item.id);
      if (dbError) throw dbError;

      onBack();
    } catch (error) {
      Alert.alert("Delete failed", error instanceof Error ? error.message : "An error occurred.");
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  const previewUrl = signedUrl ? previewUrlForFile(signedUrl, item.file_type) : null;

  return (
    <View style={styles.wrap}>
      <AppHeader title={item.title} subtitle={item.file_type.toUpperCase()} onBack={onBack} />

      {/* Action Bar */}
      <View style={styles.actionBar}>
        {!showConfirm ? (
          <>
            <TouchableOpacity style={styles.dlBtn} onPress={download} activeOpacity={0.7}>
              <Download size={17} color="#FFF" />
              <Text style={styles.dlText}>Download</Text>
            </TouchableOpacity>

            {Platform.OS === "web" && previewUrl ? (
              <TouchableOpacity
                style={styles.openBtn}
                onPress={() => window.open(previewUrl, "_blank")}
                activeOpacity={0.7}
              >
                <ExternalLink size={17} color={palette.accent} />
                <Text style={styles.openText}>Open</Text>
              </TouchableOpacity>
            ) : null}

            {isAdmin && (
              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => setShowConfirm(true)}
                activeOpacity={0.7}
              >
                <Trash2 size={17} color={palette.red} />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.confirmRow}>
            <Text style={styles.confirmText}>Are you sure you want to delete?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowConfirm(false)}
                disabled={deleting}
              >
                <X size={16} color={palette.ink} />
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={() => void handleDelete()}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Check size={16} color="#FFF" />
                    <Text style={styles.confirmDeleteText}>Delete</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Preview Container */}
      {!signedUrl ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={palette.accent} size="large" />
          <Text style={styles.loaderText}>Loading preview...</Text>
        </View>
      ) : (
        <View style={styles.preview}>
          {isImageFile(item.file_type) ? (
            <Image resizeMode="contain" source={{ uri: signedUrl }} style={styles.image} />
          ) : Platform.OS === "web" ? (
            <View style={styles.webDocView}>
              <Text style={styles.webDocHint}>Document preview loaded below</Text>
              <iframe
                src={previewUrl!}
                title="File preview"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </View>
          ) : (
            <WebView source={{ uri: previewUrl! }} style={styles.webview} />
          )}
        </View>
      )}

      <Text style={styles.footnote}>Signed preview links expire automatically</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  actionBar: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    alignItems: "center",
  },
  dlBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: radii.md,
    backgroundColor: palette.accent,
  },
  dlText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  openBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.accentLight,
    borderWidth: 1,
    borderColor: palette.line,
  },
  openText: {
    color: palette.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  delBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    backgroundColor: palette.redBg,
    borderWidth: 1,
    borderColor: palette.line,
  },
  confirmRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: "600",
    color: palette.ink,
    flex: 1,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 8,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.line,
  },
  cancelBtnText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "600",
  },
  confirmDeleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    backgroundColor: palette.red,
  },
  confirmDeleteText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  loaderText: {
    color: palette.muted,
    fontSize: 13,
  },
  preview: {
    flex: 1,
    backgroundColor: palette.surfaceAlt,
    margin: spacing.md,
    marginBottom: 0,
    borderRadius: radii.lg,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: palette.line,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  webDocView: {
    flex: 1,
  },
  webDocHint: {
    fontSize: 11,
    color: palette.muted,
    textAlign: "center",
    paddingVertical: 4,
    backgroundColor: palette.surfaceAlt,
  },
  webview: {
    flex: 1,
  },
  footnote: {
    color: palette.faint,
    fontSize: 11,
    textAlign: "center",
    paddingVertical: spacing.sm,
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
});
