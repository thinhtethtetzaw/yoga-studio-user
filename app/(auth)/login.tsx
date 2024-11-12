import { useState } from "react";
import { StyleSheet, View, TextInput, Button, Text } from "react-native";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      const usersRef = ref(db);
      const snapshot = await get(child(usersRef, "users"));

      if (snapshot.exists()) {
        const users = snapshot.val();
        // Log the users data to debug (remove in production)
        console.log("Users data:", users);

        // Find user with matching email and password
        const userFound = Object.entries(users).find(
          ([key, userData]: [string, any]) => {
            return userData.email === email && userData.password === password;
          }
        );

        if (userFound) {
          const [userId, userData] = userFound;
          // Store user data in local storage or context if needed
          console.log("Logged in user:", userData);

          // Navigate to tabs
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => router.push("/register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
