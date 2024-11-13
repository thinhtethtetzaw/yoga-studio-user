import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "./../context/AuthContext";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

// Extend the User type to include the properties we're using
interface ExtendedUser {
  photoURL?: string;
  name: string;
  email: string;
  createdAt: number | string;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "activities">("info");

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const TabButton: React.FC<TabButtonProps> = ({
    title,
    isActive,
    onPress,
  }) => (
    <Pressable
      onPress={onPress}
      className={`flex-1 py-2 items-center ${
        isActive ? "border-b-2 border-primary" : ""
      }`}
    >
      <Text
        className={`${
          isActive ? "text-primary font-semibold" : "text-gray-500"
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );

  // Type guard to check if user matches our extended type
  const extendedUser = user as ExtendedUser | null;
  return (
    <View className="flex-1 relative">
      {extendedUser ? (
        <>
          {/* Profile Header */}
          <ImageBackground
            source={require("../../assets/yoga/profile_bg.jpg")}
            className="pb-20"
          >
            <View className="items-center pt-8">
              {/* Added outer circle with opacity */}
              <View className="size-36 rounded-full bg-white/30 items-center justify-center">
                <View className="size-28 rounded-full bg-gray-100 items-center justify-center">
                  <Text className="text-4xl text-gray-500">
                    {extendedUser.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>

          {/* Login Form Card - adjusted padding */}
          <View className="bg-gray-50 rounded-t-3xl flex-1 px-6 pt-4 absolute bottom-0 w-full h-[73%] flex flex-col justify-between">
            <View>
              <View className="flex-row justify-between border-b border-gray-200">
                <TabButton
                  title="Personal Information"
                  isActive={activeTab === "info"}
                  onPress={() => setActiveTab("info")}
                />
                <TabButton
                  title="Activities"
                  isActive={activeTab === "activities"}
                  onPress={() => setActiveTab("activities")}
                />
              </View>

              {/* Tab Content */}
              <View className="p-5">
                {activeTab === "info" && (
                  <View className="space-y-4">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-500">Name</Text>
                      <Text>{extendedUser.name}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-500">Email</Text>
                      <Text>{extendedUser.email}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-500">Joined</Text>
                      <Text>
                        {new Date(extendedUser.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                )}

                {activeTab === "activities" && (
                  <View>
                    <Text>Contact information will go here</Text>
                  </View>
                )}
              </View>
            </View>
            {/* Tab Navigation */}
            <Pressable
              onPress={handleLogout}
              className="mb-28 bg-[#FF5E5B] py-3 rounded-lg flex-row items-center justify-center gap-3"
            >
              <Feather name="log-out" size={20} color={"white"} />
              <Text className="text-white text-center">Logout</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text className="p-5">Loading profile...</Text>
      )}
    </View>
  );
}
