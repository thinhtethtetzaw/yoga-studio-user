import { useState } from "react";
import { View, TextInput, Text, Pressable, Image } from "react-native";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./../context/AuthContext";
import { Toast } from "@/components/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useAuth();
  const [showToast, setShowToast] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleLogin = async () => {
    try {
      setEmailError("");
      setPasswordError("");

      let hasError = false;
      if (!email) {
        setEmailError("Email is required");
        hasError = true;
      }
      if (!password) {
        setPasswordError("Password is required");
        hasError = true;
      }

      if (hasError) return;

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

          setToastMessage("Login successful!");
          setToastType("success");
          setShowToast(true);

          setTimeout(() => {
            router.replace("/(tabs)/");
          }, 2000);

          await AsyncStorage.setItem("userId", userId);
          await AsyncStorage.setItem(
            "userName",
            userData.name || "Unknown User"
          );
        } else {
          setEmailError("Invalid email or password");
          setPasswordError("Invalid email or password");
          setToastMessage("Invalid credentials");
          setToastType("error");
          setShowToast(true);
        }
      } else {
        setEmailError("No users found");
      }
    } catch (error) {
      console.error("Login error:", error);
      setEmailError("Login failed");
      setToastMessage("Login failed");
      setToastType("error");
      setShowToast(true);
    }
  };

  // Add this function to clear booked classes when logging out
  const clearBookedClassesData = async (userId: string) => {
    try {
      await AsyncStorage.removeItem(`bookedClasses_${userId}`);
    } catch (err) {
      console.error("Error clearing booked classes data:", err);
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

        {/* Email Input */}
        <View className="mb-5">
          <View className="flex-row items-center border border-gray-200 rounded-lg p-3 py-2 bg-gray-50">
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
          {emailError ? (
            <Text className="text-red-500 text-sm mt-1 ml-1">{emailError}</Text>
          ) : null}
        </View>

        {/* Password Input */}
        <View className="mb-5">
          <View className="flex-row items-center border border-gray-200 rounded-lg p-3 py-2 bg-gray-50">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-gray-700"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          {passwordError ? (
            <Text className="text-red-500 text-sm mt-1 ml-1">
              {passwordError}
            </Text>
          ) : null}
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

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onHide={() => setShowToast(false)}
        />
      )}
    </View>
  );
}
