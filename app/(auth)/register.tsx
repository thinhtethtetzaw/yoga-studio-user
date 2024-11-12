import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  Image,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import { ref, set, push } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "@/components/Toast";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleRegister = async () => {
    // Reset all errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    // Validate all fields
    if (!name.trim()) {
      setNameError("Name is required");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      hasError = true;
    }

    if (hasError) return;

    try {
      const newUserRef = push(ref(db, "users"));
      await set(newUserRef, {
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      setToastMessage("Registration successful!");
      setToastType("success");
      setShowToast(true);

      // Longer delay to show toast
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error) {
      setToastMessage("Registration failed");
      setToastType("error");
      setShowToast(true);
      setEmailError("Registration failed");
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Header Section */}
      <View className="mt-16 mb-10 px-5 relative">
        <Text className="text-4xl text-white font-bold mb-1">Create</Text>
        <Text className="text-4xl text-white font-bold">your account</Text>

        {/* <Image
          source={require("../../assets/yoga/purple_branch.png")}
          resizeMode="contain"
          className="size-52 absolute -bottom-24 -right-5 z-10"
        /> */}
      </View>

      {/* Register Form Card */}
      <View className="bg-white rounded-t-3xl flex-1 px-6 pt-6">
        <Text className="text-3xl font-semibold text-primary mb-8">
          Sign Up
        </Text>

        {/* Name Input */}
        <View className="mb-5">
          <View className="flex-row items-center border border-gray-200 rounded-lg p-3 py-2 bg-gray-50">
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-gray-700"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
          {nameError ? (
            <Text className="text-red-500 text-sm mt-1 ml-1">{nameError}</Text>
          ) : null}
        </View>

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

        {/* Confirm Password Input */}
        <View className="mb-5">
          <View className="flex-row items-center border border-gray-200 rounded-lg p-3 py-2 bg-gray-50">
            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-gray-700"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          {confirmPasswordError ? (
            <Text className="text-red-500 text-sm mt-1 ml-1">
              {confirmPasswordError}
            </Text>
          ) : null}
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
