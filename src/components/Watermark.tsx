import { useWatermark } from '@/hooks/useWatermark';

interface WatermarkProps {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  rotate?: number;
}

export const Watermark = ({ text, fontSize = 16, color = '#1677ff', opacity = 0.15, rotate = -30 }: WatermarkProps) => {
  const containerRef = useWatermark({ text, fontSize, color, opacity, rotate });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};
