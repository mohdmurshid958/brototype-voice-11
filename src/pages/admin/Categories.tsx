import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, FolderKanban } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminCategories() {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("blue");
  
  const categories = [
    { id: 1, name: "Infrastructure", count: 12, color: "blue" },
    { id: 2, name: "Mentorship", count: 8, color: "purple" },
    { id: 3, name: "Technical Issues", count: 15, color: "red" },
    { id: 4, name: "Administrative", count: 6, color: "green" },
    { id: 5, name: "Other", count: 7, color: "gray" },
  ];

  const handleAddCategory = () => {
    console.log("Adding category:", { categoryName, categoryColor });
    setIsDialogOpen(false);
    setCategoryName("");
    setCategoryColor("blue");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Categories Management</h1>
              <p className="text-sm md:text-base text-muted-foreground">Manage complaint categories</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="hero-gradient w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5" />
                    Add New Category
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="e.g., Infrastructure"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryColor">Color Theme</Label>
                    <select
                      id="categoryColor"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                    >
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="red">Red</option>
                      <option value="green">Green</option>
                      <option value="gray">Gray</option>
                    </select>
                  </div>
                  <Button 
                    onClick={handleAddCategory} 
                    className="w-full hero-gradient"
                    disabled={!categoryName}
                  >
                    Create Category
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search categories..." className="pl-10" />
              </div>
            </div>

            {isMobile ? (
              <div className="space-y-3">
                {categories.map((category) => (
                  <Card key={category.id} className="p-4 hover:border-primary transition-colors animate-fade-in">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-2">{category.name}</h3>
                        <Badge className={`bg-${category.color}-500/10 text-${category.color}-500`}>
                          {category.count} complaints
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive flex-1">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.id} className="p-6 hover:border-primary transition-colors animate-fade-in">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                        <Badge className={`bg-${category.color}-500/10 text-${category.color}-500`}>
                          {category.count} complaints
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Category Statistics</h2>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{category.count} complaints</span>
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className={`bg-${category.color}-500 h-2 rounded-full`}
                        style={{ width: `${(category.count / 48) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
