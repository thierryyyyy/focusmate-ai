import { View } from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import type { AvatarMood } from "@types";

interface AvatarSVGProps {
  mood: AvatarMood;
  size?: number;
}

function Eyes({ mood }: { mood: AvatarMood }) {
  if (mood === "tired") {
    return (
      <>
        <Path d="M30 38 Q35 36 40 38" stroke="#3d1a78" strokeWidth="2.5" fill="none" />
        <Path d="M60 38 Q65 36 70 38" stroke="#3d1a78" strokeWidth="2.5" fill="none" />
      </>
    );
  }
  if (mood === "thinking") {
    return (
      <>
        <Circle cx="35" cy="35" r="4" fill="#3d1a78" />
        <Circle cx="65" cy="35" r="4" fill="#3d1a78" />
        <Circle cx="36" cy="34" r="1.5" fill="white" />
        <Circle cx="66" cy="34" r="1.5" fill="white" />
      </>
    );
  }
  if (mood === "sad") {
    return (
      <>
        <Circle cx="35" cy="37" r="4" fill="#3d1a78" />
        <Circle cx="65" cy="37" r="4" fill="#3d1a78" />
        <Path d="M30 33 Q35 31 40 33" stroke="#3d1a78" strokeWidth="2" fill="none" />
        <Path d="M60 33 Q65 31 70 33" stroke="#3d1a78" strokeWidth="2" fill="none" />
      </>
    );
  }
  return (
    <>
      <Circle cx="35" cy="36" r="4.5" fill="#3d1a78" />
      <Circle cx="65" cy="36" r="4.5" fill="#3d1a78" />
      <Circle cx="36.5" cy="34.5" r="2" fill="white" />
      <Circle cx="66.5" cy="34.5" r="2" fill="white" />
    </>
  );
}

function Mouth({ mood }: { mood: AvatarMood }) {
  if (mood === "happy" || mood === "proud") {
    return <Path d="M35 52 Q50 62 65 52" stroke="#3d1a78" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
  if (mood === "tired") {
    return <Path d="M38 55 Q50 52 62 55" stroke="#3d1a78" strokeWidth="2" fill="none" strokeLinecap="round" />;
  }
  if (mood === "thinking") {
    return <Ellipse cx="52" cy="54" rx="4" ry="3" fill="#3d1a78" />;
  }
  if (mood === "sad") {
    return <Path d="M35 56 Q50 48 65 56" stroke="#3d1a78" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
  return <Path d="M40 54 L60 54" stroke="#3d1a78" strokeWidth="2" strokeLinecap="round" />;
}

function Blush({ mood }: { mood: AvatarMood }) {
  if (mood === "happy" || mood === "proud") {
    return (
      <>
        <Circle cx="22" cy="44" r="5" fill="#ff9999" opacity={0.4} />
        <Circle cx="78" cy="44" r="5" fill="#ff9999" opacity={0.4} />
      </>
    );
  }
  return null;
}

function Accessory({ mood }: { mood: AvatarMood }) {
  if (mood === "proud") {
    return (
      <Path d="M30 18 L50 6 L70 18 L50 14 Z" fill="#ffd54f" stroke="#ffb300" strokeWidth="1" />
    );
  }
  if (mood === "tired") {
    return (
      <Path d="M65 14 Q72 10 78 16" stroke="#4dd0e1" strokeWidth="2" fill="none" />
    );
  }
  return null;
}

const BG_COLORS: Record<AvatarMood, string> = {
  happy: "#7c4dff",
  tired: "#5a6c7d",
  thinking: "#4a6fa5",
  proud: "#ffb300",
  sad: "#6b7b8d",
};

export function AvatarSVG({ mood, size = 100 }: AvatarSVGProps) {
  const scale = size / 100;
  const bgColor = BG_COLORS[mood];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="48" fill={bgColor} opacity={0.15} />
        <Circle cx="50" cy="50" r="40" fill={bgColor} opacity={0.3} />
        <Circle cx="50" cy="48" r="32" fill={bgColor} />
        <Accessory mood={mood} />
        <Eyes mood={mood} />
        <Mouth mood={mood} />
        <Blush mood={mood} />
      </Svg>
    </View>
  );
}
