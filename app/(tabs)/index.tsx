import { View, Text, SafeAreaView } from "react-native";
import RoomCarousel from "@/components/RoomCarousel";

export default function HomeScreen() {
  const carouselItems = [
    {
      id: "1",
      image: require("@/assets/yoga/profile_bg.jpg"),
      title: "Living Room",
      subtitle: "5 Devices",
    },
    {
      id: "2",
      image: require("@/assets/yoga/profile_bg.jpg"),
      title: "Bedroom",
      subtitle: "3 Devices",
    },
    {
      id: "3",
      image: require("@/assets/yoga/profile_bg.jpg"),
      title: "Kitchen",
      subtitle: "4 Devices",
    },
  ];

  const handleRoomPress = (item: { title: string }) => {
    console.log("Room pressed:", item.title);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold">Hello, User!</Text>
          <Text className="text-gray-600">Welcome back</Text>
        </View>

        <View>
          <Text className="px-6 pb-4 text-lg font-semibold">Rooms List</Text>
          <RoomCarousel items={carouselItems} onItemPress={handleRoomPress} />
        </View>
      </View>
    </SafeAreaView>
  );
}
