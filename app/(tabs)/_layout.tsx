import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";

export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Here you should implement proper session management
        // For now, we'll just set it to true after login
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: "Course",
        }}
      />
      <Tabs.Screen
        name="class"
        options={{
          title: "Class",
        }}
      />
    </Tabs>
  );
}
