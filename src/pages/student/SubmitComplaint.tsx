import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateComplaint } from "@/hooks/useComplaints";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const createComplaint = useCreateComplaint();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!title || !category || !description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      let attachmentUrl = null;

      // Upload attachment if present
      if (attachment) {
        const fileExt = attachment.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('complaint-attachments')
          .upload(fileName, attachment);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('complaint-attachments')
          .getPublicUrl(fileName);

        attachmentUrl = publicUrl;
      }

      await createComplaint.mutateAsync({
        title,
        category,
        description,
        user_id: user.id,
        attachment_url: attachmentUrl,
      });

      // Reset form and navigate
      setTitle("");
      setCategory("");
      setDescription("");
      setAttachment(null);
      navigate("/student/complaints");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-8 pb-24 min-h-screen w-full">
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

                <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <div className="space-y-2">
                    {!attachment ? (
                      <div className="flex items-center gap-2">
                        <Input
                          id="attachment"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*,.pdf,.doc,.docx"
                          className="cursor-pointer"
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <span className="text-sm flex-1 truncate">{attachment.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeAttachment}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Supported formats: Images, PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createComplaint.isPending || uploading}
                  >
                    {uploading ? (
                      "Uploading..."
                    ) : createComplaint.isPending ? (
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
                    disabled={createComplaint.isPending || uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
        </Card>
      </div>
    </main>
  );
}
