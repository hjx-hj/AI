import { useEffect, useRef } from 'react';

interface WatermarkOptions {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  rotate?: number;
}

export const useWatermark = (options: WatermarkOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { text, fontSize = 16, color = '#1677ff', opacity = 0.15, rotate = -30 } = options;

    const width = 240;
    const height = 160;
    canvas.width = width;
    canvas.height = height;

    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);

    const base64Url = canvas.toDataURL();
    containerRef.current.style.backgroundImage = `url(${base64Url})`;
    containerRef.current.style.backgroundSize = `${width}px ${height}px`;
    containerRef.current.style.backgroundRepeat = 'repeat';

    return () => {
      if (containerRef.current) {
        containerRef.current.style.backgroundImage = '';
        containerRef.current.style.backgroundSize = '';
        containerRef.current.style.backgroundRepeat = '';
      }
    };
  }, [options]);

  return containerRef;
};
