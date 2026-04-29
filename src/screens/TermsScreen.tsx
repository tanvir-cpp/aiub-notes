import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { palette, spacing } from "../theme/theme";

export function TermsScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <AppHeader title="Terms of Service" subtitle="Rules and guidelines" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <Section n="1" title="Eligibility">
          AIUB Notes is exclusively for active students of American International University-Bangladesh. By using this service, you confirm you are registering with a valid @student.aiub.edu email.
        </Section>

        <Section n="2" title="Acceptable Use">
          You agree to use this platform strictly for educational collaboration. Do not upload malicious files, spam, or entirely irrelevant content. The administration reserves the right to ban accounts violating these terms.
        </Section>

        <Section n="3" title="Academic Integrity">
          Do not share direct answers to active exams or assignments that violate AIUB's academic integrity policies. This platform is for sharing study notes, past materials, and general knowledge.
        </Section>

        <Section n="4" title="Modifications">
          We reserve the right to modify these terms at any time. Continued use of the platform constitutes your acceptance of the updated terms.
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
