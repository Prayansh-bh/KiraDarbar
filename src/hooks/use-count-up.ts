"use client";

import { useEffect, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useRef } from "react";

interface UseCountUpProps {
  from: number;
  to: number;
  duration?: number;
  isFloat?: boolean;
  prefix?: string;
  suffix?: string;
  once?: boolean;
}

export function useCountUp({
  from,
  to,
  duration = 1.5,
  isFloat = false,
  prefix = "",
  suffix = "",
  once = true,
}: UseCountUpProps) {
  const [count, setCount] = useState<string>(`${prefix}${from}${suffix}`);
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          const formatted = isFloat 
            ? value.toFixed(1) 
            : Math.floor(value).toLocaleString("en-IN");
          setCount(`${prefix}${formatted}${suffix}`);
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, isInView, isFloat, prefix, suffix]);

  return { ref, count };
}
