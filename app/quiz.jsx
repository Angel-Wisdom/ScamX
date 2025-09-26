import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const QUIZ_DATA = {
  title: "Cybersecurity Awareness Quiz",
  questions: [
    {
      id: 1,
      question: "What is a 'phishing' attack?",
      options: [
        "A type of malware that encrypts your files.",
        "A technique for tricking users into revealing personal information.",
        "A physical security breach.",
        "An attack that overloads a network server.",
      ],
      answer:
        "A technique for tricking users into revealing personal information.",
    },
    {
      id: 2,
      question: "Which of the following is an example of a strong password?",
      options: ["Password123", "12345678", "Mybirthday1995", "P@ssw0rd!23"],
      answer: "P@ssw0rd!23",
    },
    {
      id: 3,
      question: "What is the purpose of multi-factor authentication (MFA)?",
      options: [
        "To make your password longer.",
        "To block spam emails.",
        "To require multiple forms of verification to log in.",
        "To protect your computer from viruses.",
      ],
      answer: "To require multiple forms of verification to log in.",
    },
  ],
  timeLimitInSeconds: 600,
};

export default function QuizScreen() {
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DATA.timeLimitInSeconds);
  const [timerExpired, setTimerExpired] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setTimerExpired(true);
    }
  }, [timeLeft]);

  const nextQuestion = () => {
    if (selectedAnswer === QUIZ_DATA.questions[questionIndex].answer) {
      setScore((s) => s + 1);
    }
    setSelectedAnswer(null);
    if (questionIndex < QUIZ_DATA.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setTimerExpired(true);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // If finished (time expired or all questions answered)
  if (timerExpired) {
    const total = QUIZ_DATA.questions.length;
    const percent = Math.round((score / total) * 100);

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.resultTitle}>
            {timeLeft === 0 ? "Time’s up!" : "Quiz Complete!"}
          </Text>
          <Text style={styles.resultScore}>
            {score}/{total}
          </Text>
          <Text style={styles.resultMessage}>
            {percent >= 80 ? "Excellent work!" : "Keep practicing, you’ll get there!"}
          </Text>
        </View>
      </View>
    );
  }

  // Quiz screen
  const q = QUIZ_DATA.questions[questionIndex];
  const progress = Math.round(((questionIndex + 1) / QUIZ_DATA.questions.length) * 100);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text>
            Question {questionIndex + 1}/{QUIZ_DATA.questions.length}
          </Text>
          <Text style={{ color: "red", fontWeight: "bold" }}>
            Time: {formatTime(timeLeft)}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.question}>{q.question}</Text>

        {q.options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedAnswer(opt)}
            style={[
              styles.option,
              selectedAnswer === opt && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswer === opt && { color: "white" },
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={nextQuestion}
          disabled={!selectedAnswer}
          style={[
            styles.nextButton,
            !selectedAnswer && { backgroundColor: "gray" },
          ]}
        >
          <Text style={styles.nextButtonText}>
            {questionIndex < QUIZ_DATA.questions.length - 1 ? "Next" : "Finish"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e1065", // purple-950
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 16,
  },
  progress: {
    height: 8,
    backgroundColor: "#9333ea",
    borderRadius: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  option: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: "#9333ea",
  },
  optionText: {
    color: "#111827",
  },
  nextButton: {
    backgroundColor: "#9333ea",
    padding: 16,
    borderRadius: 24,
    marginTop: 12,
  },
  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  resultScore: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#9333ea",
    marginBottom: 12,
  },
  resultMessage: {
    textAlign: "center",
    color: "#555",
    marginBottom: 16,
  },
});
