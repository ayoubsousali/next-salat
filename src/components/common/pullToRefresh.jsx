import { useEffect, useState } from "react";
import Spinner from "./spinner";

const PullToRefresh = ({ thresholdDistance = 50 }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(null);

  useEffect(() => {
    const handleTouchStart = (event) => {
      setStartY(event.touches[0].clientY);
    };

    const handleTouchMove = (event) => {
      const distance = event.touches[0].clientY - startY;
      if (distance >= thresholdDistance) {
        setIsRefreshing(true);
        window.location.reload();
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
  }, [startY, thresholdDistance]);

  return isRefreshing ? <Spinner /> : null;
};

export default PullToRefresh;
