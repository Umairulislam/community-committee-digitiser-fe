/** Role in the AI assistant conversation. */
export type ChatRole = 'user' | 'assistant';

/** A single message in the AI assistant conversation. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  /** True while the assistant response is still being fetched. */
  loading?: boolean;
}

/** Request body for POST /ai/assistant. */
export interface AskAssistantParams {
  question: string;
  committeeId?: string;
}

/** Success response from POST /ai/assistant. */
export interface AskAssistantResponse {
  answer: string;
}
