"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function CongratsCard() {
  useEffect(() => {
    // Fireworks burst every second for 3 seconds
    const duration = 500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 60,
        spread: 1000,
        startVelocity: 80,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2, // shoot from top
        }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);
}
