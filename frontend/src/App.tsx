import { Layout } from "./components/layouts/Layout";
import LessonPlayer from "./components/modules/LessonPlayer";
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
import { AuthProvider } from "./context/AuthProvider";
import BrowseCourses from "./pages/BrowseCourses";
import Onboarding from "./pages/Onboarding";
import HomePage from "./pages/HomePage";
import ForgetPasswordEmail from "./pages/forget-password/ForgetPasswordEmail";
import VerifyOTP from "./pages/forget-password/VerifyOTP";
import ResetPassword from "./pages/forget-password/ResetPassword";
import { VirtualAssistant } from "./components/VirtualAssistant/VirtualAssistant";
import Profile from "./pages/Profile";
import Courses from "./pages/instructor/Courses";

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
                path="/instructor/courses"
                element={
                    <AuthProvider>
                        <Layout>
                            <Courses />
                        </Layout>
                    </AuthProvider>
                }
            />
            <Route path="/quiz/:lessonId" element={<QuizPage />} />

            {/* Instructor Quiz Management */}
            <Route path="/quiz" element={<CreateQuizPage />} />
            <Route path="/view-quiz/:lessonId" element={<ViewQuizPage />} />
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
                    <Layout>
                        <VirtualAssistant context={{ page: "GeneralHelp" }} />
                    </Layout>
                }
            />
        </Routes>
    );
}

export default App;
