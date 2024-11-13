import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";

type Class = {
  id: number;
  comment: string;
  courseId: number;
  courseName: string;
  date: string;
  instructorName: string;
  name: string;
};

export default function ClassScreen() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesRef = ref(db);
        const snapshot = await get(child(classesRef, "classes"));

        if (snapshot.exists()) {
          const classesData = snapshot.val();
          const classesArray = Object.entries(classesData).map(
            ([key, value]) => ({
              ...(value as Class),
            })
          );
          setClasses(classesArray);
        } else {
          setError("No classes found");
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
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
    <View className="flex-1 bg-white">
      <View className="bg-white px-4 py-3 shadow-sm">
        <Text className="text-2xl font-bold text-primary">
          Upcoming Classes
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {classes.map((classItem) => (
          <View
            key={classItem.id}
            className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100"
          >
            {/* Class Name and Course Name */}
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-primary">
                {classItem.name}
              </Text>
              <View className="bg-primary/10 px-3 py-1 rounded-full">
                <Text className="text-primary font-medium">
                  {classItem.courseName}
                </Text>
              </View>
            </View>

            {/* Date and Instructor */}
            <View className="mt-3 bg-gray-50 p-3 rounded-lg">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500">Date:</Text>
                <Text className="text-gray-700 font-medium">
                  {new Date(classItem.date).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-gray-500">Instructor:</Text>
                <Text className="text-gray-700 font-medium">
                  {classItem.instructorName}
                </Text>
              </View>
            </View>

            {/* Comment */}
            {classItem.comment && (
              <View className="mt-2">
                <Text className="text-gray-600 italic">
                  "{classItem.comment}"
                </Text>
              </View>
            )}

            {/* Course ID Reference */}
            <View className="mt-2">
              <Text className="text-gray-400 text-sm">
                Course ID: {classItem.courseId}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
