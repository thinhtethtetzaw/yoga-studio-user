import { useState } from "react";
import { View, TextInput, Text, Pressable, Image } from "react-native";
import { ref, set, push } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      {/* Header Section */}
      <View className="mt-16 mb-24 px-5 relative">
        <Text className="text-4xl text-white font-bold mb-1">Create</Text>
        <Text className="text-4xl text-white font-bold">your account</Text>

        <Image
          source={require("../../assets/yoga/purple_branch.png")}
          resizeMode="contain"
          className="size-52 absolute -bottom-24 -right-5 z-10"
        />
      </View>

      {/* Register Form Card */}
      <View className="bg-white rounded-t-3xl flex-1 px-6 pt-6">
        <Text className="text-3xl font-semibold text-primary mb-8">
          Sign Up
        </Text>

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

        {/* Name Input */}
        <View className="flex-row items-center border border-gray-200 rounded-lg p-3 py-2 bg-gray-50 mb-5">
          <Ionicons name="person-outline" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-700"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        {/* Email Input */}
        <View className="flex-row items-center border border-gray-200 rounded-lg p-3 py-2 bg-gray-50 mb-5">
          <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-700"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View className="flex-row items-center border border-gray-200 rounded-lg p-3 py-2 bg-gray-50 mb-5">
          <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-700"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Confirm Password Input */}
        <View className="flex-row items-center border border-gray-200 rounded-lg p-3 py-2 bg-gray-50 mb-5">
          <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-700"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Register Button */}
        <Pressable
          className="bg-primary py-3 rounded-lg mb-3"
          onPress={handleRegister}
        >
          <Text className="text-white text-center font-semibold">Sign Up</Text>
        </Pressable>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary font-semibold">Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
