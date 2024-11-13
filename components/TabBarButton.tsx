import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import CourseIcon from "./icons/CourseIcon";
import BookingIcon from "./icons/BookingIcon";
import ProfileIcon from "./icons/ProfileIcon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: React.ReactNode;
}) {
  const scale = useSharedValue(0);
  type IconNames = "index" | "course" | "class" | "profile";
  const icons: Record<IconNames, (props: { color: string }) => JSX.Element> = {
    index: (props) => <Feather name="home" size={22} {...props} />,
    course: (props) => <CourseIcon size={24} {...props} />,
    class: (props) => <BookingIcon size={24} {...props} />,
    profile: (props) => <ProfileIcon size={24} {...props} />,
  };
  const IconComponent = icons[routeName as IconNames];

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [0.9, 1]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      <Animated.View style={animatedIconStyle}>
        {IconComponent && (
          <IconComponent color={isFocused ? "#fff" : "#8E8E93"} />
        )}
      </Animated.View>
      <Animated.Text
        style={[
          { color: isFocused ? "#8B85D6" : "#8E8E93" },
          animatedTextStyle,
        ]}
        className="text-sm"
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
