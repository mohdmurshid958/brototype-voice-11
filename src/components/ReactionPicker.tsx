import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Smile } from "lucide-react";

const REACTIONS = [
  "👍", "👎", "👏", "🎉", "❤️", "😂",
  "😮", "😢", "🔥", "✨", "💯", "🙌",
  "🤔", "😍", "🚀", "👋", "💪", "🎊"
];

interface ReactionPickerProps {
  onReactionSend: (emoji: string) => void;
}

export const ReactionPicker = ({ onReactionSend }: ReactionPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleReactionClick = (emoji: string) => {
    onReactionSend(emoji);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full w-12 h-12 p-0 bg-[#3c4043] hover:bg-[#5f6368]"
        >
          <Smile className="w-5 h-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-64 bg-[#202124] border-t border-[#5f6368]/20">
        <SheetHeader>
          <SheetTitle className="text-white">Send Reaction</SheetTitle>
        </SheetHeader>
        <div className="mt-6 grid grid-cols-6 gap-3">
          {REACTIONS.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleReactionClick(emoji)}
              className="aspect-square rounded-lg bg-[#3c4043] hover:bg-[#5f6368] transition-all flex items-center justify-center text-4xl hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
