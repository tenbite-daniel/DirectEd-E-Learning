export interface InstructorDashboardData {
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    recentEnrollments: {
        studentName: string;
        courseTitle: string;
        date: string;
    }[];
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    lessons: Lesson[];
    published: boolean;
}

export interface Lesson {
    _id?: string;
    title: string;
    videoUrl: string;
    duration: number;
}

export interface StudentProgress {
    studentId: string;
    studentName: string;
    progress: number; // percentage
}
