import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { palette, spacing, radii } from "../theme/theme";

export function PrivacyPolicyScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <AppHeader title="Privacy Policy" subtitle="How we protect your data" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <Section n="1" title="Information Collection">
          We collect basic profile information (like your AIUB email and name) to provide a secure environment for sharing university resources. We do not track location or use third-party advertising cookies.
        </Section>

        <Section n="2" title="Material Submissions">
          Any files (notes, slides, etc.) you upload will be publicly accessible to other authenticated students after admin approval. Do not upload sensitive personal data or copyrighted materials you do not own.
        </Section>

        <Section n="3" title="Data Security">
          Your data is encrypted and securely stored. We use robust authentication to ensure only verified AIUB students can access the platform's resources.
        </Section>

        <Section n="4" title="Account Deletion">
          You can request account deletion at any time by contacting an administrator. This will remove your profile, but submitted materials may be retained to preserve educational continuity for other students unless specifically requested for removal.
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{n}. {title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
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
  section: {
    marginBottom: spacing.lg,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.ink,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: 14,
    color: palette.muted,
    lineHeight: 22,
  },
});
