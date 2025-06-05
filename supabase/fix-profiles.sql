-- Ensure all users have profiles with emails
INSERT INTO public.profiles (id, email)
SELECT 
  auth.users.id, 
  auth.users.email
FROM 
  auth.users
LEFT JOIN 
  public.profiles ON auth.users.id = public.profiles.id
WHERE 
  public.profiles.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Update any profiles that might have null emails
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id AND (profiles.email IS NULL OR profiles.email = '');
