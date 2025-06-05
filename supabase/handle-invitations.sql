-- Function to handle invitations when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_invitations()
RETURNS TRIGGER AS $$
DECLARE
  app_record RECORD;
BEGIN
  -- For each app that has the new user's email in invited_emails
  FOR app_record IN 
    SELECT id, access_users, invited_emails 
    FROM public.app_ids 
    WHERE NEW.email = ANY(invited_emails)
  LOOP
    -- Add the user to access_users
    UPDATE public.app_ids 
    SET 
      access_users = array_append(app_record.access_users, NEW.id),
      invited_emails = array_remove(app_record.invited_emails, NEW.email)
    WHERE id = app_record.id;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user profile is created
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_invitations();
