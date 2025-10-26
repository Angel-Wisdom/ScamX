import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#1d0c3b", "#2c1464"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>ScamX</Text>
      </View>

      {/* Logo / Icon */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>📱</Text>
        <Text style={styles.title}>Scam Awareness</Text>
        <Text style={styles.subtitle}>
          Test your knowledge with our quiz and see how you rank on the leaderboard!
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <Text style={styles.featureText}>⚡ Fun & Interactive Quizzes</Text>
        <Text style={styles.featureText}>🏆 Compete with Others</Text>
        <Text style={styles.featureText}>🛡️ Learn to Stay Safe</Text>
        <Text style={styles.featureText}>🔍 QR Code Security Scanner</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.quizButton]}
          onPress={() => router.push("/QuizHomeScreen")}
        >
          <Text style={styles.buttonText}>📝 Start Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.leaderboardButton]}
          onPress={() => router.push("/leaderboard")}
        >
          <Text style={styles.buttonText}>🏆 View Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.qrButton]}
          onPress={() => router.push("/qrscan")}
        >
          <Text style={styles.buttonText}>🔍 QR Scanner</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center" 
  },
  header: { 
    position: "absolute", 
    top: 60, 
    left: 20 
  },
  brand: { 
    color: "#9b5cff", 
    fontSize: 24, 
    fontWeight: "700" 
  },
  logoContainer: { 
    alignItems: "center", 
    marginBottom: 40 
  },
  logoIcon: { 
    fontSize: 80, 
    marginBottom: 16 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    color: "#fff", 
    marginBottom: 12,
    textAlign: "center"
  },
  subtitle: { 
    fontSize: 16, 
    color: "#d6c6ff", 
    textAlign: "center", 
    paddingHorizontal: 20,
    lineHeight: 22
  },
  features: { 
    marginVertical: 30, 
    alignItems: "center" 
  },
  featureText: { 
    color: "#fff", 
    fontSize: 16, 
    marginVertical: 6,
    fontWeight: "500"
  },
  buttons: { 
    marginTop: 30 
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 14,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quizButton: {
    backgroundColor: "#9b5cff",
  },
  leaderboardButton: {
    backgroundColor: "#ff6b6b",
  },
  qrButton: {
    backgroundColor: "#4ecdc4",
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
});