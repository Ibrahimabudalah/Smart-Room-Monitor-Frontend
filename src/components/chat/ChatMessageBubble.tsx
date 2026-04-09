import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

export default function ChatMessageBubble({
  message,
  muted = false,
}: {
  message: ChatMessage;
  muted?: boolean;
}) {
  const isUser = message.role === "user";
  const timestamp = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(message.timestamp));

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] space-y-2 rounded-3xl px-4 py-4 text-sm leading-6 shadow-sm",
          isUser
            ? "bg-slate-950 text-white"
            : "border border-border/70 bg-background text-foreground",
          muted && "opacity-70",
        )}
      >
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em]">
          <span>{isUser ? "Operator" : "Assistant"}</span>
          <span
            className={cn(
              isUser ? "text-slate-300" : "text-muted-foreground",
            )}
          >
            {timestamp}
          </span>
        </div>
        <p>{message.content}</p>
      </div>
    </div>
  );
}
