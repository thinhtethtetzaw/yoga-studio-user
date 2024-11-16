import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import RoomCarousel from "@/components/RoomCarousel";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ref, get, child } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import CourseIcon from "@/components/icons/CourseIcon";
import { useCart } from "../context/CartContext";

type SearchResult = {
  id: number;
  name: string;
  courseName: string;
};

type CarouselItem = {
  id: string;
  image: any;
  course: string;
  "class-quantity": string;
};

type ClassCard = {
  comment: string;
  courseId: number;
  courseName: string;
  date: string;
  id: number;
  instructorName: string;
  name: string;
  pricePerClass?: number;
};

const carouselImages = {
  1: require("@/assets/yoga/slider-1.jpg"),
  2: require("@/assets/yoga/slider-2.jpg"),
  3: require("@/assets/yoga/slider-3.jpg"),
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [classes, setClasses] = useState<SearchResult[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([
    {
      id: "1",
      image: require("@/assets/yoga/slider-1.jpg"),
      course: "Loading...",
      "class-quantity": "Loading...",
    },
  ]);
  const [featuredClasses, setFeaturedClasses] = useState<ClassCard[]>([]);
  const { isInCart, removeFromCart } = useCart();

  // Fetch classes when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesRef = ref(db);
        const snapshot = await get(child(classesRef, "classes"));
        if (snapshot.exists()) {
          const classesData = snapshot.val();
          const classesArray = Object.entries(classesData).map(
            ([_, value]: [string, any]) => ({
              id: value.id,
              name: value.name,
              courseName: value.courseName,
            })
          );
          setClasses(classesArray);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchClasses();
  }, []);

  // Add this new useEffect to fetch carousel data
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const coursesRef = ref(db);
        const snapshot = await get(child(coursesRef, "courses"));
        if (snapshot.exists()) {
          const coursesData = snapshot.val();
          const carouselData = Object.entries(coursesData).map(
            ([key, value]: [string, any], index) => ({
              id: key,
              image:
                carouselImages[
                  ((index % 3) + 1) as keyof typeof carouselImages
                ],
              course: value.courseName,
              "class-quantity": `${value.duration} mins`,
            })
          );
          setCarouselItems(carouselData);
        }
      } catch (err) {
        console.error("Error fetching carousel data:", err);
      }
    };

    fetchCarouselData();
  }, []);

  // Add this new useEffect after existing useEffects
  useEffect(() => {
    const fetchFeaturedClasses = async () => {
      try {
        const dbRef = ref(db);
        // Fetch both classes and courses
        const [classesSnapshot, coursesSnapshot] = await Promise.all([
          get(child(dbRef, "classes")),
          get(child(dbRef, "courses")),
        ]);

        if (classesSnapshot.exists() && coursesSnapshot.exists()) {
          const classesData = classesSnapshot.val();
          const coursesData = coursesSnapshot.val();

          // Map through classes and add price from corresponding course
          const classesArray = Object.values(classesData)
            .map((classItem: any) => {
              // Find matching course using courseId
              const matchingCourse = Object.values(coursesData).find(
                (course: any) => course.id === classItem.courseId
              ) as { pricePerClass?: number } | undefined;

              return {
                ...classItem,
                pricePerClass: matchingCourse?.pricePerClass,
              };
            })
            .slice(0, 4); // Get first 4 classes

          setFeaturedClasses(classesArray as ClassCard[]);
        }
      } catch (err) {
        console.error("Error fetching featured classes:", err);
      }
    };

    fetchFeaturedClasses();
  }, []);

  // Update handleRoomPress to navigate to the course screen
  const handleRoomPress = (item: CarouselItem) => {
    router.push({
      pathname: "/course",
      params: { id: item.id },
    });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length >= 2) {
      const filtered = classes.filter(
        (item) =>
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.courseName.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleResultPress = (result: SearchResult) => {
    router.push({
      pathname: "/class",
      params: { search: result.name },
    });
    setShowDropdown(false);
    setSearchQuery("");
  };

  console.log(featuredClasses);

  return (
    <SafeAreaView className="flex-1 bg-white pt-10 pb-28">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          <View className="px-6 py-4">
            <Text className="text-3xl text-gray-600">
              Hello, <Text className="font-bold">{user?.name}</Text>
            </Text>
            <Text className="text-gray-600 mt-1">
              Let's stretch, breathe, and grow today!
            </Text>
          </View>

          <View>
            <RoomCarousel items={carouselItems} onItemPress={handleRoomPress} />
          </View>
          <View className="px-6 mt-4 relative">
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="Search classes or courses..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {/* Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <View className="absolute top-full left-6 right-6 bg-white mt-1 rounded-lg shadow-lg z-50 max-h-60">
                <ScrollView bounces={false}>
                  {searchResults.map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      onPress={() => handleResultPress(result)}
                      className="p-4 border-b border-gray-100"
                    >
                      <Text className="font-medium">{result.name}</Text>
                      <Text className="text-sm text-gray-500">
                        {result.courseName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* New Featured Classes Section */}
          <View className="px-6 mt-4">
            <Text className="text-2xl font-bold text-gray-600 mb-4">
              Featured Classes
            </Text>
            <View>
              {featuredClasses.map((classItem) => (
                <TouchableOpacity
                  key={classItem.id}
                  className="w-full bg-white rounded-xl mb-4 shadow-md overflow-hidden"
                  onPress={() =>
                    router.push({
                      pathname: "/course",
                      params: { id: classItem.id },
                    })
                  }
                >
                  <LinearGradient
                    colors={["#FFFFFF", "#869de9"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 5, y: 1 }}
                  >
                    <View className="p-4">
                      {/* Header with name and course tag */}
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

                      {/* Info rows with improved spacing and icons */}
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

                        {/* Add price row */}
                        {classItem.pricePerClass && (
                          <View className="flex-row items-center gap-2">
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

                        {/* Add status section */}
                        {isInCart(classItem.id) && (
                          <View className="mt-3 pt-3 border-t border-gray-100">
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                removeFromCart(classItem.id);
                              }}
                              className="flex-row items-center justify-center gap-2 py-2"
                            >
                              <Ionicons
                                name="remove-circle-outline"
                                size={20}
                                color="#EF4444"
                              />
                              <Text className="text-red-500 font-medium">
                                Remove from Cart
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {/* Comment section */}
                        {classItem.comment && (
                          <View className="mt-3 pt-3 border-t border-gray-100">
                            <Text className="text-gray-500 text-sm leading-relaxed">
                              comment: {classItem.comment}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Subtle arrow indicator */}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
