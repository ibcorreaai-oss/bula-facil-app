import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { listScans, StoredScan } from "@/lib/db";
import { colors, radius, spacing } from "@/lib/theme";
import { FREE_HISTORY_LIMIT } from "@/lib/config";
import { isPremium } from "@/lib/purchases";

export default function HistoryScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [scans, setScans] = useState<StoredScan[]>([]);
  const [premium, setPremium] = useState(false);

  useFocusEffect(
    useCallback(() => {
      listScans(db).then(setScans);
      isPremium().then(setPremium);
    }, [db])
  );

  if (scans.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nenhum remédio explicado ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!premium && (
        <Pressable style={styles.limitBanner} onPress={() => router.push("/paywall")}>
          <Text style={styles.limitText}>
            Plano grátis guarda os últimos {FREE_HISTORY_LIMIT} — Premium guarda tudo
          </Text>
        </Pressable>
      )}
      <Pressable style={styles.interactionsLink} onPress={() => router.push("/interactions")}>
        <Text style={styles.interactionsLinkText}>💊 Checar interação entre remédios</Text>
      </Pressable>
      <FlatList
        data={scans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push({ pathname: "/result", params: { historyId: item.id } })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.medicationName}</Text>
              {item.profileName !== "Eu" && <Text style={styles.rowProfile}>{item.profileName}</Text>}
            </View>
            <Text style={styles.rowDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            {item.explanation.seekCareSoon && <Text style={styles.rowFlag}>⚠️</Text>}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg, padding: spacing.xl },
  emptyText: { color: colors.textMuted, fontSize: 15 },
  limitBanner: { backgroundColor: "#FFFBEB", padding: spacing.sm, alignItems: "center" },
  limitText: { color: colors.warning, fontSize: 12, fontWeight: "600" },
  interactionsLink: { backgroundColor: colors.border, padding: spacing.sm, alignItems: "center" },
  interactionsLinkText: { color: colors.primaryDark, fontSize: 13, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  rowProfile: { fontSize: 12, color: colors.primaryDark, fontWeight: "600" },
  rowDate: { fontSize: 12, color: colors.textMuted },
  rowFlag: { fontSize: 14 },
});
