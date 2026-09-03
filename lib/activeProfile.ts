import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "bulafacil.activeProfile";
export const DEFAULT_PROFILE = "Eu";

export async function getActiveProfile(): Promise<string> {
  const stored = await AsyncStorage.getItem(KEY);
  return stored ?? DEFAULT_PROFILE;
}

export async function setActiveProfile(name: string): Promise<void> {
  await AsyncStorage.setItem(KEY, name);
}
