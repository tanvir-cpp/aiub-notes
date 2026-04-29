import { Alert, Platform } from "react-native";

/**
 * Cross-platform confirmation dialog that works on both native and web.
 * On web, Alert.alert with button callbacks can be unreliable,
 * so we use window.confirm instead.
 */
export function confirmAction(
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) {
      void onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", style: "destructive", onPress: () => void onConfirm() },
    ]);
  }
}
