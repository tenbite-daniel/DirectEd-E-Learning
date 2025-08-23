import React, { useState, useEffect, useRef } from "react";
import { type ChatMessage, type ChatContext } from "../../shared/chatTypes";
import { MessageBubble } from "./MessageBubble";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";
import { Header } from "../layouts/Header";
import chatbotIcon from "../../assets/chatbot.png";

export const VirtualAssistant: React.FC<{ context: ChatContext }> = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Initialize with a welcome message
    useEffect(() => {
        const welcomeMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: "assistant",
            text: "Hello, I'm Bingo. How can i help you?",
            timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
    }, []);

    // Auto-scroll to bottom when new messages come in
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Simple mock responses based on input
    const generateResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (
            lowerMessage.includes("enroll") ||
            lowerMessage.includes("course")
        ) {
            return "To enroll in a course, go to the course page and click the 'Enroll' button. You can browse available courses from the main dashboard.";
        }
        if (lowerMessage.includes("certificate")) {
            return "Your certificates can be found in your profile section. Once you complete a course, the certificate will be automatically generated and available for download.";
        }
        if (
            lowerMessage.includes("profile") ||
            lowerMessage.includes("update")
        ) {
            return "To update your profile, click on your avatar in the top right corner and select 'Profile Settings'. You can update your personal information, preferences, and password there.";
        }
        if (
            lowerMessage.includes("feature") ||
            lowerMessage.includes("platform")
        ) {
            return "Our platform features include: video lessons, interactive quizzes, progress tracking, certificates, and this virtual assistant. You can access most features from the main navigation menu.";
        }
        if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
            return "I'm here to help! You can ask me about enrolling in courses, accessing certificates, updating your profile, or navigating the platform features.";
        }
        if (lowerMessage.includes("quiz")) {
            return "Quizzes are available for each lesson. You can take them to test your knowledge and track your progress. Your quiz results are saved in your profile.";
        }
        if (lowerMessage.includes("video") || lowerMessage.includes("lesson")) {
            return "Video lessons can be accessed from your enrolled courses. You can pause, rewind, and take notes while watching. Your progress is automatically saved.";
        }
        if (
            lowerMessage.includes("draw") ||
            lowerMessage.includes("button") ||
            lowerMessage.includes("prototype") ||
            lowerMessage.includes("dribbble")
        ) {
            return "For design and prototyping questions, I'd recommend checking out design resources like Figma, Sketch, or Adobe XD. You can also explore design inspiration on platforms like Dribbble and Behance!";
        }

        // Default response
        return (
            "I understand you're asking about: " +
            userMessage +
            ". While I'm still learning, you can use the quick actions above for common questions, or try asking about courses, certificates, profiles, or platform features!"
        );
    };

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: "user",
            text,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const responseText = generateResponse(text);
            const assistantResponse: ChatMessage = {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: responseText,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, assistantResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    return (
        <div className="">
            <div className="flex flex-col h-full bg-white relative rounded-2xl overflow-hidden shadow-lg border border-amber-100 mt-20">
                <div className="w-full bg-[linear-gradient(to_bottom,_#395241,_#80B892)] mb-10">
                    <img
                        src={chatbotIcon}
                        alt="chatbot icon"
                        className="w-48 mx-auto"
                    />

                    <p className="text-2xl font-semibold text-white text-center my-2">
                        Hi User!
                    </p>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}

                    {/* Typing indicator */}
                    {isTyping && <TypingIndicator />}

                    <div ref={messagesEndRef} />
                </div>
                {/* Quick Actions Header */}
                <QuickActions onSelect={handleSend} />
                {/* Input Area */}
                <div className="sticky bottom-0 p-6 pt-4 bg-[#5D7163]">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 bg-white rounded-2xl border border-gray-300 px-4 py-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                            <input
                                className="w-full outline-none text-gray-700 placeholder-gray-400"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Write a message..."
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleSend(input)
                                }
                                disabled={isTyping}
                            />
                        </div>
                        <button
                            onClick={() => handleSend(input)}
                            disabled={!input.trim() || isTyping}
                            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center font-bold text-blue-700 transition-colors shadow-lg"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
