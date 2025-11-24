import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VirtualBackgroundSelectorProps {
  onBackgroundChange: (background: string | null) => void;
  currentBackground: string | null;
}

const BACKGROUNDS = [
  { id: "none", label: "None", category: "Basic", preview: null },
  { id: "blur", label: "Blur", category: "Basic", preview: "blur" },
  
  // Office & Professional
  { 
    id: "office1", 
    label: "Modern Office", 
    category: "Office",
    preview: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop"
  },
  { 
    id: "office2", 
    label: "Co-working Space", 
    category: "Office",
    preview: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop"
  },
  { 
    id: "office3", 
    label: "Home Office", 
    category: "Office",
    preview: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop"
  },
  { 
    id: "library", 
    label: "Library", 
    category: "Office",
    preview: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop"
  },
  
  // Nature & Outdoor
  { 
    id: "nature1", 
    label: "Forest", 
    category: "Nature",
    preview: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop"
  },
  { 
    id: "nature2", 
    label: "Mountains", 
    category: "Nature",
    preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
  },
  { 
    id: "nature3", 
    label: "Beach", 
    category: "Nature",
    preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop"
  },
  { 
    id: "nature4", 
    label: "Desert", 
    category: "Nature",
    preview: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=400&fit=crop"
  },
  
  // Urban & City
  { 
    id: "city1", 
    label: "City Skyline", 
    category: "Urban",
    preview: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop"
  },
  { 
    id: "city2", 
    label: "Modern Architecture", 
    category: "Urban",
    preview: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
  },
  { 
    id: "city3", 
    label: "Street View", 
    category: "Urban",
    preview: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop"
  },
  
  // Abstract & Artistic
  { 
    id: "abstract1", 
    label: "Geometric", 
    category: "Abstract",
    preview: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&h=400&fit=crop"
  },
  { 
    id: "abstract2", 
    label: "Colorful", 
    category: "Abstract",
    preview: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
  },
  { 
    id: "gradient1", 
    label: "Blue Gradient", 
    category: "Abstract",
    preview: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=400&fit=crop"
  },
  { 
    id: "gradient2", 
    label: "Purple Gradient", 
    category: "Abstract",
    preview: "https://images.unsplash.com/photo-1557672199-6ac7c533ae6b?w=600&h=400&fit=crop"
  },
  
  // Space & Sci-Fi
  { 
    id: "space1", 
    label: "Galaxy", 
    category: "Space",
    preview: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop"
  },
  { 
    id: "space2", 
    label: "Stars", 
    category: "Space",
    preview: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop"
  },
  { 
    id: "space3", 
    label: "Nebula", 
    category: "Space",
    preview: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&h=400&fit=crop"
  },
];

export const VirtualBackgroundSelector = ({ 
  onBackgroundChange, 
  currentBackground 
}: VirtualBackgroundSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(BACKGROUNDS.map(bg => bg.category)))];
  
  const filteredBackgrounds = selectedCategory === "All" 
    ? BACKGROUNDS 
    : BACKGROUNDS.filter(bg => bg.category === selectedCategory);

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
      <SheetContent side="right" className="w-96 bg-[#202124] border-l border-[#5f6368]/20">
        <SheetHeader>
          <SheetTitle className="text-white">Virtual Backgrounds</SheetTitle>
        </SheetHeader>
        
        {/* Category Filter */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-[#3c4043] text-white/70 hover:bg-[#5f6368]"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] mt-4">
          <div className="grid grid-cols-2 gap-3 pr-4">
            {filteredBackgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleSelect(bg.id)}
                className={cn(
                  "relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
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
                    loading="lazy"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-2">
                  <p className="text-white text-[10px] font-medium text-center">{bg.label}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
