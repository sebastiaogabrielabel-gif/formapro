import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

// Supabase generics resolve to `never` for complex Insert/Update types in this codebase.
// We cast to `unknown` at the query level to preserve runtime safety while bypassing the TS error.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

export async function POST(request: Request) {
  try {
    const supabase = (await createServerSupabaseClient()) as AnyClient;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const {
      full_name,
      specialty,
      bio,
      location_city,
      location_country,
      experience_years,
      daily_rate,
      experiences,
      skills,
      pedagogy_dna,
      availability,
    } = body;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name,
        specialty,
        bio,
        location_city,
        location_country,
        experience_years: Number(experience_years) || 0,
        daily_rate: Number(daily_rate) || null,
        onboarding_done: true,
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("[Onboarding] Profile update error:", profileError.message);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (Array.isArray(experiences) && experiences.length > 0) {
      const { error: expError } = await supabase
        .from("experiences")
        .insert(
          experiences.map(
            (exp: {
              title: string;
              organization: string;
              period_start: string;
              period_end: string | null;
              description: string;
              trainees_count: number;
            }) => ({
              profile_id: user.id,
              title: exp.title,
              organization: exp.organization,
              period_start: exp.period_start || null,
              period_end: exp.period_end || null,
              description: exp.description || null,
              trainees_count: Number(exp.trainees_count) || 0,
            })
          )
        );
      if (expError) {
        console.error("[Onboarding] Experiences error:", expError.message);
      }
    }

    if (Array.isArray(skills) && skills.length > 0) {
      const { error: skillError } = await supabase
        .from("skills")
        .insert(
          skills.map((skill: { name: string; category: string }) => ({
            profile_id: user.id,
            name: skill.name,
            category: skill.category,
          }))
        );
      if (skillError) {
        console.error("[Onboarding] Skills error:", skillError.message);
      }
    }

    if (pedagogy_dna) {
      const { error: dnaError } = await supabase.from("pedagogy_dna").upsert({
        profile_id: user.id,
        animation_styles: pedagogy_dna.animation_styles ?? [],
        posture: pedagogy_dna.posture || null,
        rhythm: pedagogy_dna.rhythm || null,
        tools: pedagogy_dna.tools ?? [],
        tone: pedagogy_dna.tone || null,
      });
      if (dnaError) {
        console.error("[Onboarding] Pedagogy DNA error:", dnaError.message);
      }
    }

    if (availability) {
      const { error: availError } = await supabase
        .from("availabilities")
        .upsert({
          profile_id: user.id,
          days_of_week: availability.days_of_week ?? [],
          available_from: availability.available_from || null,
          formats: availability.formats ?? [],
        });
      if (availError) {
        console.error("[Onboarding] Availability error:", availError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Onboarding] Unexpected error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
