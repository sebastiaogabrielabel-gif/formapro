import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Profile } from "@/types/database";
import { redirect } from "next/navigation";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("onboarding_done")
    .eq("id", user.id)
    .single()) as { data: Pick<Profile, "onboarding_done"> | null; error: unknown };

  if (profile?.onboarding_done) redirect("/dashboard");

  return <OnboardingWizard />;
}
