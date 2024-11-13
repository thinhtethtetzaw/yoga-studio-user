import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface ProfileIconProps {
  color?: string;
  size?: number;
}

export default function ProfileIcon({
  color = "#000000",
  size = 24,
}: ProfileIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"
      />
    </Svg>
  );
}
