-- Update the policy for profiles to allow users to view other users' profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a new policy that allows users to view any profile
CREATE POLICY "Users can view any profile" 
  ON public.profiles FOR SELECT 
  USING (true);
