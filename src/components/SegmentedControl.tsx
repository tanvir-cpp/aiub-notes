import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, radii } from "../theme/theme";

type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.button, active && styles.activeButton]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.6}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    borderRadius: radii.md,
    padding: 3,
    backgroundColor: palette.surfaceAlt,
  },
  button: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRadius: radii.sm + 1,
  },
  activeButton: {
    backgroundColor: palette.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    color: palette.muted,
    fontWeight: "500",
    fontSize: 13,
  },
  activeLabel: {
    color: palette.ink,
    fontWeight: "600",
  },
});
