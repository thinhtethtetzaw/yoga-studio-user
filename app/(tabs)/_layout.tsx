import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { useAuth } from "./../context/AuthContext";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

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
