import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import { Mail, ArrowLeft } from "lucide-react-native";
import { supabase } from "../lib/supabase";
import { isAiubEmail } from "../lib/auth";
import { palette, spacing, radii } from "../theme/theme";

type Props = {
  onBack: () => void;
  onOtpRequired: (email: string, type: "recovery") => void;
};

export function ForgotPasswordScreen({ onBack, onOtpRequired }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function forgotPassword() {
    const cleanEmail = email.trim().toLowerCase();
    if (!isAiubEmail(cleanEmail)) {
      Alert.alert("Invalid email", "Enter your AIUB student email.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) throw error;
      Alert.alert("Check your inbox", "We sent a password reset OTP to your email.");
      onOtpRequired(cleanEmail, "recovery");
    } catch (error) {
      Alert.alert("Request failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrap}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} color={palette.ink} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.sub}>
          Enter your AIUB email and we'll send an OTP to recover your account.
        </Text>

        <Input
          label="AIUB email"
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="xx-xxxxx-x@student.aiub.edu"
          leftIcon={<Mail size={18} color={palette.muted} />}
          leftIconContainerStyle={{ marginRight: 8 }}
        />
        
        <Button 
          loading={loading} 
          disabled={loading || !email.trim()} 
          title="Send recovery OTP" 
          onPress={forgotPassword} 
          buttonStyle={styles.cta}
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
    flexGrow: 1, 
    justifyContent: "center", 
    padding: spacing.xl, 
    gap: spacing.sm,
  },
  backBtn: { 
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: { 
    color: palette.ink, 
    fontSize: 26, 
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  sub: { 
    color: palette.muted, 
    fontSize: 15, 
    lineHeight: 22, 
    marginBottom: spacing.lg,
  },
  cta: { 
    backgroundColor: palette.accent, 
    borderRadius: radii.md, 
    paddingVertical: 14,
    marginTop: spacing.sm,
  },
});
