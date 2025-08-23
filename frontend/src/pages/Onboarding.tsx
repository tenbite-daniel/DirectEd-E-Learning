import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import directEdLogo from "../assets/getstarted/logo.png";
import student from "../assets/getstarted/student.png";
import instructor from "../assets/getstarted/instructor.png";
import tree from "../assets/getstarted/student/tree.png";
import womenSit from "../assets/getstarted/student/womenSit.png";
import grad from "../assets/getstarted/student/grad.png";
import getStartedBg from "../assets/getstarted/getStarted-bg.jpg";
import roleBg from "../assets/getstarted/role-bg.jpg";
import cartoonAiRobot from "../assets/getStarted/instructor/cartoon-ai-robot.png";
import plushyWomenWork from "../assets/getStarted/instructor/plushy-women-work.png";
import teaching from "../assets/getStarted/instructor/teaching.png";

const onboardingSteps = [
    {
        bg: getStartedBg,
        logo: directEdLogo,
        text: "Learn, teach, and grow—explore courses, track progress, and connect with learners and instructors. Your journey starts here!",
        button: "Get Started",
    },
    {
        bg: roleBg,
        image1: student,
        image2: instructor,
        button1: "Student",
        button2: "Instructor",
    },
    {
        studentImage: tree,
        studentTitle: "Unlock Your Path to Knowledge",
        studentText:
            "Discover new skills, explore ideas, and grow with engaging lessons designed for your journey.",
        instructorImage: cartoonAiRobot,
        instructorTitle: "Shape the Future With Teaching",
        instructorText:
            "Turn your knowledge into impact. Inspire learners, share your expertise, and help students reach their goals.",
        button: "Continue",
        skip: "Skip",
    },
    {
        studentImage: womenSit,
        studentTitle: "Learn Anytime, Anywhere",
        studentText:
            "Access courses at your own pace, whether at home, on the go, or during your free time.",
        instructorImage: plushyWomenWork,
        instructorTitle: "Teach Anytime, Anywhere",
        instructorText:
            "Manage your courses, issue certificates, and connect with students at your convenience — from home, on the go, or between sessions.",
        button: "Continue",
        skip: "Skip",
    },
    {
        studentImage: grad,
        studentTitle: "Shape Your Future With Learning",
        studentText:
            "Turn curiosity into achievement. Stay inspired and motivated as you reach your goals.",
        instructorImage: teaching,
        instructorTitle: "Unlock Your Path to Growth",
        instructorText:
            "Build your reputation, expand your reach, and track student success with powerful tools designed for your teaching journey.",
        button: "Continue",
        skip: "Skip",
    },
];

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(0);
    const [role, setRole] = useState<"student" | "instructor">();

    const current = onboardingSteps[step];

    // Initialize step & role from location state (e.g., coming back from Signup)
    useEffect(() => {
        const state = location.state as {
            step?: number;
            role?: "student" | "instructor";
        };
        if (state?.step !== undefined) setStep(state.step);
        if (state?.role) setRole(state.role);
    }, [location.state]);

    const handleNext = () => {
        if (step < onboardingSteps.length - 1) {
            setStep(step + 1);
        } else {
            navigate("/signup", { state: { role } });
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSkip = () => navigate("/signup");

    const bgStyle =
        "bg" in current
            ? {
                  backgroundImage: `url(${current.bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
              }
            : { backgroundColor: "#5D7163" };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4 text-center relative"
            style={bgStyle}
        >
            {/* Back button */}
            {step > 0 && (
                <button
                    onClick={handleBack}
                    className="absolute text-white top-4 left-3 p-3 rounded-full hover:bg-gray-800 flex justify-center items-center gap-0"
                >
                    <ChevronLeft size={24} />
                    <p className="pr-2">Back</p>
                </button>
            )}

            {/* Step 1: Logo + text + button */}
            {"logo" in current && (
                <>
                    <img
                        src={current.logo}
                        alt="Logo"
                        className="w-60 h-20 sm:w-60 sm:h-24 md:w-64 md:h-28 brightness-0 mb-4 sm:mb-6"
                    />
                    <p className="text-gray-100 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 max-w-md md:max-w-lg">
                        {current.text}
                    </p>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold w-full max-w-xs shadow-md hover:bg-blue-700 transition-colors duration-200"
                        onClick={handleNext}
                    >
                        {current.button}
                    </button>
                </>
            )}

            {/* Step 2: Two images + two buttons */}
            {"image1" in current && "image2" in current && (
                <section className="w-full flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <img
                                src={current.image1}
                                alt="Student"
                                className="w-52 h-48 sm:w-60 sm:h-56 md:w-72 md:h-64 object-contain"
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold shadow-md w-32 hover:bg-blue-700 transition-colors duration-200"
                                onClick={() => {
                                    setRole("student");
                                    handleNext();
                                }}
                            >
                                {current.button1}
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-5">
                            <img
                                src={current.image2}
                                alt="Instructor"
                                className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 object-contain"
                            />
                            <button
                                className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold shadow-md w-32 hover:bg-green-700 transition-colors duration-200"
                                onClick={() => {
                                    setRole("instructor");
                                    handleNext();
                                }}
                            >
                                {current.button2}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Steps 3–5: Image, title, text, button, skip */}
            {"studentTitle" in current && role && (
                <section className="w-full flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-7">
                    <img
                        src={
                            role === "student"
                                ? current.studentImage
                                : current.instructorImage
                        }
                        alt={
                            role === "student"
                                ? current.studentTitle
                                : current.instructorTitle
                        }
                        className="w-56 h-40 sm:w-60 sm:h-44 md:w-64 md:h-48 object-contain"
                    />
                    <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-200">
                        {role === "student"
                            ? current.studentTitle
                            : current.instructorTitle}
                    </h2>
                    <p className="text-gray-100 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md">
                        {role === "student"
                            ? current.studentText
                            : current.instructorText}
                    </p>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold w-full max-w-xs shadow-md hover:bg-blue-700 transition-colors duration-200"
                        onClick={handleNext}
                    >
                        {current.button}
                    </button>
                    {current.skip && (
                        <button
                            onClick={handleSkip}
                            className="underline text-gray-200 mt-2 sm:mt-4"
                        >
                            {current.skip}
                        </button>
                    )}
                </section>
            )}

            {/* Progress dots */}
            {step > 0 && (
                <div className="flex space-x-2 mt-10">
                    {onboardingSteps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full ${
                                idx === step ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Onboarding;
