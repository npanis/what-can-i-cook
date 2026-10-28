import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color: string;
}

export function CloseIcon({ size = 14, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
      <Path d="M3 3l8 8M11 3l-8 8" />
    </Svg>
  );
}

export function PlusIcon({ size = 12, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
      <Path d="M6 1.5v9M1.5 6h9" />
    </Svg>
  );
}

export function ArrowRightIcon({ size = 18, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9h12M10 4l5 5-5 5" />
    </Svg>
  );
}

export function ArrowLeftIcon({ size = 20, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 10H4M9 5l-5 5 5 5" />
    </Svg>
  );
}

export function CheckIcon({ size = 18, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3.5 9.5l3.5 3.5 7.5-8" />
    </Svg>
  );
}

export function MinusIcon({ size = 16, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M3 8h10" />
    </Svg>
  );
}

export function PlusLargeIcon({ size = 16, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M3 8h10M8 3v10" />
    </Svg>
  );
}
