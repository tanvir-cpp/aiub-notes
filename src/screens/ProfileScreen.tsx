import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { LogOut, ClipboardList, Shield, Lock, UserRound, ChevronRight, FileText } from "lucide-react-native";
import { confirmAction } from "../lib/confirm";
import { supabase } from "../lib/supabase";
import { AppHeader } from "../components/AppHeader";
import { palette, spacing, radii } from "../theme/theme";
import type { Profile } from "../types";

interface ProfileScreenProps {
  profile: Profile | null;
  onOpenSubmissions: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export function ProfileScreen({ profile, onOpenSubmissions, onOpenPrivacy, onOpenTerms }: ProfileScreenProps) {
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  async function handleLogout() {
    confirmAction("Sign out", "Are you sure you want to sign out?", () => {
      supabase.auth.signOut();
    });
  }

  async function updatePassword() {
    if (newPassword.length < 6) {
      Alert.alert("Invalid", "Password must be at least 6 characters.");
      return;
    }
    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      Alert.alert("Success", "Your password has been updated.");
      setNewPassword("");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Could not update password.");
    } finally {
      setUpdatingPassword(false);
    }
  }

  const role = profile?.role || "student";
  const isAdmin = role === "admin";
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" subtitle="Your account" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Identity */}
        <View style={styles.identitySection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name}>{profile?.full_name || "AIUB Student"}</Text>
            <Text style={styles.email}>{profile?.email || ""}</Text>
          </View>
          {isAdmin && (
            <View style={styles.adminTag}>
              <Text style={styles.adminTagText}>Admin</Text>
            </View>
          )}
        </View>

        {/* Quick links */}
        <View style={styles.group}>
          <MenuItem icon={ClipboardList} label="My Submissions" onPress={onOpenSubmissions} />
        </View>

        {/* Security */}
        <Text style={styles.sectionLabel}>Security</Text>
        <View style={styles.group}>
          <View style={styles.passwordRow}>
            <Input
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="New password"
              leftIcon={<Lock size={17} color={palette.muted} />}
              containerStyle={{ paddingHorizontal: 0, flex: 1 }}
              inputContainerStyle={styles.passInput}
              renderErrorMessage={false}
            />
            <Button
              title="Update"
              loading={updatingPassword}
              disabled={updatingPassword || newPassword.length < 6}
              onPress={updatePassword}
              buttonStyle={styles.passBtn}
              titleStyle={styles.passBtnText}
              disabledStyle={{ opacity: 0.4 }}
            />
          </View>
        </View>

        {/* Legal */}
        <Text style={styles.sectionLabel}>Legal</Text>
        <View style={styles.group}>
          <MenuItem icon={Shield} label="Privacy Policy" onPress={onOpenPrivacy} />
          <View style={styles.divider} />
          <MenuItem icon={FileText} label="Terms of Service" onPress={onOpenTerms} />
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout} activeOpacity={0.5}>
          <LogOut size={17} color={palette.red} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>AIUB Notes v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function MenuItem({ icon: Icon, label, onPress }: { icon: typeof Shield; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.5}>
      <Icon size={18} color={palette.secondary} />
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRight size={17} color={palette.faint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  /* Identity */
  identitySection: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: palette.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    color: palette.accent,
    fontSize: 18,
    fontWeight: "700",
  },
  identityText: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: palette.ink,
  },
  email: {
    fontSize: 13,
    color: palette.muted,
    marginTop: 2,
  },
  adminTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: palette.accentLight,
  },
  adminTagText: {
    color: palette.accent,
    fontSize: 11,
    fontWeight: "600",
  },

  /* Groups */
  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: palette.muted,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  group: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.md - 4,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: palette.ink,
  },
  divider: {
    height: 1,
    backgroundColor: palette.line,
    marginLeft: spacing.md + 30,
  },

  /* Password */
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  passInput: {
    borderWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: palette.canvas,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    minHeight: 40,
  },
  passBtn: {
    backgroundColor: palette.accent,
    borderRadius: radii.sm,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  passBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },

  /* Sign out */
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.line,
    marginBottom: spacing.lg,
  },
  signOutText: {
    color: palette.red,
    fontSize: 15,
    fontWeight: "600",
  },

  version: {
    textAlign: "center",
    color: palette.faint,
    fontSize: 12,
  },
});
