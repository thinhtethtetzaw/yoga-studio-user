import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";

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
    <View className="flex-1 bg-white pb-20">
      <View className="bg-white px-4 py-3 shadow-sm">
        <Text className="text-2xl font-bold text-primary">
          Available Courses
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {courses.map((course) => (
          <View
            key={course.id}
            className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100"
          >
            <Text className="text-lg font-semibold text-primary">
              {course.courseName}
            </Text>
            <Text className="text-gray-600 mt-1">{course.description}</Text>

            <View className="flex-row mt-3 flex-wrap">
              <View className="bg-gray-50 px-3 py-1 rounded-full">
                <Text className="text-gray-500">{course.duration} mins</Text>
              </View>
              <View className="bg-gray-50 px-3 py-1 rounded-full ml-2">
                <Text className="text-gray-500">{course.difficultyLevel}</Text>
              </View>
              <View className="bg-gray-50 px-3 py-1 rounded-full ml-2">
                <Text className="text-gray-500">{course.typeOfClass}</Text>
              </View>
            </View>

            <View className="mt-3 bg-gray-50 p-3 rounded-lg">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500">Schedule:</Text>
                <Text className="text-gray-700 font-medium">
                  {course.timeOfCourse}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-gray-500">Days:</Text>
                <Text className="text-gray-700 font-medium">
                  {course.daysOfWeek}
                </Text>
              </View>
            </View>

            <View className="mt-3 flex-row justify-between items-center">
              <View className="bg-primary/10 px-3 py-1 rounded-full">
                <Text className="text-primary font-medium">
                  {course.capacity} spots available
                </Text>
              </View>
              <Text className="text-primary font-bold text-lg">
                ${course.pricePerClass}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
