import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const QUIZ_DATA = [
  {
    id: 1,
    title: 'Cyber Security',
    questions: 10,
    duration: '1 hour 15 min',
    progress: null,
    category: 'popular',
  },
  {
    id: 2,
    title: 'Penetration Testing',
    questions: 10,
    duration: '1 hour 15 min',
    progress: null,
    category: 'popular',
  },
  {
    id: 3,
    title: 'Security Analyst',
    questions: 10,
    duration: '1 hour 15 min',
    progress: 80,
    category: 'continue',
  },
  {
    id: 4,
    title: 'Network Security',
    questions: 8,
    duration: '45 min',
    progress: null,
    category: 'popular',
  },
  {
    id: 5,
    title: 'Phishing Awareness',
    questions: 12,
    duration: '1 hour',
    progress: 60,
    category: 'continue',
  },
  {
    id: 6,
    title: 'Data Protection',
    questions: 15,
    duration: '1 hour 30 min',
    progress: null,
    category: 'popular',
  },
];

export default function QuizHomeScreen() {
  const router = useRouter();
  const popularQuizzes = QUIZ_DATA.filter(quiz => quiz.category === 'popular');
  const continueQuizzes = QUIZ_DATA.filter(quiz => quiz.category === 'continue');

  const QuizCard = ({ quiz, type }) => (
    <TouchableOpacity 
      style={styles.quizCard}
      onPress={() => router.push({ pathname: "/QuizDetailScreen", params: { quiz: JSON.stringify(quiz) } })}
    >
      <View style={styles.quizHeader}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        {type === 'continue' && (
          <Ionicons name="bookmark" size={20} color="#9333ea" />
        )}
      </View>
      <Text style={styles.quizMeta}>
        {quiz.questions} Question • {quiz.duration}
      </Text>
      {type === 'continue' && quiz.progress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${quiz.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{quiz.progress}% Complete</Text>
        </View>
      )}
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => router.push({ pathname: "/QuizDetailScreen", params: { quiz: JSON.stringify(quiz) } })}
      >
        <Text style={styles.startButtonText}>
          {type === 'continue' ? 'Continue Quiz' : 'Start Quiz'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Hello, James</Text>
            <Text style={styles.subtitle}>Let's test your knowledge</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search quizzes..."
            placeholderTextColor="#666"
          />
        </View>

        {/* Popular Cyber Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Cyber Security</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} type="popular" />
            ))}
          </ScrollView>
        </View>

        {/* Continue Quiz Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Quiz</Text>
          {continueQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} type="continue" />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e1065',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#d8b4fe',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9333ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  quizMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#9333ea',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  startButton: {
    backgroundColor: '#9333ea',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});