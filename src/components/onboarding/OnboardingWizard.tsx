"use client";

import { useState } from "react";
import StepIndicator from "./StepIndicator";
import Step1Identity from "./steps/Step1Identity";
import Step2Experience from "./steps/Step2Experience";
import Step3Skills from "./steps/Step3Skills";
import Step4PedagogyDna from "./steps/Step4PedagogyDna";
import Step5Availability from "./steps/Step5Availability";
import Step6Review from "./steps/Step6Review";

export type ExperienceEntry = {
  title: string;
  organization: string;
  period_start: string;
  period_end: string | null;
  description: string;
  trainees_count: number;
};

export type SkillEntry = {
  name: string;
  category: "domain" | "skill" | "public" | "format";
};

export type PedagogyDnaData = {
  animation_styles: string[];
  posture: string;
  rhythm: string;
  tools: string[];
  tone: string;
};

export type AvailabilityData = {
  days_of_week: number[];
  available_from: string;
  formats: string[];
};

export type OnboardingData = {
  full_name: string;
  specialty: string;
  bio: string;
  location_city: string;
  location_country: string;
  experience_years: number;
  daily_rate: number;
  experiences: ExperienceEntry[];
  skills: SkillEntry[];
  pedagogy_dna: PedagogyDnaData;
  availability: AvailabilityData;
};

const INITIAL_DATA: OnboardingData = {
  full_name: "",
  specialty: "",
  bio: "",
  location_city: "",
  location_country: "France",
  experience_years: 0,
  daily_rate: 0,
  experiences: [],
  skills: [],
  pedagogy_dna: {
    animation_styles: [],
    posture: "",
    rhythm: "",
    tools: [],
    tone: "",
  },
  availability: {
    days_of_week: [],
    available_from: "",
    formats: [],
  },
};

const STEPS = [
  { id: 1, label: "Identité" },
  { id: 2, label: "Parcours" },
  { id: 3, label: "Compétences" },
  { id: 4, label: "ADN Pédago" },
  { id: 5, label: "Disponibilités" },
  { id: 6, label: "Récapitulatif" },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNext(stepData: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...stepData }));
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  }

  function handleBack() {
    setStep((s) => s - 1);
    window.scrollTo(0, 0);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Erreur lors de la sauvegarde. Réessaie.");
        setSubmitting(false);
      }
    } catch {
      setError("Erreur réseau. Vérifie ta connexion.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="font-syne font-bold text-2xl text-ink">
            Forma<span className="text-violet">Pro</span>
          </span>
          <p className="text-muted font-dm text-sm mt-1">
            Configuration de ton profil — étape {step} sur {STEPS.length}
          </p>
        </div>

        <StepIndicator steps={STEPS} current={step} />

        <div className="mt-10 bg-white rounded-2xl border border-border p-8 shadow-sm">
          {step === 1 && <Step1Identity data={data} onNext={handleNext} />}
          {step === 2 && (
            <Step2Experience data={data} onNext={handleNext} onBack={handleBack} />
          )}
          {step === 3 && (
            <Step3Skills data={data} onNext={handleNext} onBack={handleBack} />
          )}
          {step === 4 && (
            <Step4PedagogyDna data={data} onNext={handleNext} onBack={handleBack} />
          )}
          {step === 5 && (
            <Step5Availability data={data} onNext={handleNext} onBack={handleBack} />
          )}
          {step === 6 && (
            <Step6Review
              data={data}
              onBack={handleBack}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
          {error && (
            <p className="mt-4 text-red-500 text-sm font-dm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
