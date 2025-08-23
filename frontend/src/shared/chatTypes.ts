export interface ChatMessage {
    id: string;
    sender: "user" | "assistant";
    text: string;
    timestamp: string;
}

export interface ChatContext {
    page: string;
    courseId?: string;
    lessonId?: string;
}

export interface ChatRequest {
    message: string;
    context: ChatContext;
    sessionId: string;
}

export interface ChatResponse {
    sessionId: string;
    reply: ChatMessage;
    history?: ChatMessage[];
}
