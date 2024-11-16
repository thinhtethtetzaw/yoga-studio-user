import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

interface CarouselItem {
  id: string;
  image: any;
  course: string;
  "class-quantity": string;
}

interface RoomCarouselProps {
  items: CarouselItem[];
  onItemPress?: (item: CarouselItem) => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_GAP = 16;
const CARD_WITH_SPACING = CARD_WIDTH + CARD_GAP;
const ACTIVE_SCALE = 1.05;
const CARD_HEIGHT = 200;

export default function RoomCarousel({
  items,
  onItemPress,
}: RoomCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Create an extended array with duplicates for smooth infinite scroll
  const extendedItems = [...items, ...items];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WITH_SPACING);
    const normalizedIndex = index % items.length;
    setActiveIndex(normalizedIndex);

    // Check if we need to reset position
    if (scrollPosition >= CARD_WITH_SPACING * items.length) {
      scrollViewRef.current?.scrollTo({
        x: scrollPosition - CARD_WITH_SPACING * items.length,
        animated: false,
      });
    }
  };

  const scrollToNextItem = () => {
    if (!scrollViewRef.current) return;
    const nextIndex = activeIndex + 1;
    scrollViewRef.current.scrollTo({
      x: nextIndex * CARD_WITH_SPACING,
      animated: true,
    });
  };

  useEffect(() => {
    let interval: number;

    if (isAutoScrolling) {
      interval = setInterval(scrollToNextItem, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoScrolling, activeIndex]);

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WITH_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 24 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={() => setIsAutoScrolling(false)}
        onMomentumScrollEnd={() => setIsAutoScrolling(true)}
      >
        {extendedItems.map((item, index) => {
          const isActive = index % items.length === activeIndex;
          return (
            <View
              key={`${item.id}-${index}`}
              style={[styles.cardContainer, { marginRight: CARD_GAP }]}
            >
              <Pressable
                onPress={() => onItemPress?.(item)}
                style={[
                  styles.card,
                  {
                    transform: [{ scale: isActive ? ACTIVE_SCALE : 1 }],
                  },
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/30">
                  <Text className="text-white text-xl font-semibold">
                    {item.course}
                  </Text>
                  <Text className="text-white/90">
                    {item["class-quantity"]}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT * ACTIVE_SCALE,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#8B85D6",
    width: 9,
    height: 9,
    borderRadius: 6,
  },
});
