import { StyleSheet, View, Text, Button } from "react-native";
import { router } from "expo-router";
import { useAuth } from "./../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.profileInfo}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.info}>Name: {user.name}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>
            Joined: {new Date(user.createdAt).toLocaleDateString()}
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
