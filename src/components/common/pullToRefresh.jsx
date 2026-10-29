import { useEffect, useRef } from "react";

export default function PullToRefresh({ onRefresh, thresholdDistance = 80 }) {
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    let startX = null;
    let startY = null;
    let active = false;

    const reset = () => {
      startX = null;
      startY = null;
      active = false;
    };

    const onTouchStart = (event) => {
      reset();
      if (
        event.touches.length !== 1 ||
        window.scrollY > 0 ||
        document.querySelector('[role="dialog"]') ||
        event.target.closest?.('button, a, input, textarea, select, [role="tablist"]')
      ) return;

      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      active = true;
    };

    const onTouchMove = (event) => {
      if (!active) return;
      if (event.touches.length !== 1 || window.scrollY > 0) {
        reset();
        return;
      }
      const dx = event.touches[0].clientX - startX;
      const dy = event.touches[0].clientY - startY;
      if (dy < -10 || (Math.abs(dx) > 12 && Math.abs(dx) > dy * 1.2)) {
        reset();
      } else if (dy >= thresholdDistance && dy > Math.abs(dx) * 1.3) {
        reset();
        onRefreshRef.current();
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", reset);
    window.addEventListener("touchcancel", reset);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", reset);
      window.removeEventListener("touchcancel", reset);
    };
  }, [thresholdDistance]);

  return null;
}
