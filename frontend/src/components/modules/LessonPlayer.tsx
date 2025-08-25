// src/components/LessonPlayer.tsx

import React, { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa"; // Imported icons for the player controls and download button
import type {
    Lesson,
    VideoPlayerState,
    LessonProgress,
} from "../../types/Lesson";

interface LessonPlayerProps {
    lesson: Lesson;
    progress: LessonProgress | null;
    onProgressUpdate: (progress: LessonProgress) => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({
    lesson,
    progress,
    onProgressUpdate,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [state, setState] = useState<VideoPlayerState>({
        playing: false,
        currentTime: progress?.lastWatched || 0,
        duration: lesson.duration,
    });

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = progress?.lastWatched || 0;
        }
    }, [lesson.id]);

    const handlePlayPause = () => {
        if (state.playing) {
            videoRef.current?.pause();
            setState((s) => ({ ...s, playing: false }));
        } else {
            videoRef.current?.play();
            setState((s) => ({ ...s, playing: true }));
        }
    };

    const handleSeek = (e: React.MouseEvent) => {
        const video = videoRef.current;
        if (video) {
            const progressBar = e.currentTarget as HTMLDivElement;
            const rect = progressBar.getBoundingClientRect();
            const clickPositionInBar = e.clientX - rect.left;
            const newTime = (clickPositionInBar / rect.width) * video.duration;
            video.currentTime = newTime;
            setState((s) => ({ ...s, currentTime: newTime }));
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

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    };

    return (
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
            {/* Video Player */}
            <div className="relative rounded-lg overflow-hidden shadow-xl">
                <video
                    ref={videoRef}
                    className="w-full"
                    src={lesson.videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setState((s) => ({ ...s, playing: false }))}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={handlePlayPause}
                        className="w-16 h-16 rounded-full bg-white bg-opacity-70 text-amber-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                        {state.playing ? (
                            <FaPause size={32} />
                        ) : (
                            <FaPlay size={32} />
                        )}
                    </button>
                </div>
            </div>

            {/* Custom Controls and Progress Bar */}
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handlePlayPause}
                        className="text-amber-600 dark:text-amber-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {state.playing ? (
                            <FaPause size={20} />
                        ) : (
                            <FaPlay size={20} />
                        )}
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(state.currentTime)} /{" "}
                        {formatTime(state.duration)}
                    </span>
                </div>
                <div
                    className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mx-4 cursor-pointer"
                    onClick={handleSeek}
                >
                    <div
                        className="bg-[#c27c26] h-full rounded-full"
                        style={{
                            width: `${
                                (state.currentTime / state.duration) * 100
                            }%`,
                        }}
                    />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(state.duration)}
                </span>
            </div>

            {/* Lesson Notes */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    LESSON NOTES
                </h3>
                <div className="prose dark:prose-invert">
                    {lesson.notes && (
                        <ReactMarkdown>{lesson.notes}</ReactMarkdown>
                    )}
                </div>
                <div className="flex justify-end mt-6">
                    <button className="bg-[#c27c26] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#a96b20] transition-colors flex items-center space-x-2">
                        <span>Download PDF notes</span>
                        <FaDownload />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonPlayer;
