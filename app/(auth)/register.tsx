import { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { ref, set, push } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const newUserRef = push(ref(db, "users"));
      await set(newUserRef, {
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      router.replace("/login");
    } catch (error) {
      setError("Registration failed");
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Back Button - adjusted spacing */}
      <View className="mt-16 mb-12 px-5">
        <Pressable className="mb-4" onPress={() => router.back()}>
          <Text className="text-white flex-row items-center">
            <Ionicons name="arrow-back" size={20} color="white" /> Back to login
          </Text>
        </Pressable>

        <Text className="text-4xl text-white font-bold mt-4">Create</Text>
        <Text className="text-lg text-white mt-2">your account</Text>
      </View>

      {/* Register Form Card - adjusted padding */}
      <View className="bg-white rounded-t-3xl flex-1 px-8 pt-12">
        <Text className="text-3xl font-semibold text-primary mb-8">
          Sign Up
        </Text>

        {/* Rest of the form remains the same */}
        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

        {/* ... rest of the components ... */}
      </View>
    </View>
  );
}
