import { Layout } from "./components/layouts/Layout";
// import Home from "./pages/HomePage";
import LessonPlayer from "./components/modules/LessonPlayer";
import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/LoginPage";
import { Signup } from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import { ChangePassword } from "./pages/ChangePasswordPage";
import QuizPage from "./components/QuizPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import BrowseCourses from "./pages/BrowseCourses";
import Onboarding from "./pages/Onboarding";
import HomePage from "./pages/HomePage";
import ForgetPasswordEmail from "./pages/forget-password/ForgetPasswordEmail";
import VerifyOTP from "./pages/forget-password/VerifyOTP";
import ResetPassword from "./pages/forget-password/ResetPassword";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgetPasswordEmail />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected route example */}
            <Route
                path="/student-dashboard"
                element={
                    <ProtectedRoute role="student">
                        <Layout>
                            <StudentDashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/instructor-dashboard"
                element={
                    <ProtectedRoute role="instructor">
                        <Layout>
                            <InstructorDashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ChangePassword />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/courses"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <BrowseCourses />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/quiz/:lessonId"
                element={
                    <ProtectedRoute role="student">
                        <Layout>
                            <QuizPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Lesson route */}
            <Route
                path="/lesson"
                element={
                    <Layout>
                        <LessonPlayer
                            lesson={{
                                id: "1",
                                title: "Introduction to React",
                                videoUrl:
                                    "https://www.w3schools.com/html/mov_bbb.mp4",
                                notes: "This is a sample lesson with **markdown** notes.",
                                duration: 100,
                            }}
                            progress={{
                                lessonId: "1",
                                completed: false,
                                progress: 0,
                                lastWatched: 0,
                            }}
                            onProgressUpdate={(progress) =>
                                console.log("Progress updated:", progress)
                            }
                            onNextLesson={() =>
                                console.log("Go to next lesson")
                            }
                            onPrevLesson={() =>
                                console.log("Go to previous lesson")
                            }
                        />
                    </Layout>
                }
            />

            {/* Public homepage
            <Route
                path="/"
                element={
                    <Layout>
                        <Home />
                    </Layout>
                }
            /> */}
        </Routes>
    );
}

export default App;
