import { View, Text, TouchableOpacity, Modal } from "react-native";

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
  selectedCourses: string[];
  setSelectedCourses: (courses: string[]) => void;
  daysOfWeek: string[];
  courses: string[];
  onApplyFilter: () => void;
  onReset: () => void;
};

export default function FilterModal({
  visible,
  onClose,
  selectedDays,
  setSelectedDays,
  selectedCourses,
  setSelectedCourses,
  daysOfWeek,
  courses,
  onApplyFilter,
  onReset,
}: FilterModalProps) {
  const toggleDay = (day: string) => {
    setSelectedDays(
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day]
    );
  };

  const toggleCourse = (course: string) => {
    setSelectedCourses(
      selectedCourses.includes(course)
        ? selectedCourses.filter((c) => c !== course)
        : [...selectedCourses, course]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="bg-white rounded-t-3xl mt-auto p-6">
          <Text className="text-2xl font-semibold mb-6">Filter</Text>

          {/* Days Section */}
          <View className="mb-6">
            <Text className="text-gray-500 mb-3">Day of Week</Text>
            <View className="flex-row flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedDays.includes(day)
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <Text
                    className={`${
                      selectedDays.includes(day)
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Courses Section */}
          <View className="mb-8">
            <Text className="text-gray-500 mb-3">Course Categories</Text>
            <View className="flex-row flex-wrap gap-2">
              {courses.map((course) => (
                <TouchableOpacity
                  key={course}
                  onPress={() => toggleCourse(course)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCourses.includes(course)
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <Text
                    className={`${
                      selectedCourses.includes(course)
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {course}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onReset}
              className="flex-1 py-3 rounded-lg border border-gray-300"
            >
              <Text className="text-center text-gray-700">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApplyFilter}
              className="flex-1 py-3 rounded-lg bg-primary"
            >
              <Text className="text-center text-white">Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
