"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== "undefined" ? window.innerWidth : 2000,
    height: typeof window !== "undefined" ? window.innerHeight : 2000,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to ensure the size is correct after mounting

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
function WelcomingEffect({ duration = 3000 }: { duration?: number }) {
  const { width, height } = useWindowSize();
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRunning(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return isRunning ? <Confetti width={width} height={height} /> : <></>;
}

export default WelcomingEffect;
