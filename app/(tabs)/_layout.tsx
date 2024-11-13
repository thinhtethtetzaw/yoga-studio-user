import { Tabs } from "expo-router";
import { Redirect } from "expo-router";
import { useAuth } from "./../context/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import CourseIcon from "../../components/icons/CourseIcon";
import BookingIcon from "@/components/icons/BookingIcon";
import ProfileIcon from "../../components/icons/ProfileIcon";
import { TabBar } from "@/components/TabBar";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: "Course",
          tabBarIcon: ({ color, size }) => (
            <BookingIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="class"
        options={{
          title: "Class",
          tabBarIcon: ({ color, size }) => (
            <CourseIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
