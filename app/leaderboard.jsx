import { StyleSheet, Text, View } from "react-native";

function Leaderboard() {
  // User data
  const data = [
    { name: "Brooklyn Sim", points: 1200, change: "up" },
    { name: "Bradley Henry", points: 987, change: "up" },
    { name: "Guy Hawkins", points: 900, change: "up" },
    { name: "Jenny Wilson", points: 887, change: "down" },
    { name: "Annette Black", points: 750, change: "up" },
    { name: "Marvin McKinney", points: 748, change: "down" },
    { name: "Wade Warren", points: 546, change: "up" },
    { name: "You", points: 489, change: "up" },
    { name: "Devon Lane", points: 400, change: "down" },
  ];

  const topThree = data.slice(0, 3);
  const others = data.slice(3);

  // Arrow component
  const Arrow = ({ change }) => (
    <Text style={{ color: change === "up" ? "green" : "red", fontSize: 18 }}>
      {change === "up" ? "▲" : "▼"}
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>

      {/* Top 3 */}
      <View style={styles.topThree}>
        {topThree.map((user, index) => (
          <View key={index} style={styles.topItem}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{index + 1}</Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.points}>{user.points} pts</Text>
          </View>
        ))}
      </View>

      {/* Others */}
      {others.map((user, index) => (
        <View
          key={index + 3}
          style={[
            styles.otherItem,
            user.name === "You" && styles.highlight,
          ]}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>
              {index + 4}. {user.name}
            </Text>
            <Text>{user.points} pts</Text>
          </View>
          <Arrow change={user.change} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  topThree: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  topItem: {
    alignItems: "center",
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  name: {
    marginTop: 8,
  },
  points: {
    color: "#555",
  },
  otherItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  highlight: {
    backgroundColor: "#e0f7ff",
  },
});

export default Leaderboard;