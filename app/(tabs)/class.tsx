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
import { Feather, Ionicons } from "@expo/vector-icons";
import FilterModal from "@/components/FilterModal";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

type Class = {
  id: number;
  comment: string;
  courseId: number;
  courseName: string;
  date: string;
  instructorName: string;
  name: string;
  pricePerClass?: number;
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
  const { addToCart, isInCart, cartItems, removeFromCart } = useCart();
  const { user } = useAuth();
  const { search } = useLocalSearchParams<{ search: string }>();

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
        const dbRef = ref(db);
        const [classesSnapshot, coursesSnapshot] = await Promise.all([
          get(child(dbRef, "classes")),
          get(child(dbRef, "courses")),
        ]);

        if (classesSnapshot.exists() && coursesSnapshot.exists()) {
          const classesData = classesSnapshot.val();
          const coursesData = coursesSnapshot.val();

          const classesArray = Object.entries(classesData).map(([_, value]) => {
            const classItem = value as Class;
            const matchingCourse = Object.values(coursesData).find(
              (course: any) => course.id === classItem.courseId
            ) as { pricePerClass?: number } | undefined;

            return {
              ...classItem,
              pricePerClass: matchingCourse?.pricePerClass,
            };
          });

          setClasses(classesArray);

          if (search) {
            setSearchQuery(search);
          }
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
  }, [search]);

  const handleAddToCart = (classItem: Class) => {
    addToCart({
      classId: classItem.id,
      className: classItem.name,
      courseName: classItem.courseName,
      courseId: classItem.courseId,
      date: classItem.date,
      instructorName: classItem.instructorName,
      price: classItem.pricePerClass || 0,
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
            <TouchableOpacity
              key={classItem.id}
              className="w-full bg-white rounded-xl mb-4 shadow-md overflow-hidden"
              disabled={
                isInCart(classItem.id) || bookedClasses.includes(classItem.id)
              }
            >
              <LinearGradient
                colors={["#FFFFFF", "#869de9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 5, y: 1 }}
              >
                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 mr-3">
                      <Text
                        className="text-gray-800 font-bold text-xl"
                        numberOfLines={1}
                      >
                        {classItem.name}
                      </Text>
                    </View>
                    <View className="bg-primary/10 px-3 py-1.5 rounded-full">
                      <Text className="text-primary text-sm font-medium">
                        {classItem.courseName}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <View className="flex-row items-center gap-2 mb-2">
                      <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#4B5563"
                        />
                      </View>
                      <Text className="text-gray-600 flex-1">
                        {classItem.date}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2 mb-2">
                      <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                        <Ionicons
                          name="person-outline"
                          size={16}
                          color="#4B5563"
                        />
                      </View>
                      <Text className="text-gray-600 flex-1">
                        {classItem.instructorName}
                      </Text>
                    </View>

                    {classItem.pricePerClass && (
                      <View className="flex-row items-center gap-2 mb-2">
                        <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                          <Ionicons
                            name="pricetag-outline"
                            size={16}
                            color="#4B5563"
                          />
                        </View>
                        <Text className="text-gray-600 flex-1">
                          ${classItem.pricePerClass}
                        </Text>
                      </View>
                    )}

                    {classItem.comment && (
                      <View className="mb-3 pb-3 border-b border-gray-300">
                        <Text className="text-gray-500 text-sm leading-relaxed">
                          comment: {classItem.comment}
                        </Text>
                      </View>
                    )}

                    <View className="mt-1">
                      {bookedClasses.includes(classItem.id) ? (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            removeFromCart(classItem.id);
                          }}
                          className="flex-row items-center justify-center gap-2"
                        >
                          <Ionicons
                            name="checkmark-done-outline"
                            size={20}
                            color="#4A6C6F"
                          />
                          <Text className="text-secondary font-medium">
                            Booked
                          </Text>
                        </TouchableOpacity>
                      ) : isInCart(classItem.id) ? (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            removeFromCart(classItem.id);
                          }}
                          className="flex-row items-center justify-center gap-2"
                        >
                          <Ionicons
                            name="remove-circle-outline"
                            size={20}
                            color="#f87171"
                          />
                          <Text className="text-red-400 font-medium">
                            Remove from Cart
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddToCart(classItem);
                          }}
                          className="flex-row items-center justify-center gap-2"
                        >
                          <Ionicons
                            name="cart-outline"
                            size={20}
                            color="#8B85D6"
                          />
                          <Text className="text-primary font-medium text-center">
                            Tap to Add to Cart
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
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
          className="absolute bottom-28 right-7 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
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
