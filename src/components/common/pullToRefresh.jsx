import { useEffect, useState } from "react";

const PullToRefresh = ({ onRefresh, thresholdDistance = 70 }) => {
  const [startY, setStartY] = useState(null);

  useEffect(() => {
    const handleTouchStart = (event) => {
      setStartY(event.touches[0].clientY);
    };

    const handleTouchMove = (event) => {
      const distance = event.touches[0].clientY - startY;
      if (distance >= thresholdDistance) {
        onRefresh();
      }
    };

    const handleTouchEnd = () => {
      setStartY(null);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startY, thresholdDistance, onRefresh]);

  return null;
};

export default PullToRefresh;
