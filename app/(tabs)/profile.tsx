import { StyleSheet, View, Text, Button } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get user data from the most recent login
    const loadUserData = async () => {
      try {
        // You should implement proper user session management
        // This is just a basic example
        const usersRef = ref(db);
        const snapshot = await get(child(usersRef, "users"));
        if (snapshot.exists()) {
          const users = snapshot.val();
          // For now, just get the first user (you should store the logged-in user's ID)
          const firstUser = Object.values(users)[0] as any;
          setUserData(firstUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    // Clear any stored user data/session here
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <View style={styles.profileInfo}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.info}>Name: {userData.name}</Text>
          <Text style={styles.info}>Email: {userData.email}</Text>
          <Text style={styles.info}>
            Joined: {new Date(userData.createdAt).toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <Text>Loading profile...</Text>
      )}
      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  profileInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    marginBottom: 20,
  },
});
