import React, { useState, useEffect, useRef } from "react";
import { type ChatMessage, type ChatContext } from "../../shared/chatTypes";

import chatbotIcon from "../../assets/chatbot.png";

// Define the API endpoint for your FastAPI backend
const API_URL = "https://directed-e-learning.onrender.com";

// -----------------------------------------------------------
// Component Props and Definitions
// -----------------------------------------------------------

interface HeaderProps {
    title: string;
    icon: string;
}

const Header: React.FC<HeaderProps> = ({ title, icon }) => {
    return (
        <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
            <img src={icon} alt="icon" className="h-8 w-8" />
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
    );
};

interface MessageBubbleProps {
    message: ChatMessage;
    isLast: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
    const isAssistant = message.sender === "assistant";
    const bubbleClasses = isAssistant
        ? "bg-indigo-500 text-white rounded-br-2xl rounded-tr-2xl rounded-tl-2xl self-start"
        : "bg-gray-200 text-gray-800 rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl self-end";

    return (
        <div className={`flex flex-col mb-4 max-w-[80%] ${isAssistant ? "items-start" : "items-end"}`}>
            <div className={`p-3 text-sm shadow-md ${bubbleClasses}`}>
                {message.text}
            </div>
        </div>
    );
};

interface QuickActionsProps {
    onSelect: (actionText: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onSelect }) => {
    const actions = [
        "Explain LLMs",
        "Give me a quiz on FastAPI",
        "What is a vector store?",
    ];
    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(action)}
                    className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {action}
                </button>
            ))}
        </div>
    );
};

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center space-x-1 mb-4">
            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
    );
};

// -----------------------------------------------------------
// Main Virtual Assistant Component
// -----------------------------------------------------------

export const VirtualAssistant: React.FC<{ context: ChatContext }> = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Initialize with a welcome message on component mount
    useEffect(() => {
        const welcomeMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: "assistant",
            text: "Hello, I'm DirectEd. How can I help you learn today?",
            timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
    }, []);

    // Auto-scroll to the bottom when a new message is added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Function to send a message to the backend and get a response
    const fetchAssistantResponse = async (userMessage: string) => {
        setIsTyping(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/assistant/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: "your_user_id_here", 
                    request_text: userMessage,
                    is_instructor: false, 
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: data.output.text, 
                timestamp: new Date().toISOString(),
            };
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } catch (error) {
            console.error("Failed to fetch response:", error);
            const errorMessage: ChatMessage = {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date().toISOString(),
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: "user",
            text: input,
            timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");

        await fetchAssistantResponse(input);
    };

    const handleQuickAction = (actionText: string) => {
        setInput(actionText);
        // It's better to call handleSendMessage directly here
        // to send the message immediately after setting the input.
        fetchAssistantResponse(actionText);
    };

    return (
        <div className="flex h-full flex-col bg-slate-50 shadow-lg sm:rounded-lg">
            <Header title="DirectEd Assistant" icon={chatbotIcon} />

            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isLast={index === messages.length - 1}
                    />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
                <QuickActions onSelect={handleQuickAction} />
                <div className="mt-2 flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") handleSendMessage();
                        }}
                        placeholder="Type your question..."
                        className="flex-1 rounded-l-md border border-gray-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="rounded-r-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        disabled={isTyping || input.trim() === ""}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};