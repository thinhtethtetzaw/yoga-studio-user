import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { set, ref } from "firebase/database";
import { db } from "@/FirebaseConfig";
export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const addData = () => {
    set(ref(db, "posts/"), {
      title,
      body,
    });
    setTitle("");
    setBody("");
  };
  return (
    <View style={styles.container}>
      <Text>Add data to firebase</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={(text: string) => setTitle(text)}
      />
      <TextInput
        placeholder="Body"
        value={body}
        onChangeText={(text: string) => setBody(text)}
      />
      <Button title="Add Data" onPress={addData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
