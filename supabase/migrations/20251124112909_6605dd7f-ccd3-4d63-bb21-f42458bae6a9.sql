-- Allow admins to create calls for any student
CREATE POLICY "Admins can create calls"
ON public.video_calls
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));