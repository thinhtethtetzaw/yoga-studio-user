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
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, []);

  const icon = type === "success" ? "checkmark-circle" : "alert-circle";
  const bgColor = type === "success" ? "#10B981" : "#EF4444";

  return (
    <Animated.View
      style={[styles.container, { opacity, backgroundColor: bgColor }]}
    >
      <Ionicons name={icon} size={24} color="white" />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    color: "white",
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});
