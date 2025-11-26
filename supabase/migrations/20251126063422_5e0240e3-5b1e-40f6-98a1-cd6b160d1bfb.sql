-- Allow all authenticated users to view admin roles
-- This is necessary so students can see who the admins are to initiate calls
CREATE POLICY "Anyone can view admin roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (role = 'admin');