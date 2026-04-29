import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import { Lock, Mail, UserRound } from "lucide-react-native";
import { supabase } from "../lib/supabase";
import { isAiubEmail } from "../lib/auth";
import { palette, spacing, radii } from "../theme/theme";

type Props = {
  onOtpRequired: (email: string, otpType?: "signup" | "recovery") => void;
  onForgotPassword: () => void;
};

function isUnverifiedEmailError(error: unknown) {
  return error instanceof Error && /email not confirmed|not confirmed|confirm/i.test(error.message);
}

export function AuthScreen({ onOtpRequired, onForgotPassword }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const cleanEmail = email.trim().toLowerCase();
    if (!isAiubEmail(cleanEmail)) {
      Alert.alert("AIUB student email required", "Use your student email, for example 23-51455-1@student.aiub.edu.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password too short", "Use at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) {
          if (isUnverifiedEmailError(error)) {
            await supabase.auth.resend({ type: "signup", email: cleanEmail });
            Alert.alert("Verify your email", "We sent a fresh OTP to your AIUB inbox.");
            onOtpRequired(cleanEmail);
            return;
          }
          throw error;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim()
            }
          }
        });
        if (error) throw error;
        if (!data.session) {
          Alert.alert("Check your inbox", "Enter the OTP Supabase sent to your AIUB email.");
          onOtpRequired(cleanEmail);
        }
      }
    } catch (error) {
      Alert.alert("Authentication failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrap}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>AN</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </Text>
          <Text style={styles.sub}>
            {mode === "login"
              ? "Sign in with your AIUB student email."
              : "Register, then verify the OTP we send to your inbox."}
          </Text>

          {mode === "signup" ? (
            <Input
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your name"
              leftIcon={<UserRound size={18} color={palette.muted} />}
              leftIconContainerStyle={{ marginRight: 8 }}
            />
          ) : null}
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
          <Input
            label="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholder="Min 6 characters"
            leftIcon={<Lock size={18} color={palette.muted} />}
            leftIconContainerStyle={{ marginRight: 8 }}
          />

          {mode === "login" ? (
            <TouchableOpacity onPress={onForgotPassword} style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          ) : null}

          <Button
            loading={loading}
            disabled={loading}
            title={mode === "login" ? "Sign in" : "Create account"}
            onPress={submit}
            buttonStyle={styles.cta}
            disabledStyle={{ opacity: 0.5 }}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {mode === "login" ? "Don't have an account?" : "Already registered?"}
            </Text>
            <TouchableOpacity onPress={() => setMode(mode === "login" ? "signup" : "login")}>
              <Text style={styles.switchLink}>
                {mode === "login" ? " Sign up" : " Sign in"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    paddingTop: spacing.xxl + 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: palette.accent,
    fontSize: 28,
    fontWeight: "700",
  },
  form: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  heading: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  sub: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  forgotText: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  cta: {
    backgroundColor: palette.accent,
    borderRadius: radii.md,
    paddingVertical: 14,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  switchLabel: {
    color: palette.muted,
    fontSize: 14,
  },
  switchLink: {
    color: palette.accent,
    fontSize: 14,
    fontWeight: "600",
  },
});
