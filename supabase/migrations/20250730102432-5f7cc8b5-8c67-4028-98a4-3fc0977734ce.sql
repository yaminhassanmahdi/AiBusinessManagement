-- Fix search path security issues for functions
DROP FUNCTION IF EXISTS public.get_user_role(UUID);
DROP FUNCTION IF EXISTS public.get_user_business_id(UUID);
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Recreate functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE profiles.user_id = $1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_business_id(user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN p.role = 'admin' THEN NULL
    WHEN p.role = 'saas_user' THEN b.id
    WHEN p.role = 'team_member' THEN tm.business_id
    ELSE NULL
  END
  FROM public.profiles p
  LEFT JOIN public.businesses b ON b.owner_id = p.id
  LEFT JOIN public.team_members tm ON tm.user_id = p.id AND tm.is_active = true
  WHERE p.user_id = $1
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;