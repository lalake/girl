import React, { useState, useEffect, useCallback, useRef } from "react";
import VideoPlayer from "./components/VideoPlayer";
import CategorySelector from "./components/CategorySelector";
import { fetchVideo, CategoryType, VideoData } from "./utils/api";

function App() {
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [currentCategory, setCurrentCategory] = useState<CategoryType>("shejie");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const loadVideo = useCallback(async (category: CategoryType) => {
    setIsLoading(true);
    setError(null);
    try {
      const video = await fetchVideo(category);
      setCurrentVideo(video);
    } catch (err) {
      setError("加载视频失败，请重试");
      console.error("Error loading video:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideo(currentCategory);
  }, [currentCategory, loadVideo]);

  const handleCategoryChange = (category: CategoryType) => {
    setCurrentCategory(category);
  };

  const handleVideoEnd = () => {
    loadVideo(currentCategory);
  };

  const handleVideoError = (error: Error) => {
    setError("视频播放失败，请重试");
    console.error("Video error:", error);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchStartY.current - touchEndY.current > swipeThreshold) {
      // 向上滑动，加载下一个视频
      loadVideo(currentCategory);
    } else if (touchEndY.current - touchStartY.current > swipeThreshold) {
      // 向下滑动，也加载下一个视频
      loadVideo(currentCategory);
    }
  };

  return (
    <div className="w-full h-full bg-black relative overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {currentVideo && !isLoading && !error && (
        <div className="transition-opacity duration-300 ease-in-out">
          <VideoPlayer video={currentVideo} onVideoEnd={handleVideoEnd} onError={handleVideoError} />
        </div>
      )}

      <CategorySelector currentCategory={currentCategory} onCategoryChange={handleCategoryChange} />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="absolute bottom-20 text-white text-lg">加载中...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <p className="text-white text-lg mb-4">{error}</p>
          <button onClick={() => loadVideo(currentCategory)} className="bg-white text-black px-4 py-2 rounded-full font-bold transition-transform hover:scale-105 active:scale-95">
            重试
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
