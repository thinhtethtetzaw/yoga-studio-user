import { useState } from "react";
import { View, TextInput, Text, Pressable, Image } from "react-native";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./../context/AuthContext";

type FirebaseUser = {
  email: string;
  name: string;
  password: string;
  createdAt: string;
  [key: string]: any;
};

type UsersData = {
  [key: string]: FirebaseUser;
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      const usersRef = ref(db);
      const snapshot = await get(child(usersRef, "users"));

      if (snapshot.exists()) {
        const users = snapshot.val() as UsersData;

        const entries = Object.entries(users) as [string, FirebaseUser][];
        const userFound = entries.find(([key, userData]) => {
          return userData.email === email && userData.password === password;
        });

        if (userFound) {
          const [userId, userData] = userFound;
          login({
            id: userId,
            email: userData.email,
            name: userData.name,
            createdAt: userData.createdAt,
            password: userData.password,
          });

          router.replace("/(tabs)/");
        } else {
          setError("Invalid credentials");
        }
      } else {
        setError("No users found");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed");
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Header Section - increased vertical spacing */}
      <View className="mt-16 mb-24 px-5 relative">
        <Text className="text-lg text-white mb-2 mt-5">Welcome to</Text>
        <Text className="text-4xl text-white font-bold">Yoga Studio</Text>

        <Image
          source={require("../../assets/yoga/vase.png")}
          resizeMode="contain"
          className="size-60 absolute -bottom-[9.5rem] -right-5 z-10"
        />
      </View>

      {/* Login Form Card - adjusted padding */}
      <View className="bg-white rounded-t-3xl flex-1 px-6 pt-12">
        <Text className="text-3xl font-semibold text-primary mb-8">Login</Text>

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

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

        {/* Login Button */}
        <Pressable
          className="bg-primary py-3 rounded-lg mb-3"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-semibold">Login</Text>
        </Pressable>

        {/* Register Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">Don't have account? </Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text className="text-primary font-semibold">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
