import { useState, useEffect } from 'react';

const COLORS = ['indigo', 'emerald', 'violet'];

export const useThemeColor = () => {
  const [color, setColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('themeColor') || 'indigo';
    }
    return 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('themeColor', color);
  }, [color]);

  const cycleColor = () => {
    const currentIndex = COLORS.indexOf(color);
    const nextColor = COLORS[(currentIndex + 1) % COLORS.length];
    setColor(nextColor);
  };

  return { color, cycleColor };
};
