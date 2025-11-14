import { useState } from "react";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function SubmitComplaint() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been submitted successfully!",
    });
    navigate("/student/complaints");
  };

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Submit a Complaint</h1>
          <p className="text-muted-foreground mb-8">Fill out the form below to submit your complaint</p>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Complaint Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="mentorship">Mentorship</SelectItem>
                    <SelectItem value="technical">Technical Issues</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your complaint"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="attachment">Attachment (Optional)</Label>
                <Input id="attachment" type="file" />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="hero-gradient flex-1">
                  Submit Complaint
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/student/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
