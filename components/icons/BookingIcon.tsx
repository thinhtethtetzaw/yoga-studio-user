import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface BookingIconProps {
  color?: string;
  size?: number;
}

export default function BookingIcon({
  color = "#111111",
  size = 24,
}: BookingIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M20.5,13.375C20.914,13.375 21.25,13.711 21.25,14.125V16.18C21.25,17.548 21.25,18.65 21.134,19.517C21.013,20.417 20.754,21.175 20.152,21.777C19.55,22.379 18.792,22.638 17.892,22.759C17.025,22.875 15.923,22.875 14.555,22.875H9.445C8.077,22.875 6.975,22.875 6.108,22.759C5.208,22.638 4.45,22.379 3.848,21.777C3.246,21.175 2.987,20.417 2.866,19.517C2.75,18.65 2.75,17.548 2.75,16.18V14.125C2.75,13.711 3.086,13.375 3.5,13.375C3.914,13.375 4.25,13.711 4.25,14.125V16.125C4.25,17.56 4.252,18.562 4.353,19.317C4.452,20.051 4.632,20.439 4.909,20.716C5.186,20.993 5.574,21.173 6.308,21.272C7.063,21.374 8.064,21.375 9.5,21.375H14.5C15.935,21.375 16.937,21.374 17.692,21.272C18.426,21.173 18.814,20.993 19.091,20.716C19.368,20.439 19.548,20.051 19.647,19.317C19.748,18.562 19.75,17.56 19.75,16.125V14.125C19.75,13.711 20.086,13.375 20.5,13.375Z"
      />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M14.555,2.375H9.445C8.077,2.375 6.975,2.375 6.108,2.492C5.208,2.613 4.45,2.872 3.848,3.474C3.246,4.076 2.987,4.834 2.866,5.734C2.75,6.601 2.75,7.703 2.75,9.071V13.181C2.75,14.548 2.75,15.65 2.866,16.518C2.987,17.418 3.246,18.176 3.848,18.778C4.45,19.38 5.208,19.639 6.108,19.76C6.975,19.876 8.077,19.876 9.445,19.876H14.555C15.923,19.876 17.025,19.876 17.892,19.76C18.792,19.639 19.55,19.38 20.152,18.778C20.754,18.176 21.013,17.418 21.134,16.518C21.25,15.65 21.25,14.548 21.25,13.181V9.071C21.25,7.703 21.25,6.601 21.134,5.734C21.013,4.834 20.754,4.076 20.152,3.474C19.55,2.872 18.792,2.613 17.892,2.492C17.025,2.375 15.923,2.375 14.555,2.375ZM8,9.375C7.586,9.375 7.25,9.711 7.25,10.125C7.25,10.539 7.586,10.875 8,10.875H16C16.414,10.875 16.75,10.539 16.75,10.125C16.75,9.711 16.414,9.375 16,9.375H8ZM8,14.375C7.586,14.375 7.25,14.711 7.25,15.125C7.25,15.539 7.586,15.875 8,15.875H12C12.414,15.875 12.75,15.539 12.75,15.125C12.75,14.711 12.414,14.375 12,14.375H8Z"
      />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M7,1.125C7.552,1.125 8,1.573 8,2.125V4.125C8,4.677 7.552,5.125 7,5.125C6.448,5.125 6,4.677 6,4.125V2.125C6,1.573 6.448,1.125 7,1.125ZM12,1.125C12.552,1.125 13,1.573 13,2.125V4.125C13,4.677 12.552,5.125 12,5.125C11.448,5.125 11,4.677 11,4.125V2.125C11,1.573 11.448,1.125 12,1.125ZM17,1.125C17.552,1.125 18,1.573 18,2.125V4.125C18,4.677 17.552,5.125 17,5.125C16.448,5.125 16,4.677 16,4.125V2.125C16,1.573 16.448,1.125 17,1.125Z"
      />
    </Svg>
  );
}
