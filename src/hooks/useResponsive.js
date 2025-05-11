import { useState, useEffect } from 'react';

/**
 * Hook để xử lý responsive và trả về giá trị tương ứng với breakpoint
 * @param {Object} breakpoints - Các giá trị cho từng breakpoint
 * @returns {any} Giá trị tương ứng với breakpoint hiện tại
 */
const useResponsive = (breakpoints = {
  mobile: { value: null, maxWidth: 767 },
  tablet: { value: null, maxWidth: 1023 },
  desktop: { value: null, maxWidth: Infinity }
}) => {
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Tìm breakpoint phù hợp nhất
      const sortedBreakpoints = Object.entries(breakpoints)
        .sort((a, b) => a[1].maxWidth - b[1].maxWidth);
      
      for (const [, { value, maxWidth }] of sortedBreakpoints) {
        if (width <= maxWidth) {
          setCurrentValue(value);
          break;
        }
      }
    };

    // Chạy lần đầu để thiết lập giá trị ban đầu
    handleResize();

    // Thêm event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return currentValue;
};

export default useResponsive;
