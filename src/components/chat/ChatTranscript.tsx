import { Separator } from "@/components/ui/separator";
import type { ChatMessage } from "./types";
import ChatMessageBubble from "./ChatMessageBubble";

export default function ChatTranscript({
  messages,
  isReplying,
}: {
  messages: ChatMessage[];
  isReplying: boolean;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={message.id}>
              <ChatMessageBubble message={message} />
              {index < messages.length - 1 ? (
                <Separator className="mt-4" />
              ) : null}
            </div>
          ))}

          {isReplying ? (
            <ChatMessageBubble
              message={{
                id: "assistant-typing",
                role: "assistant",
                content: "Preparing a concise response based on your request.",
                timestamp: new Date().toISOString(),
              }}
              muted
            />
          ) : null}
        </div>
    </div>
  );
}
