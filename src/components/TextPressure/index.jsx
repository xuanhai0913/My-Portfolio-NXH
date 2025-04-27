import React, { useEffect, useRef, useState } from 'react';

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Inter',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',

  minFontSize = 24,

}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  const dist = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Initialize mouse near center of container if it exists
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = () => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  };

  useEffect(() => {
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
    // eslint-disable-next-line
  }, [scale, text]);

  useEffect(() => {
    let rafId;
    const smoothing = 0.15; // Điều chỉnh độ mượt
    const maxDistance = 300; // Khoảng cách tối đa để hiệu ứng hoạt động

    const animate = () => {
      const dx = (cursorRef.current.x - mouseRef.current.x) * smoothing;
      const dy = (cursorRef.current.y - mouseRef.current.y) * smoothing;
      
      mouseRef.current.x += dx;
      mouseRef.current.y += dy;

      if (titleRef.current) {
        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);
          const normalizedDist = Math.min(d / maxDistance, 1);
          const factor = 1 - normalizedDist;

          // Mượt hơn với easing function
          const ease = t => t * t * (3 - 2 * t);
          const eased = ease(factor);

          const wdth = width ? Math.floor(100 + eased * 100) : 100;
          const wght = weight ? Math.floor(400 + eased * 500) : 400;
          const italVal = italic ? (eased * 0.6).toFixed(2) : 0;
          const alphaVal = alpha ? (0.4 + eased * 0.6).toFixed(2) : 1;

          // Áp dụng transform để tối ưu performance
          span.style.transform = `scale(${1 + eased * 0.1})`;
          span.style.opacity = alphaVal;
          span.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`;
          if (italic) span.style.fontStyle = `italic ${italVal}`;

          // Thêm transition cho mượt
          span.style.transition = 'transform 0.1s ease-out';
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha]);

  const dynamicClassName = [className, flex ? 'flex' : '', stroke ? 'stroke' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
        overflow: 'visible',
        zIndex: 1,
      }}
    >
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-display: swap;
        }

        .text-pressure-title span {
          display: inline-block;
          will-change: transform, opacity, font-variation-settings;
          backface-visibility: hidden;
          transform: translateZ(0);
          perspective: 1000px;
        }

        .flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }

        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke: 2px ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
          position: relative;
          z-index: 2;
        }
      `}</style>

      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : textColor
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
