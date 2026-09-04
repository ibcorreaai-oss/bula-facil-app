import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "explicare.aiConsent.v1";

export async function hasAiConsent(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEY)) === "true";
}

export async function grantAiConsent(): Promise<void> {
  await AsyncStorage.setItem(KEY, "true");
}
