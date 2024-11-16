import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useCart } from "../context/CartContext";
import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "@/FirebaseConfig";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

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

      // Create bookings for all cart items
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
        <Text className="text-lg font-semibold ml-2">Checkout</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {cartItems.map((item) => (
          <View
            key={item.classId}
            className="bg-white p-4 rounded-lg mb-3 shadow-sm"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="font-semibold text-lg">{item.className}</Text>
                <Text className="text-gray-600">{item.courseName}</Text>
                <Text className="text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text className="text-primary font-semibold mt-2">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeFromCart(item.classId)}
                className="p-2"
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View className="bg-white p-4 rounded-lg mt-4">
          <Text className="text-lg font-semibold">Total</Text>
          <Text className="text-2xl font-bold text-primary">
            ${total.toFixed(2)}
          </Text>
        </View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCheckout}
          className="bg-primary py-3 rounded-lg"
          disabled={cartItems.length === 0}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Confirm Booking
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
