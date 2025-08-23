// src/components/LessonPlayer.tsx
import React, { useRef, useState } from "react";
import type { Lesson, VideoPlayerState, LessonProgress } from "../../types/Lesson";
import ReactMarkdown from "react-markdown";

interface LessonPlayerProps {
  lesson: Lesson;
  progress: LessonProgress | null;
  onProgressUpdate: (progress: LessonProgress) => void;
  onNextLesson: () => void;
  onPrevLesson: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  progress,
  onProgressUpdate,
  onNextLesson,
  onPrevLesson,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoPlayerState>({
    playing: false,
    currentTime: progress?.lastWatched || 0,
    duration: lesson.duration,
  });

  const handlePlay = () => {
    setState((s) => ({ ...s, playing: true }));
    videoRef.current?.play();
  };

  const handlePause = () => {
    setState((s) => ({ ...s, playing: false }));
    videoRef.current?.pause();
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setState((s) => ({ ...s, currentTime: time }));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration || lesson.duration;
      const progressPercent = Math.round((currentTime / duration) * 100);

      setState((s) => ({ ...s, currentTime, duration }));

      onProgressUpdate({
        lessonId: lesson.id,
        completed: progressPercent >= 95,
        progress: progressPercent,
        lastWatched: currentTime,
      });
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-4">
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full rounded-lg shadow"
        src={lesson.videoUrl}
        onTimeUpdate={handleTimeUpdate}
        controls
        preload="metadata"
      />

      {/* Controls */}
      <div className="flex justify-between items-center">
        <button onClick={handlePlay} className="px-4 py-2 bg-green-500 text-white rounded-lg">
          Play
        </button>
        <button onClick={handlePause} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Pause
        </button>
        <button onClick={() => handleSeek(0)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Restart
        </button>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${progress?.progress || 0}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">
        Progress: {progress?.progress || 0}%
      </p>

      {/* Notes */}
      {lesson.notes && (
        <div className="prose max-w-none p-4 bg-gray-50 rounded-lg">
          <ReactMarkdown>{lesson.notes}</ReactMarkdown>
        </div>
      )}

      {/* Lesson Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onPrevLesson}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Previous Lesson
        </button>
        <button
          onClick={onNextLesson}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Next Lesson
        </button>
      </div>
    </div>
  );
};

export default LessonPlayer;
