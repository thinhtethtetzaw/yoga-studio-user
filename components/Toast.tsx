import { useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onHide: () => void;
};

export const Toast = ({ message, type = "success", onHide }: ToastProps) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, []);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          containerBg: "#F0FDF4",
          borderColor: "#8B85D6",
          iconName: "checkmark-circle-outline" as const,
          iconColor: "#8B85D6",
          textColor: "#374151",
        };
      case "error":
        return {
          containerBg: "#FEE2E2",
          borderColor: "#DC2626",
          iconName: "close-circle-outline" as const,
          iconColor: "#DC2626",
          textColor: "#374151",
        };
      default:
        return {
          containerBg: "#F0FDF4",
          borderColor: "#8B85D6",
          iconName: "checkmark-circle-outline" as const,
          iconColor: "#8B85D6",
          textColor: "#374151",
        };
    }
  };

  const toastStyle = getToastStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          backgroundColor: toastStyle.containerBg,
        },
      ]}
    >
      <View
        style={[styles.borderLeft, { backgroundColor: toastStyle.borderColor }]}
      />
      <View style={styles.content}>
        <Ionicons
          name={toastStyle.iconName}
          size={24}
          color={toastStyle.iconColor}
        />
        <Text style={[styles.message, { color: toastStyle.textColor }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 8,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 50,
    overflow: "hidden",
  },
  borderLeft: {
    width: 4,
    height: "100%",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  message: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});
