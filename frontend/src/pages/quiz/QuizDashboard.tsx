import React from "react";
import { Link } from "react-router-dom";

const QuizDashboardPage: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quiz Dashboard</h1>
            <ul className="space-y-3">
                <li>
                    <Link to="/quiz" className="text-blue-600 hover:underline">
                        ➕ Create a Quiz
                    </Link>
                </li>
                <li>
                    <Link
                        to="/quiz/002"
                        className="text-blue-600 hover:underline"
                    >
                        📝 Take Quiz for Lesson 123
                    </Link>
                </li>
                <li>
                    <Link
                        to="/view-quiz/567"
                        className="text-blue-600 hover:underline"
                    >
                        👀 View Quiz for Lesson 123
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default QuizDashboardPage;
