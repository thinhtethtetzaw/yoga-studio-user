import { StyleSheet, View, Text } from "react-native";

export default function ClassScreen() {
  return (
    <View style={styles.container}>
      <Text>Class Screen</Text>
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
