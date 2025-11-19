import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateComplaint } from "@/hooks/useComplaints";

const categories = [
  "Infrastructure",
  "Technical Issues",
  "Mentorship",
  "Administrative",
  "Academic",
  "Facilities",
  "Other",
];

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createComplaint = useCreateComplaint();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    await createComplaint.mutateAsync({
      title,
      category,
      description,
      user_id: user.id,
    });

    // Reset form and navigate
    setTitle("");
    setCategory("");
    setDescription("");
    navigate("/student/complaints");
  };

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/student/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="p-4 md:p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Submit a Complaint</h1>
                <p className="text-muted-foreground">
                  Share your concerns and we'll address them promptly
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Complaint Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief title of your complaint"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your complaint"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Be as specific as possible to help us understand and resolve your issue
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createComplaint.isPending}
                  >
                    {createComplaint.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Complaint
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/student/dashboard")}
                    disabled={createComplaint.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
