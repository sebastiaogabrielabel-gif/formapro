import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Profile } from "@/types/database";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()) as { data: Profile | null; error: unknown };

  if (!profile?.onboarding_done) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-syne font-bold text-3xl text-ink">
          Bonjour {profile.full_name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted mt-1 font-dm">
          Voici ce qui se passe sur FormaPro aujourd&apos;hui.
        </p>
        {/* Module 3 sera construit ici */}
      </div>
    </div>
  );
}
