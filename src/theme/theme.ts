import { createTheme } from "@rneui/themed";

/* ──────────────────────────────────────────────
   Clean light theme — warm neutrals + deep green
   Intentionally restrained. No glows, no gradients.
   ──────────────────────────────────────────── */
export const palette = {
  /* Backgrounds */
  canvas: "#F5F5F0",       // warm off-white, not sterile blue-gray
  surface: "#FFFFFF",
  surfaceAlt: "#EDEDE8",   // warm gray for recessed areas

  /* Borders */
  line: "#E0DDD6",
  lineDark: "#C8C4BA",

  /* Text */
  ink: "#1A1A1A",
  secondary: "#4A4A4A",
  muted: "#8A8A82",
  faint: "#B5B3AB",

  /* Primary — deep forest green (not teal) */
  accent: "#1B5E3B",
  accentLight: "#EEF5F0",
  accentMid: "#2D7A50",

  /* Status */
  amber: "#C67D1A",
  amberBg: "#FDF5E8",
  red: "#C03030",
  redBg: "#FDF0F0",
  blue: "#2B5EA7",
  blueBg: "#EFF4FC",
  green: "#217A3E",
  greenBg: "#EEF7F0",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
};

export const theme = createTheme({
  lightColors: {
    primary: palette.accent,
    secondary: palette.amber,
    background: palette.canvas,
    white: palette.surface,
    black: palette.ink,
    grey0: palette.ink,
    grey1: palette.muted,
    grey2: palette.line,
  },
  components: {
    Button: {
      radius: radii.md,
      titleStyle: {
        fontWeight: "600",
        fontSize: 15,
      },
      buttonStyle: {
        minHeight: 48,
        paddingHorizontal: 20,
        backgroundColor: palette.accent,
      },
    },
    Input: {
      inputContainerStyle: {
        borderWidth: 1,
        borderColor: palette.line,
        borderRadius: radii.md,
        paddingHorizontal: 12,
        minHeight: 48,
        backgroundColor: palette.surface,
      },
      containerStyle: {
        paddingHorizontal: 0,
      },
      inputStyle: {
        color: palette.ink,
        fontSize: 15,
      },
      placeholderTextColor: palette.faint,
      labelStyle: {
        color: palette.secondary,
        marginBottom: 6,
        fontWeight: "500",
        fontSize: 14,
      },
    },
    Card: {
      containerStyle: {
        borderRadius: radii.lg,
        borderColor: palette.line,
        marginHorizontal: 0,
        backgroundColor: palette.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
    },
  },
});
