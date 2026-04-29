import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import { ShieldCheck } from "lucide-react-native";
import { supabase } from "../lib/supabase";
import { palette, spacing, radii } from "../theme/theme";

type Props = {
  email: string;
  otpType?: "signup" | "recovery";
  onBack: () => void;
  onVerified: () => void;
};

export function OtpScreen({ email, otpType = "signup", onBack, onVerified }: Props) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function verify() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: otpType
      });
      if (error) throw error;
      if (data.session) {
        onVerified();
      } else {
        Alert.alert("Verified", "Your email is verified. You can now log in with your password.");
        onBack();
      }
    } catch (error) {
      Alert.alert("Verification failed", error instanceof Error ? error.message : "Please check the code.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setResending(true);
    try {
      if (otpType === "recovery") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resend({ email, type: "signup" });
        if (error) throw error;
      }
      Alert.alert("OTP sent", "Check your AIUB inbox.");
    } catch (error) {
      Alert.alert("Could not resend OTP", error instanceof Error ? error.message : "Please try again later.");
    } finally {
      setResending(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.iconBox}>
        <ShieldCheck size={28} color={palette.accent} />
      </View>
      <Text style={styles.title}>Verify email</Text>
      <Text style={styles.sub}>Enter the 6-digit code sent to {email}</Text>

      <Input
        label="OTP code"
        keyboardType="number-pad"
        value={token}
        onChangeText={setToken}
        placeholder="000000"
        inputStyle={styles.otpInput}
      />

      <Button
        loading={loading}
        disabled={loading || token.length < 6}
        title="Verify"
        onPress={verify}
        buttonStyle={styles.verifyBtn}
        disabledStyle={{ opacity: 0.4 }}
      />

      <View style={styles.links}>
        <TouchableOpacity onPress={resend} disabled={resending}>
          <Text style={styles.link}>{resending ? "Sending..." : "Resend OTP"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.link}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: palette.canvas,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: palette.accentLight,
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
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  otpInput: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 6,
    color: palette.ink,
  },
  verifyBtn: {
    backgroundColor: palette.accent,
    borderRadius: radii.md,
    paddingVertical: 14,
  },
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  link: {
    color: palette.accent,
    fontSize: 14,
    fontWeight: "500",
  },
});
