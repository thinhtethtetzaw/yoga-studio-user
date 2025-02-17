import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface CourseIconProps {
  color?: string;
  size?: number;
}

export default function CourseIcon({
  color = "#000000",
  size = 24,
}: CourseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M8.947,3c0,-1.657 1.367,-3 3.054,-3s2.946,1.343 2.946,3s-1.26,3 -2.946,3s-3.054,-1.343 -3.054,-3Zm14.89,14.047c-0.302,0.462 -0.921,0.592 -1.384,0.29l-4,-2.615c-0.123,-0.081 -0.227,-0.188 -0.305,-0.313l-1.425,-2.321c-0.202,-0.329 -0.447,-0.625 -0.723,-0.885v7.162l5.059,2.377c0.83,0.47 1.142,1.356 0.812,2.187c-0.264,0.666 -0.952,1.071 -1.669,1.071H11c-0.552,0 -1,-0.448 -1,-1s0.448,-1 1,-1h3.554c1.069,0 1.392,-1.451 0.425,-1.905h0c-0.133,-0.062 -0.278,-0.095 -0.425,-0.095h-3.554c-1.665,0.028 -3,1.335 -3,3h0c0,1 -1,1 -1,1H3.809c-0.72,0 -1.415,-0.403 -1.681,-1.072c-0.329,-0.831 -0.01,-1.72 0.742,-2.149l5.13,-2.414v-7.012c-0.255,0.266 -0.481,0.565 -0.665,0.895l-1.461,2.623c-0.079,0.141 -0.191,0.262 -0.326,0.35l-4,2.615c-0.169,0.11 -0.359,0.163 -0.546,0.163c-0.326,0 -0.646,-0.159 -0.838,-0.453c-0.302,-0.462 -0.172,-1.082 0.29,-1.384l3.794,-2.48l1.341,-2.407c1.126,-2.022 3.259,-3.276 5.574,-3.276h1.83c2.217,0 4.276,1.151 5.436,3.041l1.308,2.129l3.812,2.493c0.462,0.302 0.592,0.922 0.29,1.384Z"
      />
    </Svg>
  );
}
