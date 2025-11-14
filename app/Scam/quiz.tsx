import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function QuizDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const quiz = JSON.parse(params.quiz);

  const features = [
    { icon: 'help-circle', text: `${quiz.questions} Question`, subtext: '10 point for a correct answer' },
    { icon: 'time', text: quiz.duration, subtext: 'Total duration of the quiz' },
    { icon: 'star', text: 'Win 10 star', subtext: 'Answer all questions correctly' },
  ];

  const rules = [
    '10 point awarded for a correct answer and no marks for a incorrect answer',
    'Tap on options to select the correct answer',
    'Tap on the bookmark icon to save interesting questions',
    'Click submit if you are sure you want to complete all the quizzes',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Quiz</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Quiz Card */}
        <View style={styles.quizCard}>
          <Text style={styles.quizTitle}>{quiz.title} Quiz</Text>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>GET 100 Points</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star} 
                  name={star <= 4 ? 'star' : 'star-half'} 
                  size={16} 
                  color="#fbbf24" 
                />
              ))}
            </View>
            <Text style={styles.ratingText}>4.8</Text>
          </View>

          <Text style={styles.description}>
            Brief explanation about this quiz. Test your knowledge in {quiz.title.toLowerCase()} 
            and improve your cybersecurity skills through practical questions and scenarios.
          </Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name={feature.icon} size={24} color="#9333ea" />
                <View style={styles.featureText}>
                  <Text style={styles.featureMain}>{feature.text}</Text>
                  <Text style={styles.featureSub}>{feature.subtext}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Rules Section */}
          <View style={styles.rulesSection}>
            <Text style={styles.rulesTitle}>
              Please read the text below carefully so you can understand it
            </Text>
            {rules.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.ruleBullet}>•</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>

          {/* Start Button */}
          <TouchableOpacity 
            style={styles.startQuizButton}
            onPress={() => router.push({ pathname: "/QuizQuestionScreen", params: { quiz: JSON.stringify(quiz) } })}
          >
            <Text style={styles.startQuizText}>Start Quiz</Text>
          </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  quizCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: '100%',
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  pointsBadge: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  pointsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
  },
  featureMain: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  featureSub: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  rulesSection: {
    marginBottom: 30,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleBullet: {
    color: '#9333ea',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    lineHeight: 20,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  startQuizButton: {
    backgroundColor: '#9333ea',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startQuizText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});