"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;

const TAGLINE_PARTS = ["Tu formes.", " Ils recrutent.", " What else."];

export default function LoginPage() {
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<"google" | "linkedin" | "email" | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const supabase = createClient();
  const fullText = TAGLINE_PARTS.join("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  // Animation typage
  useEffect(() => {
    if (charIndex < fullText.length) {
      const timeout = setTimeout(
        () => {
          setDisplayedText(fullText.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        },
        charIndex === 0 ? 800 : 60
      );
      return () => clearTimeout(timeout);
    }
  }, [charIndex, fullText]);

  async function handleGoogleLogin() {
    setIsLoading("google");
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
    if (error) {
      setAuthError(error.message);
      setIsLoading(null);
    }
  }

  async function handleLinkedInLogin() {
    setIsLoading("linkedin");
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
    if (error) {
      setAuthError(error.message);
      setIsLoading(null);
    }
  }

  async function onEmailSubmit(data: LoginForm) {
    setIsLoading("email");
    setAuthError(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { emailRedirectTo: `${window.location.origin}/callback` },
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setEmailSent(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setAuthError(
          error.message === "Invalid login credentials"
            ? "Email ou mot de passe incorrect"
            : error.message
        );
      }
    }
    setIsLoading(null);
  }

  return (
    <div className="min-h-screen flex">
      {/* ── GAUCHE : hero sombre ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12 relative overflow-hidden">
        {/* Gradient subtil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1630] via-ink to-[#0a091a]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-2/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        {/* Logo */}
        <div className="relative z-10">
          <span className="font-syne font-bold text-xl text-white tracking-tight">
            Forma<span className="text-violet-2">Pro</span>
          </span>
        </div>

        {/* Tagline animée */}
        <div className="relative z-10 space-y-6">
          <p className="font-syne font-bold text-4xl xl:text-5xl text-white leading-tight">
            {displayedText}
            <span className="inline-block w-0.5 h-10 bg-violet-2 ml-1 animate-blink" />
          </p>
          <p className="text-[#8b88a8] font-dm text-lg leading-relaxed max-w-sm">
            Le copilote des formateurs indépendants — créez, vendez et pilotez
            vos formations avec l&apos;IA.
          </p>
        </div>

        {/* Stats sociales */}
        <div className="relative z-10 flex gap-8">
          {[
            { label: "formateurs actifs", value: "2 400+" },
            { label: "formations créées", value: "18 000+" },
            { label: "note moyenne", value: "4.9 ★" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-syne font-bold text-2xl text-white">{s.value}</p>
              <p className="text-[#8b88a8] text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── DROITE : formulaire ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <span className="font-syne font-bold text-2xl text-ink">
              Forma<span className="text-violet">Pro</span>
            </span>
          </div>

          <div>
            <h1 className="font-syne font-bold text-3xl text-ink">
              {isSignUp ? "Créer un compte" : "Bon retour 👋"}
            </h1>
            <p className="text-muted mt-2 font-dm">
              {isSignUp
                ? "Rejoins 2 400+ formateurs indépendants"
                : "Connecte-toi à ton espace FormaPro"}
            </p>
          </div>

          {emailSent ? (
            <div className="bg-violet-pale rounded-2xl p-6 text-center space-y-2">
              <p className="text-2xl">📬</p>
              <p className="font-syne font-semibold text-ink">Vérifie tes emails</p>
              <p className="text-muted text-sm">
                Un lien de confirmation t&apos;a été envoyé. Clique dessus pour activer ton compte.
              </p>
            </div>
          ) : (
            <>
              {/* OAuth buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading !== null}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-border",
                    "font-dm font-medium text-ink transition-all duration-150",
                    "hover:bg-bg hover:border-violet/30 hover:shadow-sm",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isLoading === "google" ? (
                    <span className="w-4 h-4 border-2 border-violet/30 border-t-violet rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continuer avec Google
                </button>

                <button
                  onClick={handleLinkedInLogin}
                  disabled={isLoading !== null}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 h-12 rounded-xl",
                    "bg-[#0A66C2] font-dm font-medium text-white transition-all duration-150",
                    "hover:bg-[#0855a3] hover:shadow-sm",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isLoading === "linkedin" ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <LinkedInIcon />
                  )}
                  Continuer avec LinkedIn
                </button>
              </div>

              {/* Séparateur */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted font-dm">ou par email</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Formulaire email */}
              <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-dm font-medium text-ink mb-1.5">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="toi@exemple.com"
                    className={cn(
                      "w-full h-12 px-4 rounded-xl border bg-white font-dm text-ink",
                      "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet",
                      "transition-all duration-150",
                      errors.email ? "border-red-400" : "border-border"
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-dm font-medium text-ink mb-1.5">
                    Mot de passe
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      "w-full h-12 px-4 rounded-xl border bg-white font-dm text-ink",
                      "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet",
                      "transition-all duration-150",
                      errors.password ? "border-red-400" : "border-border"
                    )}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                {authError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-red-600 text-sm font-dm">{authError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading !== null}
                  className={cn(
                    "w-full h-12 rounded-xl bg-violet text-white font-dm font-medium",
                    "hover:bg-[#3f35b0] transition-all duration-150 hover:shadow-lg hover:shadow-violet/25",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {isLoading === "email" && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {isSignUp ? "Créer mon compte" : "Se connecter"}
                </button>
              </form>

              {/* Toggle inscription/connexion */}
              <p className="text-center text-sm font-dm text-muted">
                {isSignUp ? "Déjà un compte ?" : "Pas encore inscrit ?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError(null);
                  }}
                  className="text-violet font-medium hover:underline"
                >
                  {isSignUp ? "Se connecter" : "Créer un compte"}
                </button>
              </p>
            </>
          )}

          {/* Footer légal */}
          <p className="text-center text-xs text-muted font-dm">
            En continuant, tu acceptes nos{" "}
            <a href="#" className="hover:text-violet underline">
              CGU
            </a>{" "}
            et notre{" "}
            <a href="#" className="hover:text-violet underline">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
