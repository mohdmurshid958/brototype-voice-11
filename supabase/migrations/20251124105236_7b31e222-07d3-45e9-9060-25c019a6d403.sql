-- Create video_calls table
CREATE TABLE public.video_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_call_id text UNIQUE NOT NULL,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'missed')),
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  duration_seconds integer,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create call_participants table
CREATE TABLE public.call_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid REFERENCES public.video_calls(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stream_user_token text NOT NULL,
  joined_at timestamp with time zone,
  left_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(call_id, user_id)
);

-- Enable RLS
ALTER TABLE public.video_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_calls
CREATE POLICY "Students can view their own calls"
  ON public.video_calls FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all calls"
  ON public.video_calls FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Students can create calls"
  ON public.video_calls FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can update calls"
  ON public.video_calls FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Students can update their own calls"
  ON public.video_calls FOR UPDATE
  USING (auth.uid() = student_id);

-- RLS Policies for call_participants
CREATE POLICY "Users can view their own participation"
  ON public.call_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all participants"
  ON public.call_participants FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own participation"
  ON public.call_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_calls;

-- Create trigger for updated_at
CREATE TRIGGER update_video_calls_updated_at
  BEFORE UPDATE ON public.video_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();