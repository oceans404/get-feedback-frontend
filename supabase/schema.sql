-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create app_ids table
CREATE TABLE IF NOT EXISTS public.app_ids (
  id SERIAL PRIMARY KEY,
  app_id TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  access_users UUID[] DEFAULT '{}' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_ids ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create policies for app_ids
CREATE POLICY "Users can view app_ids they have access to" 
  ON public.app_ids FOR SELECT 
  USING (
    owner_id = auth.uid() OR 
    auth.uid() = ANY(access_users)
  );

CREATE POLICY "Users can insert their own app_ids" 
  ON public.app_ids FOR INSERT 
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update app_ids they own" 
  ON public.app_ids FOR UPDATE 
  USING (owner_id = auth.uid());

CREATE POLICY "Users can delete app_ids they own" 
  ON public.app_ids FOR DELETE 
  USING (owner_id = auth.uid());

-- Create a function to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
