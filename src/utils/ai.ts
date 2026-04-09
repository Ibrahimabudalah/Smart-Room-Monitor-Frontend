import api from "./axios";

export interface AiInsightResponse {
  issue: string;
  suggestion: string;
}

export interface AiPredictionResponse {
  trend: string;
  estimated_temp_in_1_hour: number;
  advice: string;
}

export interface AiChatResponse {
  reply: string;
}

export async function getAiInsights() {
  const response = await api.get("/ai/insights");
  return response.data as AiInsightResponse;
}

export async function getAiPrediction() {
  const response = await api.get("/ai/predict");
  return response.data as AiPredictionResponse;
}

export async function getAiChatReply(message: string) {
  const response = await api.get("/ai/chat", {
    params: {
      message,
    },
  });

  return (response.data as AiChatResponse).reply;
}
