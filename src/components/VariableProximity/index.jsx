import React, { forwardRef, useMemo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./VariableProximity.css";

function useAnimationFrame(callback) {
  // Safe window check for SSR
  const isClient = typeof window !== 'undefined';
  
  useEffect(() => {
    if (!isClient) return;
    
    let frameId;
    const loop = () => {
      try {
        callback();
      } catch (error) {
        console.error("Animation frame error:", error);
      }
      frameId = requestAnimationFrame(loop);
    };
    
    frameId = requestAnimationFrame(loop);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [callback, isClient]);
}

function useMousePositionRef(containerRef) {
  const positionRef = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  // Safe window check for SSR
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    if (!isClient) return;
    
    setIsMounted(true);
    return () => setIsMounted(false);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !isMounted) return;
    
    const updatePosition = (x, y) => {
      try {
        if (containerRef?.current) {
          const rect = containerRef.current.getBoundingClientRect();
          positionRef.current = { x: x - rect.left, y: y - rect.top };
        } else {
          positionRef.current = { x, y };
        }
      } catch (error) {
        console.error("Position update error:", error);
        // Fail silently
      }
    };

    const handleMouseMove = (ev) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev) => {
      if (ev.touches && ev.touches[0]) {
        const touch = ev.touches[0];
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef, isMounted, isClient]);

  return positionRef;
}

const VariableProximity = forwardRef((props, ref) => {
  const {
    label,
    fromFontVariationSettings = "'wght' 300",
    toFontVariationSettings = "'wght' 700",
    containerRef,
    radius = 50,
    falloff = "linear",
    className = "",
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef([]);
  const interpolatedSettingsRef = useRef([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef({ x: null, y: null });
  const [isReady, setIsReady] = useState(false);
  
  // Safe window check for SSR
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    if (!isClient) return;
    
    // Set component as ready after initial render
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [isClient]);

  const parsedSettings = useMemo(() => {
    try {
      const parseSettings = (settingsStr) =>
        new Map(
          settingsStr.split(",")
            .map(s => s.trim())
            .map(s => {
              const [name, value] = s.split(" ");
              return [name.replace(/['"]/g, ""), parseFloat(value)];
            })
        );

      const fromSettings = parseSettings(fromFontVariationSettings);
      const toSettings = parseSettings(toFontVariationSettings);

      return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
        axis,
        fromValue,
        toValue: toSettings.get(axis) ?? fromValue,
      }));
    } catch (error) {
      console.error("Error parsing font settings:", error);
      // Return fallback settings in case of parsing error
      return [{ axis: 'wght', fromValue: 300, toValue: 700 }];
    }
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1, y1, x2, y2) => {
    try {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    } catch (error) {
      console.error("Error calculating distance:", error);
      return Infinity; // Return large distance on error
    }
  };

  const calculateFalloff = (distance) => {
    try {
      const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
      switch (falloff) {
        case "exponential": return norm ** 2;
        case "gaussian": return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        case "linear":
        default: return norm;
      }
    } catch (error) {
      console.error("Error calculating falloff:", error);
      return 0; // Return no effect on error
    }
  };

  useAnimationFrame(() => {
    if (!isClient || !isReady || !containerRef?.current) return;
    
    try {
      const containerRect = containerRef.current.getBoundingClientRect();
      const { x, y } = mousePositionRef.current;
      
      // Skip processing if mouse position hasn't changed
      if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
        return;
      }
      lastPositionRef.current = { x, y };

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;

        try {
          const rect = letterRef.getBoundingClientRect();
          const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
          const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

          const distance = calculateDistance(
            mousePositionRef.current.x,
            mousePositionRef.current.y,
            letterCenterX,
            letterCenterY
          );

          if (distance >= radius) {
            letterRef.style.fontVariationSettings = fromFontVariationSettings;
            return;
          }

          const falloffValue = calculateFalloff(distance);
          const newSettings = parsedSettings
            .map(({ axis, fromValue, toValue }) => {
              const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
              return `'${axis}' ${interpolatedValue}`;
            })
            .join(", ");

          interpolatedSettingsRef.current[index] = newSettings;
          letterRef.style.fontVariationSettings = newSettings;
        } catch (error) {
          console.error("Letter processing error:", error);
          // Continue with next letter
        }
      });
    } catch (error) {
      console.error("Animation frame execution error:", error);
      // Fail silently
    }
  });

  // If not client side, render plain text
  if (!isClient) {
    return (
      <span 
        className={`${className}`}
        style={{ ...style }}
        {...restProps}
      >
        {label}
      </span>
    );
  }

  // Split text into words and letters
  const words = label ? label.split(" ") : [];
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`${className} variable-proximity`}
      onClick={onClick}
      style={{ display: "inline", ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {word.split("").map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={(el) => { letterRefs.current[currentLetterIndex] = el; }}
                style={{
                  display: "inline-block",
                  fontVariationSettings: fromFontVariationSettings,
                }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span style={{ display: "inline-block" }}>&nbsp;</span>
          )}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = "VariableProximity";
export default VariableProximity;
