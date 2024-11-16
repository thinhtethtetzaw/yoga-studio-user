import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

type Course = {
  capacity: number;
  courseName: string;
  daysOfWeek: string;
  description: string;
  difficultyLevel: string;
  duration: number;
  id: number;
  pricePerClass: number;
  timeOfCourse: string;
  typeOfClass: string;
};

export default function CourseScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = ref(db);
        const snapshot = await get(child(coursesRef, "courses"));

        if (snapshot.exists()) {
          const coursesData = snapshot.val();
          // Convert the object to an array
          const coursesArray = Object.entries(coursesData).map(
            ([key, value]) => ({
              ...(value as Course),
            })
          );
          setCourses(coursesArray);
        } else {
          setError("No courses found");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pb-20">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            onPress={() =>
              router.push({
                pathname: "/class",
                params: { courseId: course.id },
              })
            }
            className="w-full bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
          >
            <LinearGradient
              colors={["#FFFFFF", "#13F6AB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 20, y: 15 }}
            >
              <View>
                <View className="flex-row justify-between items-start mb-3 p-4">
                  <View className="flex-1 mr-3">
                    <Text className="text-gray-800 font-bold text-xl mb-2">
                      {course.courseName}
                    </Text>
                  </View>
                  <View className="bg-[#09eca0]/10 px-3 py-1.5 rounded-full">
                    <Text className="text-[#07C586] text-sm font-medium">
                      {course.typeOfClass}
                    </Text>
                  </View>
                </View>

                <View className="flex flex-col gap-3">
                  <View className="flex-row items-center gap-2 px-4">
                    <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                      <Ionicons name="time-outline" size={16} color="#4B5563" />
                    </View>
                    <Text className="text-gray-600 flex-1">
                      {course.duration} minutes
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2 px-4">
                    <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#4B5563"
                      />
                    </View>
                    <Text className="text-gray-600 flex-1">
                      {course.daysOfWeek} | {course.timeOfCourse}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2 px-4">
                    <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                      <Ionicons
                        name="barbell-outline"
                        size={16}
                        color="#4B5563"
                      />
                    </View>
                    <Text className="text-gray-600 flex-1">
                      {course.difficultyLevel} Level
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2 px-4">
                    <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                      <Ionicons
                        name="people-outline"
                        size={16}
                        color="#4B5563"
                      />
                    </View>
                    <Text className="text-gray-600 flex-1">
                      {course.capacity} spots available
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2 px-4 border-b border-gray-200 pb-4">
                    <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                      <Ionicons
                        name="pricetag-outline"
                        size={16}
                        color="#4B5563"
                      />
                    </View>
                    <Text className="text-gray-600 flex-1">
                      ${course.pricePerClass} per class
                    </Text>
                  </View>
                  <Text className="text-gray-600 mb-4 leading-relaxed px-4">
                    {course.description}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
