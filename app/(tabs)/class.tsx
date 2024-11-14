import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { ref, get, child, set } from "firebase/database";
import { db } from "@/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "@/components/FilterModal";
import { useRouter } from "expo-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

type Class = {
  id: number;
  comment: string;
  courseId: number;
  courseName: string;
  date: string;
  instructorName: string;
  name: string;
  price: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [tempSelectedDays, setTempSelectedDays] = useState<string[]>([]);
  const [tempSelectedCourses, setTempSelectedCourses] = useState<string[]>([]);
  const router = useRouter();
  const { addToCart, isInCart, cartItems } = useCart();
  const { user } = useAuth();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const uniqueCourses = Array.from(new Set(classes.map((c) => c.courseName)));

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.instructorName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesDays =
      selectedDays.length === 0 ||
      selectedDays.includes(
        new Date(classItem.date).toLocaleDateString("en-US", {
          weekday: "long",
        })
      );

    const matchesCourses =
      selectedCourses.length === 0 ||
      selectedCourses.includes(classItem.courseName);

    return matchesSearch && matchesDays && matchesCourses;
  });

  const handleOpenFilter = () => {
    setTempSelectedDays(selectedDays);
    setTempSelectedCourses(selectedCourses);
    setIsFilterModalVisible(true);
  };

  const handleApplyFilter = () => {
    setSelectedDays(tempSelectedDays);
    setSelectedCourses(tempSelectedCourses);
    setIsFilterModalVisible(false);
  };

  const handleResetFilter = () => {
    setTempSelectedDays([]);
    setTempSelectedCourses([]);
    setSelectedDays([]);
    setSelectedCourses([]);
    setIsFilterModalVisible(false);
  };

  const renderFilters = () => {
    const activeFilters = selectedDays.length + selectedCourses.length;

    return (
      <View className="mb-4 flex-row items-center gap-2">
        <TextInput
          className="flex-1 bg-white p-3 rounded-lg border border-gray-200"
          placeholder="Search by class or instructor name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View>
          <TouchableOpacity
            onPress={handleOpenFilter}
            className="p-3 bg-white rounded-lg border border-gray-200"
          >
            <Ionicons
              name="filter"
              size={24}
              color={activeFilters > 0 ? "#6366f1" : "#666"}
            />
          </TouchableOpacity>
          {activeFilters > 0 && (
            <View className="absolute -top-2 -right-2 bg-primary w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFilters}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

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

  const handleAddToCart = (classItem: Class) => {
    addToCart({
      classId: classItem.id,
      className: classItem.name,
      courseName: classItem.courseName,
      courseId: classItem.courseId,
      date: classItem.date,
      instructorName: classItem.instructorName,
      price: classItem.price || 0,
    });
  };

  useEffect(() => {
    const loadBookedClasses = async () => {
      try {
        if (user?.id) {
          const bookingsRef = ref(db, `bookings/${user.id}`);
          const snapshot = await get(bookingsRef);

          if (snapshot.exists()) {
            const bookingsData = snapshot.val();
            const bookingIds = Object.keys(bookingsData).map(Number);
            setBookedClasses(bookingIds);
          } else {
            setBookedClasses([]);
          }
        }
      } catch (err) {
        console.error("Error loading booked classes:", err);
        setBookedClasses([]);
      }
    };

    loadBookedClasses();
  }, [user, cartItems]);

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
        {renderFilters()}

        {filteredClasses.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500">No classes found</Text>
          </View>
        ) : (
          filteredClasses.map((classItem) => (
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

              {/* Add to Cart Button */}
              <View className="mt-4">
                {bookedClasses.includes(classItem.id) ? (
                  <View className="py-2 px-4 rounded-lg bg-green-500">
                    <Text className="text-center font-medium text-white">
                      Booked
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleAddToCart(classItem)}
                    disabled={isInCart(classItem.id)}
                    className={`py-2 px-4 rounded-lg ${
                      isInCart(classItem.id) ? "bg-gray-300" : "bg-primary"
                    }`}
                  >
                    <Text className={`text-center font-medium text-white`}>
                      {isInCart(classItem.id) ? "In Cart" : "Add to Cart"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        selectedDays={tempSelectedDays}
        setSelectedDays={setTempSelectedDays}
        selectedCourses={tempSelectedCourses}
        setSelectedCourses={setTempSelectedCourses}
        daysOfWeek={daysOfWeek}
        courses={uniqueCourses}
        onApplyFilter={handleApplyFilter}
        onReset={handleResetFilter}
      />

      {cartItems.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/checkout")}
          className="absolute bottom-24 right-4 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <View>
            <Ionicons name="cart-outline" size={24} color="white" />
            <View className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {cartItems.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
