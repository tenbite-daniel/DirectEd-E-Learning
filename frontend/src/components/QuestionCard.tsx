import React, { useState } from "react";
import {type  Question } from "../shared/quiztypes";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string>("");

  const handleChange = (value: string) => {
    setSelected(value);
    onAnswer(value);
  };

  return (
    <div className="border p-4 rounded shadow-md mb-4">
      <p className="font-semibold">{question.text}</p>
      {question.type === "multiple-choice" && question.options?.map((opt) => (
        <div key={opt}>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name={question._id}
              value={opt}
              checked={selected === opt}
              onChange={() => handleChange(opt)}
              className="mr-2"
            />
            {opt}
          </label>
        </div>
      ))}
      {question.type === "true-false" && ["true", "false"].map((opt) => (
        <div key={opt}>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name={question._id}
              value={opt}
              checked={selected === opt}
              onChange={() => handleChange(opt)}
              className="mr-2"
            />
            {opt}
          </label>
        </div>
      ))}
      {question.type === "short-answer" && (
        <input
          type="text"
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          className="border rounded p-1 w-full mt-2"
        />
      )}
    </div>
  );
};

export default QuestionCard;
