// src/hooks/useQuiz.ts
import { useContext } from "react";
import { QuizContext, type QuizContextType } from "../context/QuizContext";

// Custom hook to use the quiz context
export const useQuiz = (): QuizContextType => {
    const context = useContext(QuizContext);
    if (context === undefined) {
        throw new Error("useQuiz must be used within a QuizProvider");
    }
    return context;
};
