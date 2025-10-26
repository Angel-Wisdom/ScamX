import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="QuizHomeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="QuizDetailScreen" options={{ headerShown: false }} />
      <Stack.Screen name="QuizQuestionScreen" options={{ headerShown: false }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
      <Stack.Screen name="qrscan" options={{ headerShown: false }} />
    </Stack>
  );
}