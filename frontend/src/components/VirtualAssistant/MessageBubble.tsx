import React from "react";
import { type ChatMessage } from "../../shared/chatTypes";

interface MessageBubbleProps {
  msg: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ msg }) => {
  return (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
        {msg.sender === 'assistant' && (
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
            🤖
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            msg.sender === 'user'
              ? 'bg-gray-300 text-gray-800'
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          <p className="text-sm leading-relaxed">{msg.text}</p>
        </div>
        {msg.sender === 'user' && (
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
            👤
          </div>
        )}
      </div>
    </div>
  );
};