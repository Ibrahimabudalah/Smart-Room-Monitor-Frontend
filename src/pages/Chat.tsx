import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatComposer from "@/components/chat/ChatComposer";
import ChatSuggestionList from "@/components/chat/ChatSuggestionList";
import ChatTranscript from "@/components/chat/ChatTranscript";
import type { ChatMessage } from "@/components/chat/types";
import { getAiChatReply } from "@/utils/ai";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const suggestions = [
    "Is the room comfortable right now?",
    "What does the current humidity mean?",
    "What should I do about the temperature trend?",
  ];

  const submitMessage = async (content: string) => {
    const trimmed = content.trim();

    if (!trimmed || isReplying) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setDraft("");
    setIsReplying(true);

    try {
      const reply = await getAiChatReply(trimmed);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (caughtError) {
      console.error(caughtError);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "The assistant could not reach the chatbot API right now. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="overflow-hidden border-border/70 bg-background/95">
        <CardContent className="flex min-h-[36rem] flex-col px-0 pb-0 pt-0">
          <ChatTranscript isReplying={isReplying} messages={messages} />
          <ChatComposer
            isSubmitting={isReplying}
            onChange={setDraft}
            onSubmit={submitMessage}
            value={draft}
          />
        </CardContent>
      </Card>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <ChatSuggestionList
          onSelect={submitMessage}
          suggestions={suggestions}
        />
      </div>
    </div>
  );
}
