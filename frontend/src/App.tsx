import { Layout } from "./components/layouts/Layout";
// import LessonPlayer from "./components/modules/LessonPlayer";
import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/LoginPage";
import { Signup } from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import { ChangePassword } from "./pages/ChangePasswordPage";
import QuizPage from "./components/QuizPage";
import CreateQuizPage from "./pages/quiz/CreateQuizPage";
import ViewQuizPage from "./pages/quiz/ViewQuizPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import BrowseCourses from "./pages/BrowseCourses";
import Onboarding from "./pages/Onboarding";
import HomePage from "./pages/HomePage";
import ForgetPasswordEmail from "./pages/forget-password/ForgetPasswordEmail";
import VerifyOTP from "./pages/forget-password/VerifyOTP";
import ResetPassword from "./pages/forget-password/ResetPassword";
import { VirtualAssistant } from "./components/VirtualAssistant/VirtualAssistant";
import Profile from "./pages/profile";
import Courses from "./pages/instructor/Courses";
import CourseForm from "./pages/instructor/CourseForm";

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
            <Route path="/reset-password-otp" element={<ResetPassword />} />

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
                path="/instructor/my-courses"
                element={
                    <ProtectedRoute role="instructor">
                        <Layout>
                            <Courses />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/instructor/courses/new"
                element={
                    <ProtectedRoute role="instructor">
                        <Layout>
                            <CourseForm />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/instructor/courses/:id"
                element={
                    <ProtectedRoute role="instructor">
                        <Layout>
                            <CourseForm />
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
                path="/my-courses"
                element={
                    <ProtectedRoute role="student">
                        <Layout>
                            <BrowseCourses onlyEnrolled={true} />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route path="/quiz/:lessonId" element={<QuizPage />} />

            {/* Instructor Quiz Management */}
            <Route
                path="/quiz"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <CreateQuizPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/view-quiz/:lessonId"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ViewQuizPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/assistant"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <VirtualAssistant
                                context={{ page: "GeneralHelp" }}
                            />
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
        </Routes>
    );
}

export default App;
