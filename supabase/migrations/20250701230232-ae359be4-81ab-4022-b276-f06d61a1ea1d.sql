
-- Create table to store business plans and user information
CREATE TABLE public.business_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  email TEXT NOT NULL,
  target_audience TEXT,
  current_channels TEXT[] DEFAULT '{}',
  monthly_budget INTEGER NOT NULL,
  primary_goal TEXT NOT NULL,
  current_challenges TEXT[] DEFAULT '{}',
  timeframe TEXT NOT NULL,
  team_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to store consultation requests
CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_plan_id UUID REFERENCES public.business_plans(id),
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is a lead generation tool)
CREATE POLICY "Allow public insert on business_plans" 
  ON public.business_plans 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert on consultation_requests" 
  ON public.consultation_requests 
  FOR INSERT 
  WITH CHECK (true);
