import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Image as ImageIcon, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VirtualBackgroundSelectorProps {
  onBackgroundChange: (background: string | null) => void;
  currentBackground: string | null;
}

const BACKGROUNDS = [
  { id: "none", label: "None", preview: null },
  { id: "blur", label: "Blur", preview: "blur" },
  { 
    id: "office", 
    label: "Office", 
    preview: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
  },
  { 
    id: "nature", 
    label: "Nature", 
    preview: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop"
  },
  { 
    id: "abstract", 
    label: "Abstract", 
    preview: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop"
  },
  { 
    id: "gradient", 
    label: "Gradient", 
    preview: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop"
  },
];

export const VirtualBackgroundSelector = ({ 
  onBackgroundChange, 
  currentBackground 
}: VirtualBackgroundSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (backgroundId: string) => {
    const background = BACKGROUNDS.find(bg => bg.id === backgroundId);
    onBackgroundChange(background?.preview || null);
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
          <ImageIcon className="w-5 h-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-[#202124] border-l border-[#5f6368]/20">
        <SheetHeader>
          <SheetTitle className="text-white">Virtual Backgrounds</SheetTitle>
        </SheetHeader>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              onClick={() => handleSelect(bg.id)}
              className={cn(
                "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                currentBackground === bg.preview
                  ? "border-blue-500 ring-2 ring-blue-500/50"
                  : "border-[#5f6368]/20 hover:border-[#5f6368]"
              )}
            >
              {bg.preview === null ? (
                <div className="w-full h-full bg-[#3c4043] flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-white/50" />
                </div>
              ) : bg.preview === "blur" ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 backdrop-blur-xl" />
              ) : (
                <img 
                  src={bg.preview} 
                  alt={bg.label}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                <p className="text-white text-xs text-center">{bg.label}</p>
              </div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
