"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Briefcase } from "lucide-react";
import type { OnboardingData, ExperienceEntry } from "../OnboardingWizard";

const profileSchema = z.object({
  experience_years: z.coerce
    .number()
    .min(0, "Valeur invalide")
    .max(50, "Valeur trop élevée"),
  daily_rate: z.coerce
    .number()
    .min(0, "Valeur invalide")
    .max(10000, "Valeur trop élevée"),
});

const expSchema = z.object({
  title: z.string().min(2, "Intitulé requis"),
  organization: z.string().min(2, "Organisation requise"),
  period_start: z.string().min(1, "Date de début requise"),
  period_end: z.string().optional(),
  description: z.string().optional(),
  trainees_count: z.coerce.number().min(0).optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;
type ExpValues = z.infer<typeof expSchema>;

interface Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export default function Step2Experience({ data, onNext, onBack }: Props) {
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(
    data.experiences
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      experience_years: data.experience_years,
      daily_rate: data.daily_rate,
    },
  });

  const expForm = useForm<ExpValues>({
    resolver: zodResolver(expSchema),
    defaultValues: {
      title: "",
      organization: "",
      period_start: "",
      period_end: "",
      description: "",
      trainees_count: 0,
    },
  });

  function addExperience(values: ExpValues) {
    setExperiences((prev) => [
      ...prev,
      {
        title: values.title,
        organization: values.organization,
        period_start: values.period_start,
        period_end: values.period_end || null,
        description: values.description || "",
        trainees_count: values.trainees_count ?? 0,
      },
    ]);
    expForm.reset();
    setShowAddForm(false);
  }

  function removeExperience(index: number) {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  }

  function handleNext(values: ProfileValues) {
    onNext({
      experience_years: values.experience_years,
      daily_rate: values.daily_rate,
      experiences,
    });
  }

  return (
    <form onSubmit={profileForm.handleSubmit(handleNext)} className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-2xl text-ink">Ton parcours</h2>
        <p className="text-muted font-dm mt-1 text-sm">
          Indique ton expérience et ton tarif journalier.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink font-dm mb-1.5">
            Années d&apos;expérience <span className="text-violet">*</span>
          </label>
          <input
            {...profileForm.register("experience_years")}
            type="number"
            min={0}
            max={50}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
            placeholder="8"
          />
          {profileForm.formState.errors.experience_years && (
            <p className="text-red-500 text-xs mt-1 font-dm">
              {profileForm.formState.errors.experience_years.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink font-dm mb-1.5">
            TJM (€ HT) <span className="text-violet">*</span>
          </label>
          <input
            {...profileForm.register("daily_rate")}
            type="number"
            min={0}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
            placeholder="800"
          />
          {profileForm.formState.errors.daily_rate && (
            <p className="text-red-500 text-xs mt-1 font-dm">
              {profileForm.formState.errors.daily_rate.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-syne font-semibold text-ink text-base">
            Expériences clés
          </h3>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-sm text-violet font-dm font-medium hover:text-violet-2 transition-colors"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>

        {experiences.length === 0 && !showAddForm && (
          <div className="border border-dashed border-border rounded-xl p-6 text-center">
            <Briefcase size={24} className="mx-auto text-muted mb-2" />
            <p className="text-muted font-dm text-sm">
              Aucune expérience ajoutée.{" "}
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="text-violet hover:underline"
              >
                Ajouter la première
              </button>
            </p>
          </div>
        )}

        <div className="space-y-3">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-bg rounded-xl border border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="font-syne font-semibold text-ink text-sm">
                  {exp.title}
                </p>
                <p className="text-muted font-dm text-xs mt-0.5">
                  {exp.organization} · {exp.period_start}
                  {exp.period_end ? ` → ${exp.period_end}` : " → présent"}
                </p>
                {exp.trainees_count > 0 && (
                  <p className="text-violet font-dm text-xs mt-0.5">
                    {exp.trainees_count} stagiaires formés
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeExperience(i)}
                className="text-muted hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {showAddForm && (
          <div className="mt-3 p-5 bg-bg rounded-xl border border-violet/30 space-y-4">
            <h4 className="font-syne font-semibold text-ink text-sm">
              Nouvelle expérience
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  {...expForm.register("title")}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-ink font-dm text-sm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
                  placeholder="Intitulé du poste / mission"
                />
                {expForm.formState.errors.title && (
                  <p className="text-red-500 text-xs mt-1 font-dm">
                    {expForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <input
                  {...expForm.register("organization")}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-ink font-dm text-sm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
                  placeholder="Organisme / entreprise"
                />
                {expForm.formState.errors.organization && (
                  <p className="text-red-500 text-xs mt-1 font-dm">
                    {expForm.formState.errors.organization.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-muted font-dm block mb-1">
                  Début
                </label>
                <input
                  {...expForm.register("period_start")}
                  type="month"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-ink font-dm text-sm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-dm block mb-1">
                  Fin (vide = présent)
                </label>
                <input
                  {...expForm.register("period_end")}
                  type="month"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-ink font-dm text-sm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
                />
              </div>
              <div className="col-span-2">
                <input
                  {...expForm.register("trainees_count")}
                  type="number"
                  min={0}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-ink font-dm text-sm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
                  placeholder="Nombre de stagiaires formés (optionnel)"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  expForm.reset();
                  setShowAddForm(false);
                }}
                className="flex-1 py-2 border border-border rounded-lg text-muted font-dm text-sm hover:border-ink hover:text-ink transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={expForm.handleSubmit(addExperience)}
                className="flex-1 py-2 bg-violet text-white font-dm text-sm font-medium rounded-lg hover:bg-violet-2 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-border rounded-xl text-ink font-syne font-bold hover:bg-bg transition-colors"
        >
          ← Retour
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-violet text-white font-syne font-bold rounded-xl hover:bg-violet-2 transition-colors"
        >
          Continuer →
        </button>
      </div>
    </form>
  );
}
