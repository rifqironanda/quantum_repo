import { useRef } from 'react';

export default function useSwipe(onStep) {
  const start = useRef(null);
  return {
    onTouchStart(event) {
      start.current = event.touches.length === 1 ? event.touches[0] : null;
    },
    onTouchCancel() { start.current = null; },
    onTouchEnd(event) {
      if (!start.current) return;
      const end = event.changedTouches[0];
      const dx = end.clientX - start.current.clientX;
      const dy = end.clientY - start.current.clientY;
      start.current = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > 1.4 * Math.abs(dy)) onStep(dx < 0 ? 1 : -1);
    },
  };
}
