-- Create benefits table with the schema from your backend
CREATE TABLE public.benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  benefit_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_nl TEXT,
  provider TEXT,
  type TEXT CHECK (type IN ('national', 'municipal', 'private')),
  description TEXT,
  description_nl TEXT,
  application_url TEXT,
  eligibility_summary JSONB DEFAULT '[]'::jsonb,
  eligibility_summary_nl JSONB DEFAULT '[]'::jsonb,
  required_documents JSONB DEFAULT '[]'::jsonb,
  application_steps JSONB DEFAULT '[]'::jsonb,
  application_steps_nl JSONB DEFAULT '[]'::jsonb,
  eligibility_logic JSONB,
  estimated_amount TEXT,
  estimated_amount_nl TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access (benefits are public info)
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benefits are publicly readable" 
ON public.benefits 
FOR SELECT 
USING (true);

-- Create forum posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT DEFAULT 'Anonymous',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  upvoted_by TEXT[] DEFAULT '{}',
  downvoted_by TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can read posts
CREATE POLICY "Posts are publicly readable" 
ON public.posts 
FOR SELECT 
USING (true);

-- Anyone can create posts (anonymous forum)
CREATE POLICY "Anyone can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (true);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts" 
ON public.posts 
FOR UPDATE 
USING (author_id = coalesce(auth.uid()::text, author_id));

-- Create post replies table
CREATE TABLE public.post_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT DEFAULT 'Anonymous',
  upvotes INTEGER DEFAULT 0,
  upvoted_by TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Replies are publicly readable" 
ON public.post_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create replies" 
ON public.post_replies 
FOR INSERT 
WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_benefits_updated_at
BEFORE UPDATE ON public.benefits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();