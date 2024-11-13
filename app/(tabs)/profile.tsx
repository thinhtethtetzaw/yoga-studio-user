import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { useAuth } from "./../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View className="flex-1 p-5 bg-white">
      {user ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-bold mb-5">Profile</Text>
          <Text className="text-base mb-2.5">Name: {user.name}</Text>
          <Text className="text-base mb-2.5">Email: {user.email}</Text>
          <Text className="text-base mb-2.5">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <Text>Loading profile...</Text>
      )}
      <View className="mb-5">
        <Button title="Logout" onPress={handleLogout} color="#fb4b54" />
      </View>
    </View>
  );
}
