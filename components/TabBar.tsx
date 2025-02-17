import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBarButton from "./TabBarButton";
import { useState, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { usePathname } from "expo-router";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;
  const pathname = usePathname();

  const onTapperLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  // Update tab position when pathname changes
  useEffect(() => {
    const currentIndex = state.routes.findIndex((route) => {
      if (route.name === "index") {
        // Special handling for home/index route
        return (
          pathname === "/" ||
          pathname === "/(tabs)" ||
          pathname === "/(tabs)/index"
        );
      }
      const routePath = `/(tabs)/${route.name}`;
      return pathname === routePath || pathname === `/${route.name}`;
    });

    if (currentIndex !== -1) {
      tabPositionX.value = withSpring(buttonWidth * currentIndex, {
        duration: 1500,
      });
    }
  }, [pathname, buttonWidth, state.routes]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View onLayout={onTapperLayout} style={styles.tabBar}>
      <Animated.View
        className="absolute bg-primary"
        style={[
          animatedStyle,
          {
            borderRadius: 30,
            marginHorizontal: 12,
            height: dimensions.height - 12,
            width: buttonWidth - 25,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        // Updated isFocused check for home/index route
        const isFocused =
          route.name === "index"
            ? pathname === "/" ||
              pathname === "/(tabs)" ||
              pathname === "/(tabs)/index"
            : pathname === `/(tabs)/${route.name}` ||
              pathname === `/${route.name}`;

        const label =
          typeof options.tabBarLabel === "function"
            ? options.tabBarLabel({
                focused: isFocused,
                color: isFocused ? "#8B85D6" : "#8E8E93",
                position: "below-icon",
                children: route.name,
              })
            : options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 1500,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? "#fff" : "#8E8E93"}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 1,
  },
});
