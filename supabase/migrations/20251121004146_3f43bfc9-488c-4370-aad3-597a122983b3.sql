-- Create storage bucket for complaint attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-attachments', 'complaint-attachments', true);

-- Create storage policies for complaint attachments
CREATE POLICY "Users can upload their own complaint attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'complaint-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own complaint attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'complaint-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all complaint attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'complaint-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add attachment_url column to complaints table
ALTER TABLE public.complaints
ADD COLUMN attachment_url TEXT;