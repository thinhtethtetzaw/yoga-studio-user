import { StyleSheet, View, Text } from "react-native";

export default function CourseScreen() {
  return (
    <View style={styles.container}>
      <Text>Course Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
