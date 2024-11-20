import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import ProfileIcon from "@/components/icons/ProfileIcon";
import { Toast } from "@/components/Toast";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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

type BookedClass = {
  classId: number;
  className: string;
  courseName: string;
  courseId: number;
  date: string;
  instructorName: string;
  price: number;
  pricePerClass?: number;
  status: string;
  bookingTime: string;
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "activities">("info");
  const [bookedClasses, setBookedClasses] = useState<BookedClass[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookedClasses = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const dbRef = ref(db);
        const [bookingsSnapshot, coursesSnapshot] = await Promise.all([
          get(child(dbRef, `bookings/${user.id}`)),
          get(child(dbRef, "courses")),
        ]);

        if (bookingsSnapshot.exists()) {
          const bookingsData = bookingsSnapshot.val();
          const coursesData = coursesSnapshot.exists()
            ? coursesSnapshot.val()
            : {};

          const bookingsArray = Object.values(bookingsData).map(
            (booking: any) => {
              const matchingCourse = Object.values(coursesData).find(
                (course: any) => course.id === booking.courseId
              ) as { pricePerClass?: number } | undefined;

              return {
                ...booking,
                pricePerClass: matchingCourse?.pricePerClass || booking.price,
              };
            }
          );

          setBookedClasses(bookingsArray as BookedClass[]);
        }
      } catch (error) {
        console.error("Error fetching booked classes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "activities") {
      fetchBookedClasses();
    }
  }, [user?.id, activeTab]);

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
    <View className="flex-1 relative bg-[#B5A6F4]">
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
            <View className="pb-36">
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
                    <Pressable
                      onPress={handleLogout}
                      className="mt-36 bg-[#FF5E5B] py-3 rounded-lg flex-row items-center justify-center gap-3"
                    >
                      <Feather name="log-out" size={20} color={"white"} />
                      <Text className="text-white text-center">Logout</Text>
                    </Pressable>
                  </View>
                )}

                {activeTab === "activities" && (
                  <ScrollView className="flex flex-col gap-4">
                    {loading ? (
                      <ActivityIndicator size="large" color="#6366f1" />
                    ) : bookedClasses.length > 0 ? (
                      bookedClasses.map((booking, index) => (
                        <View
                          key={index}
                          className="w-full bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
                        >
                          <LinearGradient
                            colors={["#FFFFFF", "#869de9"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 6, y: 5 }}
                          >
                            <View>
                              {/* Header with name and course tag */}
                              <View className="flex-row justify-between items-start mb-3 p-4">
                                <View className="flex-1 mr-3">
                                  <Text
                                    className="text-gray-800 font-bold text-xl"
                                    numberOfLines={1}
                                  >
                                    {booking.className}
                                  </Text>
                                </View>
                                <View className="bg-primary/10 px-3 py-1.5 rounded-full">
                                  <Text className="text-primary text-sm font-medium">
                                    {booking.courseName}
                                  </Text>
                                </View>
                              </View>

                              {/* Info rows with improved spacing and icons */}
                              <View>
                                <View className="flex-row items-center gap-2 mb-2 px-4">
                                  <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                                    <Ionicons
                                      name="calendar-outline"
                                      size={16}
                                      color="#4B5563"
                                    />
                                  </View>
                                  <Text className="text-gray-600 flex-1">
                                    {new Date(booking.date).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )}
                                  </Text>
                                </View>

                                <View className="flex-row items-center gap-2 mb-2 px-4">
                                  <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                                    <Ionicons
                                      name="person-outline"
                                      size={16}
                                      color="#4B5563"
                                    />
                                  </View>
                                  <Text className="text-gray-600 flex-1">
                                    {booking.instructorName}
                                  </Text>
                                </View>

                                {/* Price row */}
                                <View className="flex-row items-center gap-2 mb-2 px-4">
                                  <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                                    <Ionicons
                                      name="pricetag-outline"
                                      size={16}
                                      color="#4B5563"
                                    />
                                  </View>
                                  <Text className="text-gray-600 flex-1">
                                    £{booking.pricePerClass || booking.price}
                                  </Text>
                                </View>

                                {/* Status row */}
                                <View className="flex-row items-center gap-2 px-4">
                                  <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                                    <Ionicons
                                      name="checkmark-circle-outline"
                                      size={16}
                                      color="#4B5563"
                                    />
                                  </View>
                                  <Text className="text-gray-600 flex-1capitalize">
                                    {booking.status}
                                  </Text>
                                </View>

                                {/* Booking time */}
                                <View className="mt-3 pt-3 border-t border-gray-200 px-4 pb-4">
                                  <Text className="text-gray-500 text-sm">
                                    Booked on:{" "}
                                    {new Date(
                                      booking.bookingTime
                                    ).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}{" "}
                                    at{" "}
                                    {new Date(
                                      booking.bookingTime
                                    ).toLocaleTimeString("en-GB", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </LinearGradient>
                        </View>
                      ))
                    ) : (
                      <Text className="text-gray-500 text-center">
                        No booked classes found
                      </Text>
                    )}
                  </ScrollView>
                )}
              </View>
            </View>
            {/* Tab Navigation */}
          </View>
        </>
      ) : (
        <Text className="p-5">Loading profile...</Text>
      )}
    </View>
  );
}
