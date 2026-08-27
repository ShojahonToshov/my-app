"use server";

import { createClient } from "@supabase/supabase-js";

const getAdminSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase admin environment variables");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

export async function getAdminUsers() {
  const supabase = getAdminSupabase();

  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (usersError) throw usersError;

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*");
  if (profilesError) throw profilesError;

  return usersData.users.map((user) => {
    const profile = profiles.find((p) => p.id === user.id);
    return {
      ...user,
      profile,
    };
  });
}

export async function deleteAdminUser(userId: string) {
  const supabase = getAdminSupabase();

  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;

  await supabase.from("profiles").delete().eq("id", userId);

  return true;
}

export async function deleteAllAdminUsers() {
  const supabase = getAdminSupabase();
  
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;

  const results = await Promise.allSettled(
    data.users.map(async (user) => {
      await supabase.auth.admin.deleteUser(user.id);
      await supabase.from("profiles").delete().eq("id", user.id);
    })
  );

  const failures = results.filter(r => r.status === "rejected");
  if (failures.length > 0) {
    throw new Error(`Failed to delete ${failures.length} users`);
  }

  return true;
}
