import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { ref, get, child, set } from "firebase/database";
import { db } from "@/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Class = {
  id: number;
  comment: string;
  courseId: number;
  courseName: string;
  date: string;
  instructorName: string;
  name: string;
};

type BookingData = {
  classId: number;
  userId: string;
  userName: string;
  bookingDate: string;
  className: string;
  courseName: string;
};

export default function ClassScreen() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedClasses, setBookedClasses] = useState<number[]>([]);

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

  const handleBookClass = async (classItem: Class) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const userName = await AsyncStorage.getItem("userName");

      if (!userId) {
        setError("Please login first");
        return;
      }

      if (!userName) {
        setError("User information not found");
        return;
      }

      const bookingData: BookingData = {
        classId: classItem.id,
        userId,
        userName,
        bookingDate: new Date().toISOString(),
        className: classItem.name,
        courseName: classItem.courseName,
      };

      const bookingRef = ref(db, `bookings/${userId}/${classItem.id}`);
      await set(bookingRef, bookingData);

      const storedBookings = await AsyncStorage.getItem(
        `bookedClasses_${userId}`
      );
      const bookings = storedBookings ? JSON.parse(storedBookings) : [];
      const updatedBookings = [...bookings, classItem.id];
      await AsyncStorage.setItem(
        `bookedClasses_${userId}`,
        JSON.stringify(updatedBookings)
      );

      setBookedClasses(updatedBookings);
    } catch (err) {
      console.error("Error booking class:", err);
      setError("Failed to book class");
    }
  };

  useEffect(() => {
    const loadBookedClasses = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const bookingsRef = ref(db, `bookings/${userId}`);
          const snapshot = await get(bookingsRef);

          if (snapshot.exists()) {
            const bookingsData = snapshot.val();
            const bookingIds = Object.keys(bookingsData).map(Number);

            await AsyncStorage.setItem(
              `bookedClasses_${userId}`,
              JSON.stringify(bookingIds)
            );
            setBookedClasses(bookingIds);
          } else {
            const storedBookings = await AsyncStorage.getItem(
              `bookedClasses_${userId}`
            );
            if (storedBookings) {
              setBookedClasses(JSON.parse(storedBookings));
            } else {
              setBookedClasses([]);
            }
          }
        } else {
          setBookedClasses([]);
        }
      } catch (err) {
        console.error("Error loading booked classes:", err);
        setBookedClasses([]);
      }
    };

    loadBookedClasses();
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

            {/* Add Book Button */}
            <View className="mt-4">
              <TouchableOpacity
                onPress={() => handleBookClass(classItem)}
                disabled={bookedClasses.includes(classItem.id)}
                className={`py-2 px-4 rounded-lg ${
                  bookedClasses.includes(classItem.id)
                    ? "bg-gray-300"
                    : "bg-primary"
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    bookedClasses.includes(classItem.id)
                      ? "text-gray-600"
                      : "text-white"
                  }`}
                >
                  {bookedClasses.includes(classItem.id) ? "Booked" : "Book Now"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
