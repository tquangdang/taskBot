export type ChatRole = "user" | "bot";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

