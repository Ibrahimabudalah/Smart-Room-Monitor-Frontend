import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isSubmitting: boolean;
}

export default function ChatComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: ChatComposerProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <form
      className="border-t border-border/70 bg-muted/30 px-6 py-5"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <Textarea
          id="chat-message"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask about the latest room conditions or what to do next."
          rows={3}
          value={value}
        />
        <div className="flex justify-end">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Replying..." : "Send message"}
          </Button>
        </div>
      </div>
    </form>
  );
}
