// Backend that runs the vision-LLM explanation. Same one deployed from api-backend/.
export const API_BASE_URL = "https://bula-facil-api.vercel.app";

// RevenueCat public SDK keys — safe to ship in the client (they only identify the app,
// they are not secret credentials). Left empty until the RevenueCat project exists;
// the app runs fully functional in "no premium available yet" mode without them.
export const REVENUECAT_IOS_API_KEY = "";
export const REVENUECAT_ANDROID_API_KEY = "";

export const FREE_HISTORY_LIMIT = 3;

export const PREMIUM_ENTITLEMENT_ID = "premium";
