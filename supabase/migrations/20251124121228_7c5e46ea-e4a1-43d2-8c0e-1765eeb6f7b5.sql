-- Create storage bucket for call recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('call-recordings', 'call-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for call recordings
CREATE POLICY "Users can upload recordings for their calls"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'call-recordings' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM video_calls 
    WHERE student_id = auth.uid() OR admin_id = auth.uid()
  )
);

CREATE POLICY "Users can view recordings of their calls"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'call-recordings' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM video_calls 
    WHERE student_id = auth.uid() OR admin_id = auth.uid()
  )
);