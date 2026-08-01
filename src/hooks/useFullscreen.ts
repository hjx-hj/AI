import { useState, useEffect, useCallback } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggle = useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, [isFullscreen]);

  const enter = useCallback(() => {
    document.documentElement.requestFullscreen?.();
  }, []);

  const exit = useCallback(() => {
    document.exitFullscreen?.();
  }, []);

  return { isFullscreen, toggle, enter, exit };
};