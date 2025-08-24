import React, { useState, useRef, useEffect } from "react";
import {
    Upload,
    Play,
    Pause,
    FileText,
    Image,
    Video,
    Trash2,
    Eye,
    Download,
} from "lucide-react";
import { type ReactNode } from "react";

interface FileData {
    id: number;
    file: File;
    name: string;
    size: number;
    type: string;
    uploadDate: string;
    url: string;
}

interface VideoProgress {
    currentTime: number;
    duration: number;
    progress: number;
}

type FileType = "video" | "image" | "pdf" | "document";

const ContentManagementSystem: React.FC = () => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [videoProgress, setVideoProgress] = useState<
        Record<number, VideoProgress>
    >({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

    // Handle file selection
    const handleFileSelect = (selectedFiles: FileList): void => {
        const newFiles: FileData[] = Array.from(selectedFiles).map((file) => ({
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toLocaleDateString(),
            url: URL.createObjectURL(file),
        }));
        setFiles((prev) => [...prev, ...newFiles]);
    };

    // Drag and drop handlers
    const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    // File type detection
    const getFileType = (mimeType: string): FileType => {
        if (mimeType.startsWith("video/")) return "video";
        if (mimeType.startsWith("image/")) return "image";
        if (mimeType === "application/pdf") return "pdf";
        return "document";
    };

    // File type icon
    const getFileIcon = (type: FileType): ReactNode => {
        switch (type) {
            case "video":
                return <Video className="w-6 h-6" />;
            case "image":
                return <Image className="w-6 h-6" />;
            case "pdf":
                return <FileText className="w-6 h-6" />;
            default:
                return <FileText className="w-6 h-6" />;
        }
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes: string[] = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Video progress tracking
    const handleVideoTimeUpdate = (
        fileId: number,
        currentTime: number,
        duration: number
    ): void => {
        const progress = (currentTime / duration) * 100;
        setVideoProgress((prev) => ({
            ...prev,
            [fileId]: { currentTime, duration, progress },
        }));
    };

    // Delete file
    const deleteFile = (fileId: number): void => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        if (selectedFile && selectedFile.id === fileId) {
            setSelectedFile(null);
        }
    };

    // Video Player Component
    const VideoPlayer: React.FC<{ file: FileData }> = ({ file }) => {
        const videoRef = useRef<HTMLVideoElement>(null);
        const [isPlaying, setIsPlaying] = useState<boolean>(false);

        useEffect(() => {
            if (videoRef.current) {
                videoRefs.current[file.id] = videoRef.current;
            }
        }, [file.id]);

        const togglePlay = (): void => {
            if (videoRef.current) {
                if (videoRef.current.paused) {
                    videoRef.current.play();
                    setIsPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
            }
        };

        const handleTimeUpdate = (
            e: React.SyntheticEvent<HTMLVideoElement>
        ): void => {
            const target = e.target as HTMLVideoElement;
            handleVideoTimeUpdate(file.id, target.currentTime, target.duration);
        };

        const handleLoadedMetadata = (
            e: React.SyntheticEvent<HTMLVideoElement>
        ): void => {
            const target = e.target as HTMLVideoElement;
            handleVideoTimeUpdate(file.id, 0, target.duration);
        };

        return (
            <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                    ref={videoRef}
                    className="w-full h-auto max-h-96"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls
                >
                    <source src={file.url} type={file.type} />
                    Your browser does not support the video tag.
                </video>

                {videoProgress[file.id] && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <div className="flex items-center gap-2 text-white text-sm">
                            <button
                                onClick={togglePlay}
                                className="hover:bg-white/20 p-1 rounded"
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                            </button>
                            <div className="flex-1 bg-white/30 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${
                                            videoProgress[file.id].progress || 0
                                        }%`,
                                    }}
                                />
                            </div>
                            <span>
                                {Math.floor(
                                    videoProgress[file.id].currentTime || 0
                                )}
                                s /{" "}
                                {Math.floor(
                                    videoProgress[file.id].duration || 0
                                )}
                                s
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Image Preview Component
    const ImagePreview: React.FC<{ file: FileData }> = ({ file }) => (
        <div className="flex justify-center bg-gray-100 rounded-lg p-4">
            <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-96 object-contain rounded-lg shadow-md"
            />
        </div>
    );

    // PDF Preview Component
    const PDFPreview: React.FC<{ file: FileData }> = ({ file }) => (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{file.name}</h3>
            <p className="text-gray-600 mb-4">
                PDF Document ({formatFileSize(file.size)})
            </p>
            <div className="flex gap-3 justify-center">
                <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    View PDF
                </a>
                <a
                    href={file.url}
                    download={file.name}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download
                </a>
            </div>
        </div>
    );

    // Content Preview Component
    const ContentPreview: React.FC<{ file: FileData }> = ({ file }) => {
        const fileType: FileType = getFileType(file.type);

        switch (fileType) {
            case "video":
                return <VideoPlayer file={file} />;
            case "image":
                return <ImagePreview file={file} />;
            case "pdf":
                return <PDFPreview file={file} />;
            default:
                return (
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <FileText className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {file.name}
                        </h3>
                        <p className="text-gray-600">
                            File type not supported for preview
                        </p>
                    </div>
                );
        }
    };

    const handleFileInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        if (e.target.files) {
            handleFileSelect(e.target.files);
        }
    };

    const handleUploadClick = (): void => {
        fileInputRef.current?.click();
    };

    const handleDeleteClick = (e: React.MouseEvent, fileId: number): void => {
        e.stopPropagation();
        deleteFile(fileId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Content Management System
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* File Upload Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Upload Course Materials
                            </h2>

                            {/* Upload Area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    dragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-4">
                                    Drag and drop files here, or click to select
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="video/*,image/*,.pdf,.doc,.docx,.txt"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />
                                <button
                                    onClick={handleUploadClick}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Choose Files
                                </button>
                            </div>

                            {/* File List */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">
                                    Uploaded Files ({files.length})
                                </h3>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {files.map((file: FileData) => (
                                        <div
                                            key={file.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                selectedFile?.id === file.id
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() =>
                                                setSelectedFile(file)
                                            }
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-gray-500">
                                                        {getFileIcon(
                                                            getFileType(
                                                                file.type
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatFileSize(
                                                                file.size
                                                            )}{" "}
                                                            • {file.uploadDate}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) =>
                                                        handleDeleteClick(
                                                            e,
                                                            file.id
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {files.length === 0 && (
                                        <p className="text-gray-500 text-center py-8">
                                            No files uploaded yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Preview Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Content Preview
                            </h2>

                            {selectedFile ? (
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {selectedFile.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>
                                                Type:{" "}
                                                {getFileType(selectedFile.type)}
                                            </span>
                                            <span>
                                                Size:{" "}
                                                {formatFileSize(
                                                    selectedFile.size
                                                )}
                                            </span>
                                            <span>
                                                Uploaded:{" "}
                                                {selectedFile.uploadDate}
                                            </span>
                                        </div>
                                    </div>

                                    <ContentPreview file={selectedFile} />
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <Eye className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">
                                        Select a file from the left panel to
                                        preview it
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentManagementSystem;
