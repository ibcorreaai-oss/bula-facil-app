import { Platform } from "react-native";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { PREMIUM_ENTITLEMENT_ID, REVENUECAT_ANDROID_API_KEY, REVENUECAT_IOS_API_KEY } from "./config";

let configured = false;

function apiKeyForPlatform(): string {
  return Platform.OS === "ios" ? REVENUECAT_IOS_API_KEY : REVENUECAT_ANDROID_API_KEY;
}

/** Safe to call multiple times / before a RevenueCat project exists — no-ops without a key. */
export function ensurePurchasesConfigured() {
  if (configured) return;
  const apiKey = apiKeyForPlatform();
  if (!apiKey) return;
  Purchases.configure({ apiKey });
  configured = true;
}

export function isPurchasesAvailable(): boolean {
  return Boolean(apiKeyForPlatform());
}

export async function isPremium(): Promise<boolean> {
  if (!isPurchasesAvailable()) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return hasPremiumEntitlement(info);
  } catch {
    return false;
  }
}

export function hasPremiumEntitlement(info: CustomerInfo): boolean {
  return Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
}

export async function presentPaywall(): Promise<boolean> {
  if (!isPurchasesAvailable()) return false;
  const RevenueCatUI = require("react-native-purchases-ui").default;
  const result = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: PREMIUM_ENTITLEMENT_ID,
  });
  return result === "PURCHASED" || result === "RESTORED";
}
