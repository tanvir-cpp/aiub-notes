import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette, spacing } from "../theme/theme";

type Props = {
  onDone: () => void;
};

export function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const timeout = setTimeout(onDone, 1200);
    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <View style={styles.wrap}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>AN</Text>
      </View>
      <Text style={styles.name}>AIUB Notes</Text>
      <Text style={styles.tagline}>Study smarter, together.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accent,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  logoText: {
    color: palette.accent,
    fontSize: 30,
    fontWeight: "700",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  tagline: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    marginTop: spacing.xs,
  },
});
