import React, { useRef, useState, useEffect } from 'react';
import { VideoData } from '../utils/api';

interface VideoPlayerProps {
  video: VideoData;
  onVideoEnd: () => void;
  onError: (error: Error) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onVideoEnd, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoEl = videoRef.current;
    
    const playVideo = async () => {
      try {
        setIsLoading(true);
        videoEl.src = video.video;
        await videoEl.play();
        if (isMounted.current) {
          setIsLoading(false);
        }
      } catch (error: any) {
        if (isMounted.current && error.name !== 'AbortError') {
          console.error('Error playing video:', error);
          onError(error);
        }
      }
    };
    
    playVideo();
  }, [video, onError]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error: any) => {
          if (error.name !== 'AbortError') {
            console.error('Error playing video:', error);
            onError(error);
          }
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    onVideoEnd();
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const error = (e.target as HTMLVideoElement).error;
    console.error('Video error:', error);
    onError(new Error(error?.message || '视频播放失败'));
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        onLoadedData={handleLoadedData}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={handlePlayPause}
      >
        {!isLoading && (
          <div className="bg-black bg-opacity-50 rounded-full p-4 transition-transform hover:scale-110">
            {isPlaying ? (
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
        <span>{video.category}</span>
      </div>
    </div>
  );
};

export default VideoPlayer;