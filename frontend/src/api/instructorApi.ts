// src/api/instructorApi.ts
import api from "./axiosInstance";
import type {
    InstructorDashboardData,
    Course,
    StudentProgress,
} from "../types/instructor";

// Fetch instructor dashboard data
export const fetchDashboardData =
    async (): Promise<InstructorDashboardData> => {
        const { data } = await api.get<InstructorDashboardData>(
            "/instructor/instructor-dashboard"
        );
        return data;
    };

// Fetch all courses for instructor
export const fetchCourses = async (): Promise<Course[]> => {
    const { data } = await api.get("/instructor/courses");
    // API might return { courses: [] } or [] directly
    if (Array.isArray(data)) return data;
    if (Array.isArray((data as any).courses)) return (data as any).courses;
    return [];
};

// Fetch single course by ID
export const fetchCourseById = async (id: string): Promise<Course> => {
    const { data } = await api.get<Course>(`/instructor/courses/${id}`);
    return data;
};

// Create a new course
export const createCourse = async (
    course: Partial<Course>
): Promise<Course> => {
    const { data } = await api.post<Course>("/instructor/courses", course);
    return data;
};

// Update an existing course
export const updateCourse = async (
    courseId: string,
    updates: Partial<Course>
    
): Promise<Course> => {
    const { data } = await api.put<Course>(
        `/instructor/courses/${courseId}`,
        updates
    );
    return data;
};

// Delete a course
export const deleteCourse = async (
    courseId: string
): Promise<{ message: string; courseId: string }> => {
    const { data } = await api.delete<{ message: string; courseId: string }>(
        `/instructor/courses/${courseId}`
    );
    return data;
};

// Fetch students for a specific course
export const fetchStudents = async (
    courseId: string
): Promise<StudentProgress[]> => {
    const { data } = await api.get<StudentProgress[]>(
        `/instructor/students/${courseId}`
    );
    return data;
};
