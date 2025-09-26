import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // 👈 import router
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LandingScreen() {
  const router = useRouter(); // 👈 get router

  return (
    <LinearGradient colors={["#1d0c3b", "#2c1464"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>ScamX</Text>
      </View>

      {/* Logo / Icon */}
      <View style={styles.logoContainer}>
        <Text style={{ fontSize: 60 }}>📱</Text>
        <Text style={styles.title}>Scam Awareness</Text>
        <Text style={styles.subtitle}>
          Test your knowledge with our quiz and see how you rank on the
          leaderboard!
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <Text style={styles.featureText}>⚡ Fun & Interactive Quizzes</Text>
        <Text style={styles.featureText}>🏆 Compete with Others</Text>
        <Text style={styles.featureText}>🛡️ Learn to Stay Safe</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/quiz")}   // 👈 link to app/quiz.jsx
        >
          <Text style={styles.buttonText}>📝 Start Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/leaderboard")}   // 👈 link to app/leaderboard.jsx
        >
          <Text style={styles.buttonText}>🏆 View Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/qrscan")}   // 👈 link to app/qrscan.jsx
        >
          <Text style={styles.buttonText}>🏆 View Leaderboard</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  header: { position: "absolute", top: 50, left: 20 },
  brand: { color: "#9b5cff", fontSize: 22, fontWeight: "700" },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#d6c6ff", textAlign: "center", paddingHorizontal: 10 },
  features: { marginVertical: 20, alignItems: "center" },
  featureText: { color: "#fff", fontSize: 15, marginVertical: 4 },
  buttons: { marginTop: 20 },
  actionButton: {
    backgroundColor: "#5a2d91",
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
