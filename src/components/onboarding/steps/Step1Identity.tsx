"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { OnboardingData } from "../OnboardingWizard";

const schema = z.object({
  full_name: z.string().min(2, "Ton nom complet est requis"),
  specialty: z.string().min(2, "Ta spécialité est requise"),
  bio: z
    .string()
    .min(20, "Ta bio doit faire au moins 20 caractères")
    .max(500, "500 caractères maximum"),
  location_city: z.string().min(1, "Ta ville est requise"),
  location_country: z.string().min(1, "Ton pays est requis"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
}

export default function Step1Identity({ data, onNext }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: data.full_name,
      specialty: data.specialty,
      bio: data.bio,
      location_city: data.location_city,
      location_country: data.location_country,
    },
  });

  const bioValue = watch("bio", data.bio);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-2xl text-ink">
          Présente-toi
        </h2>
        <p className="text-muted font-dm mt-1 text-sm">
          Ces informations apparaîtront sur ton profil public.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink font-dm mb-1.5">
            Nom complet <span className="text-violet">*</span>
          </label>
          <input
            {...register("full_name")}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
            placeholder="Marie Dupont"
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1 font-dm">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink font-dm mb-1.5">
            Spécialité <span className="text-violet">*</span>
          </label>
          <input
            {...register("specialty")}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
            placeholder="Formatrice RH & Management"
          />
          {errors.specialty && (
            <p className="text-red-500 text-xs mt-1 font-dm">
              {errors.specialty.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-ink font-dm">
              Bio courte <span className="text-violet">*</span>
            </label>
            <span className="text-xs text-muted font-dm">
              {bioValue?.length ?? 0}/500
            </span>
          </div>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors resize-none"
            placeholder="Formatrice indépendante depuis 8 ans, je me spécialise dans le management et le développement des compétences. Mon approche combine théorie et mise en pratique immédiate."
          />
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1 font-dm">
              {errors.bio.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink font-dm mb-1.5">
              Ville <span className="text-violet">*</span>
            </label>
            <input
              {...register("location_city")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
              placeholder="Paris"
            />
            {errors.location_city && (
              <p className="text-red-500 text-xs mt-1 font-dm">
                {errors.location_city.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink font-dm mb-1.5">
              Pays <span className="text-violet">*</span>
            </label>
            <input
              {...register("location_country")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
              placeholder="France"
            />
            {errors.location_country && (
              <p className="text-red-500 text-xs mt-1 font-dm">
                {errors.location_country.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-violet text-white font-syne font-bold rounded-xl hover:bg-violet-2 transition-colors"
      >
        Continuer →
      </button>
    </form>
  );
}
