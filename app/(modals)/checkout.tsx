import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useCart } from "../context/CartContext";
import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function CheckoutScreen() {
  const { cartItems, clearCart, removeFromCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      if (!user || !user.id) {
        Alert.alert("Error", "Please login first");
        return;
      }

      const bookingPromises = cartItems.map(async (item) => {
        const bookingData = {
          classId: item.classId,
          className: item.className,
          courseId: item.courseId,
          courseName: item.courseName,
          date: item.date,
          instructorName: item.instructorName,
          userId: user.id,
          userName: user.name || "",
          userEmail: user.email || "",
          bookingTime: serverTimestamp(),
          status: "confirmed",
          price: item.price,
        };

        const bookingRef = ref(db, `bookings/${user.id}/${item.classId}`);
        return set(bookingRef, bookingData);
      });

      await Promise.all(bookingPromises);

      clearCart();
      Alert.alert("Success", "Booking confirmed!", [
        { text: "OK", onPress: () => router.push("/(tabs)/class") },
      ]);
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("Error", "Failed to process checkout");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold ml-2">Your Cart</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {cartItems.map((item) => (
          <View
            key={item.classId}
            className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
          >
            <LinearGradient
              colors={["#FFFFFF", "#f1f5f9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="p-4">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-bold text-xl text-gray-600 mb-3">
                        {item.className}
                      </Text>
                      <View className="bg-primary/10 self-start px-3 py-1 rounded-full mb-3">
                        <Text className="text-primary font-medium">
                          {item.courseName}
                        </Text>
                      </View>
                    </View>

                    <View className="flex flex-col gap-2">
                      <View className="flex-row items-center gap-2">
                        <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                          <Ionicons name="calendar" size={16} color="#4B5563" />
                        </View>
                        <Text className="text-gray-600">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-2">
                        <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                          <Ionicons name="person" size={16} color="#4B5563" />
                        </View>
                        <Text className="text-gray-600 flex-1">
                          {item.instructorName}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-2">
                        <View className="size-10 bg-primary/10 rounded-full items-center justify-center">
                          <Ionicons name="pricetag" size={16} color="#4B5563" />
                        </View>
                        <Text className="text-gray-600 font-bold text-lg">
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.classId)}
                        className="mt-5 bg-red-50 p-2 px-4 rounded-full flex-row items-center justify-center gap-2"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#EF4444"
                        />
                        <Text className="text-red-500 font-bold">Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        ))}

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600 text-lg mb-2">Total Amount</Text>
          <Text className="text-3xl font-bold text-primary">
            ${total.toFixed(2)}
          </Text>
        </View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCheckout}
          className={`py-4 rounded-xl ${
            cartItems.length === 0 ? "bg-gray-300" : "bg-primary"
          }`}
          disabled={cartItems.length === 0}
        >
          <Text className="text-white text-center font-bold text-lg">
            {cartItems.length === 0 ? "Cart is Empty" : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
