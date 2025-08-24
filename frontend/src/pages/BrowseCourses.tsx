import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Grid,
    List,
    Star,
    Clock,
    Users,
    Play,
    BookOpen,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// TypeScript Interfaces
interface Instructor {
    id: string;
    name: string;
    bio: string;
    avatar: string;
    rating: number;
    specialties: string[];
    coursesCount: number;
}

interface Lesson {
    id: string;
    title: string;
    description: string;
    duration: number;
    videoUrl?: string;
    resources: string[];
    isCompleted: boolean;
    order: number;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    duration: number;
    passingScore: number;
}

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: Instructor;
    duration: number;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    rating: number;
    reviewCount: number;
    price: number;
    category: string;
    tags: string[];
    lessons: Lesson[];
    quiz?: Quiz;
    enrollmentCount: number;
    isEnrolled: boolean;
    lastUpdated: Date;
}

interface StudentProgress {
    courseId: string;
    completedLessons: string[];
    currentLesson: string;
    progressPercentage: number;
    enrollmentDate: Date;
    lastAccessed: Date;
    quizScore?: number;
}

interface FilterOptions {
    category: string;
    difficulty: string;
    priceRange: [number, number];
    duration: string;
    rating: number;
    instructor: string;
}

interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
interface MyCoursesProps {
    onlyEnrolled?: boolean;
}

const sampleInstructors: Instructor[] = [
    {
        id: "1",
        name: "Emily Davis",
        bio: "UI/UX designer creating intuitive interfaces.",
        avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face",
        rating: 4.7,
        specialties: ["UI/UX", "CSS", "Figma"],
        coursesCount: 1,
    },
    {
        id: "2",
        name: "James Rodriguez",
        bio: "Cloud engineer with AWS, Docker, and Kubernetes expertise.",
        avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
        rating: 4.85,
        specialties: ["AWS", "Docker", "Kubernetes"],
        coursesCount: 1,
    },
    {
        id: "3",
        name: "Olivia Smith",
        bio: "Python developer and data analyst focusing on machine learning.",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face",
        rating: 4.9,
        specialties: ["Python", "Data Science", "Automation"],
        coursesCount: 1,
    },
    {
        id: "4",
        name: "Liam Johnson",
        bio: "Full-stack developer skilled in React, Node.js, and MongoDB.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
        rating: 4.75,
        specialties: ["React", "Node.js", "MongoDB"],
        coursesCount: 1,
    },
    {
        id: "5",
        name: "Sophia Lee",
        bio: "Mobile app developer specializing in Flutter and iOS.",
        avatar: "https://images.unsplash.com/photo-1531123414780-f5a1d2da7c6b?w=100&h=100&fit=crop&crop=face",
        rating: 4.8,
        specialties: ["Flutter", "iOS", "Dart"],
        coursesCount: 1,
    },
    {
        id: "6",
        name: "Noah Williams",
        bio: "Cybersecurity expert in network security and penetration testing.",
        avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
        rating: 4.9,
        specialties: ["Cybersecurity", "PenTesting"],
        coursesCount: 1,
    },
    {
        id: "7",
        name: "Ava Brown",
        bio: "AI researcher and machine learning engineer in NLP and computer vision.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        rating: 4.85,
        specialties: ["Machine Learning", "NLP", "CV"],
        coursesCount: 1,
    },
    {
        id: "8",
        name: "Ethan Martinez",
        bio: "Backend engineer specializing in Go, Node.js, and microservices.",
        avatar: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100&h=100&fit=crop&crop=face",
        rating: 4.7,
        specialties: ["Go", "Node.js", "Microservices"],
        coursesCount: 1,
    },
    {
        id: "9",
        name: "Isabella Garcia",
        bio: "Front-end developer skilled in Angular, TypeScript, and modern web apps.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        rating: 4.75,
        specialties: ["Angular", "TypeScript", "Web Apps"],
        coursesCount: 1,
    },
    {
        id: "10",
        name: "Mason Wilson",
        bio: "Blockchain developer focusing on Ethereum and smart contracts.",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face",
        rating: 4.8,
        specialties: ["Blockchain", "Ethereum", "Smart Contracts"],
        coursesCount: 1,
    },
];

const sampleCourses: Course[] = [
    {
        id: "1",
        title: "Modern CSS and Flexbox",
        description:
            "Learn modern CSS techniques and responsive Flexbox layouts.",
        thumbnail:
            "https://images.unsplash.com/photo-1581091012184-2b28c30a57da?w=400&h=250&fit=crop",
        instructor: sampleInstructors[0],
        duration: 1500,
        difficulty: "Beginner",
        rating: 4.8,
        reviewCount: 780,
        price: 49.99,
        category: "Web Development",
        tags: ["CSS", "Flexbox", "Frontend"],
        lessons: [
            {
                id: "1",
                title: "CSS Basics",
                description: "Learn selectors, properties, box model",
                duration: 60,
                resources: ["cheatsheet.pdf"],
                isCompleted: true,
                order: 1,
            },
            {
                id: "2",
                title: "Flexbox Layouts",
                description: "Master Flexbox for responsive layouts",
                duration: 75,
                resources: ["examples.zip"],
                isCompleted: true,
                order: 2,
            },
            {
                id: "3",
                title: "Grid Layouts",
                description: "Master Grid Layouts for responsive designs",
                duration: 75,
                resources: ["examples.zip"],
                isCompleted: false,
                order: 3,
            },
        ],
        enrollmentCount: 10250,
        isEnrolled: true,
        lastUpdated: new Date("2025-03-12"),
    },
    {
        id: "2",
        title: "AWS Cloud Fundamentals",
        description:
            "Hands-on AWS services, deployment, and cloud best practices.",
        thumbnail:
            "https://images.unsplash.com/photo-1581091012184-9a21d6cfa6e5?w=400&h=250&fit=crop",
        instructor: sampleInstructors[1],
        duration: 2000,
        difficulty: "Intermediate",
        rating: 4.9,
        reviewCount: 645,
        price: 79.99,
        category: "Cloud Computing",
        tags: ["AWS", "Cloud", "DevOps"],
        lessons: [
            {
                id: "3",
                title: "Introduction to AWS",
                description: "Overview of core AWS services and architecture",
                duration: 90,
                resources: ["slides.pdf", "aws-setup-guide.pdf"],
                isCompleted: false,
                order: 1,
            },
        ],
        enrollmentCount: 7840,
        isEnrolled: true,
        lastUpdated: new Date("2025-04-01"),
    },
    {
        id: "3",
        title: "Python for Data Analysis",
        description:
            "Learn Python for data manipulation, visualization, and analysis.",
        thumbnail:
            "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=250&fit=crop",
        instructor: sampleInstructors[2],
        duration: 1800,
        difficulty: "Beginner",
        rating: 4.9,
        reviewCount: 900,
        price: 69.99,
        category: "Data Science",
        tags: ["Python", "Pandas", "NumPy"],
        lessons: [
            {
                id: "4",
                title: "Python Basics",
                description: "Variables, data types, control structures",
                duration: 90,
                resources: ["notebook.ipynb"],
                isCompleted: false,
                order: 1,
            },
        ],
        enrollmentCount: 8920,
        isEnrolled: false,
        lastUpdated: new Date("2025-02-15"),
    },
    {
        id: "4",
        title: "React Advanced Concepts",
        description:
            "Deep dive into React hooks, context API, and performance optimization.",
        thumbnail:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        instructor: sampleInstructors[3],
        duration: 2400,
        difficulty: "Advanced",
        rating: 4.75,
        reviewCount: 1200,
        price: 89.99,
        category: "Web Development",
        tags: ["React", "JavaScript", "Frontend"],
        lessons: [
            {
                id: "5",
                title: "React Hooks",
                description: "Using state and effect hooks effectively",
                duration: 80,
                resources: ["examples.zip"],
                isCompleted: true,
                order: 1,
            },
            {
                id: "6",
                title: "Context API",
                description: "Manage global state with Context",
                duration: 70,
                resources: ["slides.pdf"],
                isCompleted: false,
                order: 2,
            },
        ],
        enrollmentCount: 15400,
        isEnrolled: true,
        lastUpdated: new Date("2025-01-20"),
    },
    {
        id: "5",
        title: "Flutter Mobile App Development",
        description:
            "Build beautiful cross-platform mobile apps with Flutter and Dart.",
        thumbnail:
            "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=400&h=250&fit=crop",
        instructor: sampleInstructors[4],
        duration: 1800,
        difficulty: "Intermediate",
        rating: 4.8,
        reviewCount: 670,
        price: 79.99,
        category: "Mobile Development",
        tags: ["Flutter", "Dart", "Mobile"],
        lessons: [
            {
                id: "7",
                title: "Flutter Setup",
                description: "Setup development environment",
                duration: 60,
                resources: ["setup-guide.pdf"],
                isCompleted: true,
                order: 1,
            },
            {
                id: "8",
                title: "Widgets & Layouts",
                description: "Learn Flutter widgets and layout",
                duration: 90,
                resources: ["examples.zip"],
                isCompleted: false,
                order: 2,
            },
        ],
        enrollmentCount: 5400,
        isEnrolled: false,
        lastUpdated: new Date("2025-03-05"),
    },
    {
        id: "6",
        title: "Introduction to Cybersecurity",
        description:
            "Learn fundamentals of network security, threats, and penetration testing.",
        thumbnail:
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop",
        instructor: sampleInstructors[5],
        duration: 1600,
        difficulty: "Beginner",
        rating: 4.9,
        reviewCount: 560,
        price: 59.99,
        category: "Cybersecurity",
        tags: ["Cybersecurity", "Network", "PenTesting"],
        lessons: [
            {
                id: "9",
                title: "Network Basics",
                description: "Networking concepts and protocols",
                duration: 70,
                resources: ["slides.pdf"],
                isCompleted: true,
                order: 1,
            },
        ],
        enrollmentCount: 4300,
        isEnrolled: false,
        lastUpdated: new Date("2025-04-02"),
    },
    {
        id: "7",
        title: "Machine Learning with Python",
        description:
            "Learn machine learning algorithms and data modeling using Python.",
        thumbnail:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
        instructor: sampleInstructors[6],
        duration: 2000,
        difficulty: "Advanced",
        rating: 4.85,
        reviewCount: 720,
        price: 89.99,
        category: "Data Science",
        tags: ["Python", "ML", "NLP"],
        lessons: [
            {
                id: "10",
                title: "ML Basics",
                description: "Supervised and unsupervised learning",
                duration: 90,
                resources: ["notebook.ipynb"],
                isCompleted: true,
                order: 1,
            },
        ],
        enrollmentCount: 6500,
        isEnrolled: true,
        lastUpdated: new Date("2025-02-20"),
    },
    {
        id: "8",
        title: "Backend Development with Go",
        description:
            "Build efficient backend systems using Go and microservices architecture.",
        thumbnail:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981b?w=400&h=250&fit=crop",
        instructor: sampleInstructors[7],
        duration: 1800,
        difficulty: "Intermediate",
        rating: 4.7,
        reviewCount: 480,
        price: 79.99,
        category: "Backend Development",
        tags: ["Go", "Microservices", "Backend"],
        lessons: [
            {
                id: "11",
                title: "Go Basics",
                description: "Syntax, functions, and structs",
                duration: 70,
                resources: ["examples.zip"],
                isCompleted: true,
                order: 1,
            },
        ],
        enrollmentCount: 3900,
        isEnrolled: false,
        lastUpdated: new Date("2025-03-22"),
    },
    {
        id: "9",
        title: "Angular for Modern Web Apps",
        description:
            "Create scalable web applications using Angular and TypeScript.",
        thumbnail:
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop",
        instructor: sampleInstructors[8],
        duration: 1700,
        difficulty: "Intermediate",
        rating: 4.75,
        reviewCount: 510,
        price: 79.99,
        category: "Web Development",
        tags: ["Angular", "TypeScript", "Frontend"],
        lessons: [
            {
                id: "12",
                title: "Angular Basics",
                description: "Components, modules, and services",
                duration: 80,
                resources: ["slides.pdf"],
                isCompleted: true,
                order: 1,
            },
        ],
        enrollmentCount: 4200,
        isEnrolled: false,
        lastUpdated: new Date("2025-03-10"),
    },
    {
        id: "10",
        title: "Blockchain Development with Ethereum",
        description:
            "Learn to build smart contracts and decentralized apps on Ethereum.",
        thumbnail:
            "https://images.unsplash.com/photo-1605902711622-cfb43c443f73?w=400&h=250&fit=crop",
        instructor: sampleInstructors[9],
        duration: 2000,
        difficulty: "Advanced",
        rating: 4.8,
        reviewCount: 600,
        price: 99.99,
        category: "Blockchain",
        tags: ["Ethereum", "Smart Contracts", "Blockchain"],
        lessons: [
            {
                id: "13",
                title: "Solidity Basics",
                description: "Smart contract syntax and structure",
                duration: 90,
                resources: ["examples.zip"],
                isCompleted: true,
                order: 1,
            },
        ],
        enrollmentCount: 4700,
        isEnrolled: false,
        lastUpdated: new Date("2025-04-05"),
    },
];

// Utility Functions
const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const formatPrice = (price: number): string => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`;
};

// Components
const CourseCard: React.FC<{
    course: Course;
    onCourseClick: (course: Course) => void;
    progress?: StudentProgress;
}> = ({ course, onCourseClick, progress }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            onClick={() => onCourseClick(course)}
        >
            <div className="relative">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                />
                {course.isEnrolled && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                        Enrolled
                    </div>
                )}
                {progress && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 text-white p-2">
                        <div className="flex justify-between text-sm">
                            <span>{progress.progressPercentage}% Complete</span>
                            <span>
                                {progress.completedLessons.length}/
                                {course.lessons.length} Lessons
                            </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                            <div
                                className="bg-green-400 h-1 rounded-full transition-all"
                                style={{
                                    width: `${progress.progressPercentage}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-center mb-2">
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                            course.difficulty === "Beginner"
                                ? "bg-green-100 text-green-800"
                                : course.difficulty === "Intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {course.difficulty}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                        {course.category}
                    </span>
                </div>

                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                </p>

                <div className="flex items-center mb-3">
                    <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-700">
                        {course.instructor.name}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{course.rating}</span>
                        <span className="ml-1">({course.reviewCount})</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.enrollmentCount.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                        {formatPrice(course.price)}
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {course.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseGrid: React.FC<{
    courses: Course[];
    onCourseClick: (course: Course) => void;
    progressData: StudentProgress[];
}> = ({ courses, onCourseClick, progressData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
                const progress = progressData.find(
                    (p) => p.courseId === course.id
                );
                return (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onCourseClick={onCourseClick}
                        progress={progress}
                    />
                );
            })}
        </div>
    );
};

const CourseList: React.FC<{
    courses: Course[];
    onCourseClick: (course: Course) => void;
    progressData: StudentProgress[];
}> = ({ courses, onCourseClick, progressData }) => {
    return (
        <div className="space-y-4">
            {courses.map((course) => {
                const progress = progressData.find(
                    (p) => p.courseId === course.id
                );
                return (
                    <div
                        key={course.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4 flex"
                        onClick={() => onCourseClick(course)}
                    >
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-32 h-24 object-cover rounded mr-4 flex-shrink-0"
                        />
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="mr-4">
                                            {course.instructor.name}
                                        </span>
                                        <div className="flex items-center mr-4">
                                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                            <span>{course.rating}</span>
                                        </div>
                                        <div className="flex items-center mr-4">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>
                                                {formatDuration(
                                                    course.duration
                                                )}
                                            </span>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${
                                                course.difficulty === "Beginner"
                                                    ? "bg-green-100 text-green-800"
                                                    : course.difficulty ===
                                                      "Intermediate"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {course.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-blue-600 mb-1">
                                        {formatPrice(course.price)}
                                    </div>
                                    {progress && (
                                        <div className="text-sm text-green-600">
                                            {progress.progressPercentage}%
                                            Complete
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const Pagination: React.FC<{
    pagination: PaginationState;
    onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} results
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                    if (page > totalPages) return null;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-2 rounded-md text-sm ${
                                currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const CourseDetailPage: React.FC<{
    course: Course;
    onBack: () => void;
    onEnroll: (courseId: string) => void;
    progress?: StudentProgress;
    relatedCourses: Course[];
}> = ({ course, onBack, onEnroll, progress, relatedCourses }) => {
    const [activeTab, setActiveTab] = useState<
        "overview" | "lessons" | "instructor" | "reviews"
    >("overview");

    // Typed tab click handler
    const handleTabClick = (
        tabKey: "overview" | "lessons" | "instructor" | "reviews"
    ) => {
        setActiveTab(tabKey);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Courses
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />

                    <div className="flex border-b mb-6">
                        {[
                            { key: "overview", label: "Overview" },
                            { key: "lessons", label: "Lessons" },
                            { key: "instructor", label: "Instructor" },
                            { key: "reviews", label: "Reviews" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() =>
                                    handleTabClick(
                                        tab.key as
                                            | "overview"
                                            | "lessons"
                                            | "instructor"
                                            | "reviews"
                                    )
                                }
                                className={`px-4 py-2 font-medium ${
                                    activeTab === tab.key
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === "overview" && (
                        <div>
                            <h1 className="text-3xl font-bold mb-4">
                                {course.title}
                            </h1>
                            <p className="text-gray-600 text-lg mb-6">
                                {course.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <div className="font-semibold">
                                        {formatDuration(course.duration)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Duration
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <div className="font-semibold">
                                        {course.enrollmentCount.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Students
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <Star className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <div className="font-semibold">
                                        {course.rating}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Rating
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <div className="font-semibold">
                                        {course.lessons.length}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Lessons
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-lg mb-3">
                                    What you'll learn
                                </h3>
                                <ul className="space-y-2">
                                    {course.tags.map((tag) => (
                                        <li
                                            key={tag}
                                            className="flex items-center"
                                        >
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === "lessons" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                Course Lessons
                            </h2>
                            <div className="space-y-3">
                                {course.lessons.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            {lesson.isCompleted ? (
                                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                            ) : (
                                                <span className="text-blue-600 font-medium">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">
                                                {lesson.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {lesson.description}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {lesson.duration}m
                                        </div>
                                        <Play className="w-5 h-5 text-blue-600 ml-4 cursor-pointer hover:text-blue-800" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "instructor" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                About the Instructor
                            </h2>
                            <div className="flex items-start space-x-4">
                                <img
                                    src={course.instructor.avatar}
                                    alt={course.instructor.name}
                                    className="w-20 h-20 rounded-full"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {course.instructor.name}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                            {course.instructor.rating}{" "}
                                            Instructor Rating
                                        </div>
                                        <div>
                                            {course.instructor.coursesCount}{" "}
                                            Courses
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-4">
                                        {course.instructor.bio}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {course.instructor.specialties.map(
                                            (specialty) => (
                                                <span
                                                    key={specialty}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {specialty}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                Student Reviews
                            </h2>
                            <div className="text-center py-8 text-gray-500">
                                Reviews feature coming soon...
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                        <div className="text-3xl font-bold text-blue-600 mb-4">
                            {formatPrice(course.price)}
                        </div>

                        {progress ? (
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progress</span>
                                    <span>{progress.progressPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{
                                            width: `${progress.progressPercentage}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                    {progress.completedLessons.length} of{" "}
                                    {course.lessons.length} lessons completed
                                </div>
                            </div>
                        ) : null}

                        <button
                            onClick={() => onEnroll(course.id)}
                            disabled={course.isEnrolled}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                course.isEnrolled
                                    ? "bg-green-100 text-green-800 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            {course.isEnrolled
                                ? "Already Enrolled"
                                : "Enroll Now"}
                        </button>

                        <div className="mt-6 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Difficulty Level:</span>
                                <span className="font-medium">
                                    {course.difficulty}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Last Updated:</span>
                                <span>
                                    {course.lastUpdated.toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Category:</span>
                                <span className="font-medium">
                                    {course.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {relatedCourses.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">
                                Related Courses
                            </h3>
                            <div className="space-y-4">
                                {relatedCourses
                                    .slice(0, 3)
                                    .map((relatedCourse) => (
                                        <div
                                            key={relatedCourse.id}
                                            className="flex space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer"
                                        >
                                            <img
                                                src={relatedCourse.thumbnail}
                                                alt={relatedCourse.title}
                                                className="w-16 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm line-clamp-2">
                                                    {relatedCourse.title}
                                                </h4>
                                                <div className="text-xs text-gray-600 mt-1">
                                                    {
                                                        relatedCourse.instructor
                                                            .name
                                                    }
                                                </div>
                                                <div className="text-sm font-semibold text-blue-600">
                                                    {formatPrice(
                                                        relatedCourse.price
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Component
const CourseCatalogSystem: React.FC<MyCoursesProps> = ({ onlyEnrolled }) => {
    const [courses, setCourses] = useState<Course[]>(sampleCourses);
    const [filteredCourses, setFilteredCourses] =
        useState<Course[]>(sampleCourses);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [progressData, setProgressData] = useState<StudentProgress[]>([
        {
            courseId: "1",
            completedLessons: ["1", "2"],
            currentLesson: "3",
            progressPercentage: 67, // 2 out of 3 lessons completed
            enrollmentDate: new Date("2025-02-10"),
            lastAccessed: new Date("2025-03-15"),
        },
        {
            courseId: "2",
            completedLessons: [],
            currentLesson: "3",
            progressPercentage: 0, // 0 out of 1 lessons completed
            enrollmentDate: new Date("2025-03-01"),
            lastAccessed: new Date("2025-03-01"),
        },
        {
            courseId: "4",
            completedLessons: ["5"],
            currentLesson: "6",
            progressPercentage: 50, // 1 out of 2 lessons completed
            enrollmentDate: new Date("2025-01-15"),
            lastAccessed: new Date("2025-03-10"),
        },
        {
            courseId: "7",
            completedLessons: ["10"],
            currentLesson: "",
            progressPercentage: 100, // 1 out of 1 lessons completed
            enrollmentDate: new Date("2025-02-05"),
            lastAccessed: new Date("2025-03-12"),
        },
    ]);

    const [filters, setFilters] = useState<FilterOptions>({
        category: "",
        difficulty: "",
        priceRange: [0, 200],
        duration: "",
        rating: 0,
        instructor: "",
    });

    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        itemsPerPage: 9,
        totalItems: sampleCourses.length,
        totalPages: Math.ceil(sampleCourses.length / 9),
    });

    const categories = [...new Set(courses.map((course) => course.category))];
    const difficulties = ["Beginner", "Intermediate", "Advanced"];
    const instructors = [
        ...new Set(courses.map((course) => course.instructor.name)),
    ];

    useEffect(() => {
        const filtered = courses.filter((course) => {
            // 1️⃣ Only show enrolled courses if onlyEnrolled is true
            if (onlyEnrolled && !course.isEnrolled) return false;

            // 2️⃣ Search filter
            const matchesSearch =
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                course.instructor.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                course.tags.some((tag) =>
                    tag.toLowerCase().includes(searchTerm.toLowerCase())
                );

            // 3️⃣ Other filters
            const matchesCategory =
                !filters.category || course.category === filters.category;
            const matchesDifficulty =
                !filters.difficulty || course.difficulty === filters.difficulty;
            const matchesPrice =
                course.price >= filters.priceRange[0] &&
                course.price <= filters.priceRange[1];
            const matchesRating = course.rating >= filters.rating;
            const matchesInstructor =
                !filters.instructor ||
                course.instructor.name === filters.instructor;

            const matchesDuration =
                !filters.duration ||
                (filters.duration === "short" && course.duration < 600) ||
                (filters.duration === "medium" &&
                    course.duration >= 600 &&
                    course.duration < 1800) ||
                (filters.duration === "long" && course.duration >= 1800);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesDifficulty &&
                matchesPrice &&
                matchesRating &&
                matchesInstructor &&
                matchesDuration
            );
        });

        setFilteredCourses(filtered);
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
            totalItems: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.itemsPerPage),
        }));
    }, [courses, searchTerm, filters, onlyEnrolled]);

    // Pagination logic
    const paginatedCourses = filteredCourses.slice(
        (pagination.currentPage - 1) * pagination.itemsPerPage,
        pagination.currentPage * pagination.itemsPerPage
    );

    const handleCourseClick = (course: Course) => {
        setSelectedCourse(course);
    };

    const handleEnroll = (courseId: string) => {
        setCourses((prev) =>
            prev.map((course) =>
                course.id === courseId
                    ? { ...course, isEnrolled: true }
                    : course
            )
        );

        // Add initial progress
        if (!progressData.find((p) => p.courseId === courseId)) {
            setProgressData((prev) => [
                ...prev,
                {
                    courseId,
                    completedLessons: [],
                    currentLesson: "",
                    progressPercentage: 0,
                    enrollmentDate: new Date(),
                    lastAccessed: new Date(),
                },
            ]);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, currentPage: page }));
    };

    const handleFilterChange = <K extends keyof FilterOptions>(
        key: K,
        value: FilterOptions[K]
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: "",
            difficulty: "",
            priceRange: [0, 200],
            duration: "",
            rating: 0,
            instructor: "",
        });
    };

    const getRelatedCourses = (course: Course): Course[] => {
        return courses
            .filter(
                (c) =>
                    c.id !== course.id &&
                    (c.category === course.category ||
                        c.tags.some((tag) => course.tags.includes(tag)))
            )
            .slice(0, 3);
    };

    if (selectedCourse) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <CourseDetailPage
                    course={selectedCourse}
                    onBack={() => setSelectedCourse(null)}
                    onEnroll={handleEnroll}
                    progress={progressData.find(
                        (p) => p.courseId === selectedCourse.id
                    )}
                    relatedCourses={getRelatedCourses(selectedCourse)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-28">
            {/* Header */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Course Catalog
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                                />
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </button>

                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 ${
                                        viewMode === "grid"
                                            ? "bg-blue-100 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 ${
                                        viewMode === "list"
                                            ? "bg-blue-100 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "category",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Difficulty Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Difficulty
                                    </label>
                                    <select
                                        value={filters.difficulty}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "difficulty",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Levels</option>
                                        {difficulties.map((difficulty) => (
                                            <option
                                                key={difficulty}
                                                value={difficulty}
                                            >
                                                {difficulty}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range: ${filters.priceRange[0]} -
                                        ${filters.priceRange[1]}
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={filters.priceRange[0]}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "priceRange",
                                                    [
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                        filters.priceRange[1],
                                                    ]
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={filters.priceRange[1]}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "priceRange",
                                                    [
                                                        filters.priceRange[0],
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                    ]
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Duration Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            {
                                                value: "",
                                                label: "Any Duration",
                                            },
                                            {
                                                value: "short",
                                                label: "Short (< 10 hours)",
                                            },
                                            {
                                                value: "medium",
                                                label: "Medium (10-30 hours)",
                                            },
                                            {
                                                value: "long",
                                                label: "Long (30+ hours)",
                                            },
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-center"
                                            >
                                                <input
                                                    type="radio"
                                                    name="duration"
                                                    value={option.value}
                                                    checked={
                                                        filters.duration ===
                                                        option.value
                                                    }
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            "duration",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Rating: {filters.rating}★
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.5"
                                        value={filters.rating}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "rating",
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full"
                                    />
                                </div>

                                {/* Instructor Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Instructor
                                    </label>
                                    <select
                                        value={filters.instructor}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "instructor",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            All Instructors
                                        </option>
                                        {instructors.map((instructor) => (
                                            <option
                                                key={instructor}
                                                value={instructor}
                                            >
                                                {instructor}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {filteredCourses.length} Course
                                    {filteredCourses.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    Found
                                </h2>
                                {searchTerm && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Results for "{searchTerm}"
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                <select className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                                    <option>Sort by: Popularity</option>
                                    <option>Sort by: Rating</option>
                                    <option>Sort by: Price: Low to High</option>
                                    <option>Sort by: Price: High to Low</option>
                                    <option>Sort by: Newest</option>
                                </select>
                            </div>
                        </div>

                        {/* Course Display */}
                        {paginatedCourses.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <BookOpen className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No courses found
                                </h3>
                                <p className="text-gray-600">
                                    Try adjusting your filters or search terms
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {viewMode === "grid" ? (
                                    <CourseGrid
                                        courses={paginatedCourses}
                                        onCourseClick={handleCourseClick}
                                        progressData={progressData}
                                    />
                                ) : (
                                    <CourseList
                                        courses={paginatedCourses}
                                        onCourseClick={handleCourseClick}
                                        progressData={progressData}
                                    />
                                )}

                                <Pagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCatalogSystem;
