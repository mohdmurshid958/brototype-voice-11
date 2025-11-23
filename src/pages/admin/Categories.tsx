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
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useComplaints } from "@/hooks/useComplaints";
import { Progress } from "@/components/ui/progress";

export default function AdminCategories() {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("blue");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: complaints } = useComplaints();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleAddCategory = () => {
    if (!categoryName.trim()) return;

    createCategory.mutate(
      {
        name: categoryName,
        color: categoryColor,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setCategoryName("");
          setCategoryColor("blue");
        },
      }
    );
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  const getCategoryCount = (categoryName: string) => {
    return complaints?.filter((c) => c.category === categoryName).length || 0;
  };

  const filteredCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
                      <option value="orange">Orange</option>
                      <option value="gray">Gray</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleAddCategory}
                    className="w-full hero-gradient"
                    disabled={!categoryName || createCategory.isPending}
                  >
                    {createCategory.isPending ? "Creating..." : "Create Category"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="p-4 md:p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Card>

          {categoriesLoading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading categories...</p>
            </Card>
          ) : filteredCategories.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No categories found</p>
            </Card>
          ) : (
            <div className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
              {filteredCategories.map((category) => (
                <Card key={category.id} className="p-4 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <Badge variant="secondary">{getCategoryCount(category.name)} complaints</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={deleteCategory.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div
                      className={`w-3 h-3 rounded-full`}
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="capitalize">{category.color}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {(categoriesLoading || createCategory.isPending || deleteCategory.isPending) && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Progress value={undefined} className="h-1 rounded-none" />
        </div>
      )}
    </div>
  );
}
