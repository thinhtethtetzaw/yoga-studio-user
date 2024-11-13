import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
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
    <View className="flex-1 bg-gray-50 items-center justify-center p-4">
      <Text className="text-xl font-bold mb-6">Add data to firebase</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Title"
        value={title}
        onChangeText={(text: string) => setTitle(text)}
      />
      <TextInput
        className="w-full border border-gray-300 rounded-lg p-3 mb-6"
        placeholder="Body"
        value={body}
        onChangeText={(text: string) => setBody(text)}
        multiline
      />
      <View className="w-full">
        <Button title="Add Data" onPress={addData} />
      </View>
    </View>
  );
}
