"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  containerClassName?: string;
  colors?: number[][];
  opacities?: number[];
  dotSize?: number;
}

export const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  animationSpeed = 0.4,
  containerClassName,
  colors = [[255, 255, 255]],
  opacities = [0.3],
  dotSize = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += animationSpeed;
      
      const cols = Math.floor(canvas.width / (dotSize * 4));
      const rows = Math.floor(canvas.height / (dotSize * 4));
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * dotSize * 4;
          const y = j * dotSize * 4;
          
          const colorIndex = Math.floor(Math.random() * colors.length);
          const opacityIndex = Math.floor(Math.random() * opacities.length);
          
          const [r, g, b] = colors[colorIndex];
          const opacity = opacities[opacityIndex] * (0.5 + 0.5 * Math.sin(time + i * 0.1 + j * 0.1));
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fillRect(x, y, dotSize, dotSize);
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [animationSpeed, colors, opacities, dotSize]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", containerClassName)}
    />
  );
};
