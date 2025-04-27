"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/RotatingText.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RotatingText = forwardRef((props, ref) => {
  const {
    texts = ["Text 1", "Text 2"],
    transition = {
      type: "spring",
      damping: 20,
      stiffness: 250,
      mass: 0.5,
      duration: 0.5,
    },
    initial = {
      y: 30,
      opacity: 0,
      scale: 0.95,
    },
    animate = {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit = {
      y: -30,
      opacity: 0,
      scale: 0.95,
    },
    animatePresenceMode = "wait",
    animatePresenceInitial = true,
    rotationInterval = 3000,
    staggerDuration = 0.015,
    staggerFrom = "center",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Client-side only check
  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  const splitIntoCharacters = useCallback((text) => {
    try {
      if (typeof text !== "string") {
        return [""];
      }

      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        try {
          const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
          return Array.from(segmenter.segment(text), (segment) => segment.segment);
        } catch (error) {
          console.error("Segmenter failed:", error);
          // Fallback if segmenter fails
          return Array.from(text);
        }
      }
      return Array.from(text);
    } catch (error) {
      console.error("Error splitting text:", error);
      return [""]; // Fallback to prevent further errors
    }
  }, []);

  const elements = useMemo(() => {
    try {
      if (!isClient || !texts || !texts.length) {
        return [];
      }

      const safeIndex = Math.min(currentTextIndex, texts.length - 1);
      const currentText = texts[safeIndex] || "";

      if (splitBy === "characters") {
        const words = currentText.split(" ");
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }
      if (splitBy === "words") {
        return currentText.split(" ").map((word, i, arr) => ({
          characters: [word],
          needsSpace: i !== arr.length - 1,
        }));
      }
      if (splitBy === "lines") {
        return currentText.split("\n").map((line, i, arr) => ({
          characters: [line],
          needsSpace: i !== arr.length - 1,
        }));
      }
      // For a custom separator
      return currentText.split(splitBy).map((part, i, arr) => ({
        characters: [part],
        needsSpace: i !== arr.length - 1,
      }));
    } catch (error) {
      console.error("Error creating elements:", error);
      setError(error);
      return [];
    }
  }, [texts, currentTextIndex, splitBy, splitIntoCharacters, isClient]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      try {
        if (!isClient) return 0;

        const total = totalChars;
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
        if (staggerFrom === "center") {
          const center = Math.floor(total / 2);
          return Math.abs(center - index) * staggerDuration;
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * total);
          return Math.abs(randomIndex - index) * staggerDuration;
        }
        if (typeof staggerFrom === "number") {
          return Math.abs(staggerFrom - index) * staggerDuration;
        }
        return 0;
      } catch (error) {
        console.error("Error calculating stagger delay:", error);
        return 0;
      }
    },
    [staggerFrom, staggerDuration, isClient]
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      try {
        if (!isClient) return;

        setCurrentTextIndex(newIndex);
        if (onNext) onNext(newIndex);
      } catch (error) {
        console.error("Error changing index:", error);
      }
    },
    [onNext, isClient]
  );

  const next = useCallback(() => {
    try {
      if (!isClient || !texts || !texts.length) return;

      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;
      if (nextIndex !== currentTextIndex) {
        handleIndexChange(nextIndex);
      }
    } catch (error) {
      console.error("Error in next function:", error);
    }
  }, [currentTextIndex, texts, loop, handleIndexChange, isClient]);

  const previous = useCallback(() => {
    try {
      if (!isClient || !texts || !texts.length) return;

      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;
      if (prevIndex !== currentTextIndex) {
        handleIndexChange(prevIndex);
      }
    } catch (error) {
      console.error("Error in previous function:", error);
    }
  }, [currentTextIndex, texts, loop, handleIndexChange, isClient]);

  const jumpTo = useCallback(
    (index) => {
      try {
        if (!isClient || !texts || !texts.length) return;

        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) {
          handleIndexChange(validIndex);
        }
      } catch (error) {
        console.error("Error in jumpTo function:", error);
      }
    },
    [texts, currentTextIndex, handleIndexChange, isClient]
  );

  const reset = useCallback(() => {
    try {
      if (!isClient) return;

      if (currentTextIndex !== 0) {
        handleIndexChange(0);
      }
    } catch (error) {
      console.error("Error in reset function:", error);
    }
  }, [currentTextIndex, handleIndexChange, isClient]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset,
    }),
    [next, previous, jumpTo, reset]
  );

  useEffect(() => {
    try {
      if (!isClient || !auto || error) return;

      const intervalId = setInterval(next, rotationInterval);
      return () => clearInterval(intervalId);
    } catch (err) {
      console.error("Error setting up interval:", err);
    }
  }, [next, rotationInterval, auto, isClient, error]);

  // If we're not on the client side or if there's an error, render a simple fallback
  if (!isClient || error) {
    return (
      <span className={cn("text-rotate", mainClassName)} {...rest}>
        {texts && texts.length > 0 ? texts[0] : "Text"}
      </span>
    );
  }

  // Calculate total characters for proper staggering
  const getTotalCharacters = () => {
    try {
      return elements.reduce((sum, word) => sum + word.characters.length, 0);
    } catch (error) {
      console.error("Error calculating total characters:", error);
      return 0;
    }
  };

  return (
    <motion.span
      className={cn("text-rotate", mainClassName)}
      {...rest}
      layout
      transition={transition}
    >
      <span className="text-rotate-sr-only">
        {texts && texts.length > 0 ? texts[currentTextIndex] : ""}
      </span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.div
          key={currentTextIndex}
          className={cn(
            splitBy === "lines" ? "text-rotate-lines" : "text-rotate"
          )}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          {elements.map((wordObj, wordIndex, array) => {
            try {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);

              return (
                <span
                  key={wordIndex}
                  className={cn("text-rotate-word", splitLevelClassName)}
                >
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(
                          previousCharsCount + charIndex,
                          getTotalCharacters()
                        ),
                      }}
                      className={cn("text-rotate-element", elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordObj.needsSpace && (
                    <span className="text-rotate-space"> </span>
                  )}
                </span>
              );
            } catch (error) {
              console.error("Error rendering word:", error);
              return null;
            }
          })}
        </motion.div>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText;
