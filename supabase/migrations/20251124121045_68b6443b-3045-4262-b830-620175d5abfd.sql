-- Create table for video call messages
CREATE TABLE IF NOT EXISTS public.video_call_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES public.video_calls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_call_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view messages in their calls"
  ON public.video_call_messages
  FOR SELECT
  USING (
    call_id IN (
      SELECT id FROM public.video_calls 
      WHERE student_id = auth.uid() OR admin_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their calls"
  ON public.video_call_messages
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    call_id IN (
      SELECT id FROM public.video_calls 
      WHERE student_id = auth.uid() OR admin_id = auth.uid()
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_call_messages;

-- Create table for call recordings
CREATE TABLE IF NOT EXISTS public.call_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES public.video_calls(id) ON DELETE CASCADE,
  recording_url TEXT NOT NULL,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.call_recordings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view recordings of their calls"
  ON public.call_recordings
  FOR SELECT
  USING (
    call_id IN (
      SELECT id FROM public.video_calls 
      WHERE student_id = auth.uid() OR admin_id = auth.uid()
    )
  );

CREATE POLICY "Users can create recordings for their calls"
  ON public.call_recordings
  FOR INSERT
  WITH CHECK (
    call_id IN (
      SELECT id FROM public.video_calls 
      WHERE student_id = auth.uid() OR admin_id = auth.uid()
    )
  );