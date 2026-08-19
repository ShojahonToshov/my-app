-- Create a hook to add custom claims to the JWT
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
  declare
    claims jsonb;
    user_role text;
    user_onboarding_step int;
  begin
    -- Fetch the user role and onboarding step
    select role::text, onboarding_step::int into user_role, user_onboarding_step 
    from public.profiles 
    where id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      claims := jsonb_set(claims, '{app_metadata, role}', to_jsonb(user_role));
    end if;

    if user_onboarding_step is not null then
      claims := jsonb_set(claims, '{app_metadata, onboarding_step}', to_jsonb(user_onboarding_step));
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
