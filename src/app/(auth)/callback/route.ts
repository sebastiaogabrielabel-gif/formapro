import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // Collect all cookies set during the exchange (with their full options)
  const pendingCookies: Array<{
    name: string;
    value: string;
    options: CookieOptions;
  }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
setAll(cookiesToSet: { name: string; value: string; options: any }[]) {

          cookiesToSet.forEach(({ name, value, options }) => {
            // Make new cookies visible to subsequent calls in this handler
            request.cookies.set(name, value);
            pendingCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[Callback] Exchange error:", error.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, origin)
    );
  }

  // Determine redirect destination
  let redirectPath = "/onboarding";
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("onboarding_done")
      .eq("id", user.id)
      .single();

    if (profile?.onboarding_done) {
      redirectPath = "/dashboard";
    }
  }

  // Build redirect response and apply session cookies with full options
  const response = NextResponse.redirect(new URL(redirectPath, origin));
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
