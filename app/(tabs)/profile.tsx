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
import ProfileIcon from "@/components/icons/ProfileIcon";
import { Toast } from "@/components/Toast";

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
              <View className="py-8">
                {activeTab === "info" && (
                  <View className="flex flex-col gap-8">
                    <View className="flex-row items-center gap-2.5">
                      <ProfileIcon size={24} color="gray" />
                      <Text className="text-gray-500 font-medium">
                        {extendedUser.name}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-3 px-1">
                      <Feather name="mail" size={20} color="gray" />
                      <Text>{extendedUser.email}</Text>
                    </View>
                    <View className="flex-row  items-center gap-3 px-1">
                      <Feather name="calendar" size={20} color="gray" />
                      <Text>
                        Joined at:{" "}
                        {new Date(extendedUser.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </Text>
                    </View>
                  </View>
                )}

                {activeTab === "activities" && (
                  <View>
                    <Text>Joined class information will go here</Text>
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
