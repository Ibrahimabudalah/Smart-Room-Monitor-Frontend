import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatSuggestionList({
  suggestions,
  onSelect,
}: {
  suggestions: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <Card className="border-border/70 bg-background/95">
      <CardContent className="space-y-4 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Suggested prompts
          </p>
          <p className="text-sm text-muted-foreground">
            Start with one of these.
          </p>
        </div>

        <div className="flex flex-col gap-2">
        {suggestions.map((suggestion) => (
          <Button
            className="h-auto w-full justify-start whitespace-normal rounded-2xl px-4 py-3 text-left"
            key={suggestion}
            onClick={() => onSelect(suggestion)}
            type="button"
            variant="outline"
          >
            <Sparkles className="mr-2 size-3.5" />
            {suggestion}
          </Button>
        ))}
        </div>
      </CardContent>
    </Card>
  );
}
