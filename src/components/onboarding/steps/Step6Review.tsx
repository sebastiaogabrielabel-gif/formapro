"use client";

import { Loader2 } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

const DAYS_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

interface Props {
  data: OnboardingData;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-syne font-semibold text-ink text-sm uppercase tracking-wide">
        {title}
      </h3>
      <div className="bg-bg rounded-xl p-4 space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-muted font-dm text-sm flex-shrink-0">{label}</span>
      <span className="text-ink font-dm text-sm text-right">{value || "—"}</span>
    </div>
  );
}

export default function Step6Review({ data, onBack, onSubmit, submitting }: Props) {
  const dayLabels = data.availability.days_of_week
    .sort()
    .map((d) => DAYS_LABELS[d])
    .join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-2xl text-ink">
          Récapitulatif
        </h2>
        <p className="text-muted font-dm mt-1 text-sm">
          Vérifie tes informations avant de valider ton profil.
        </p>
      </div>

      <Section title="Identité">
        <Row label="Nom" value={data.full_name} />
        <Row label="Spécialité" value={data.specialty} />
        <Row label="Localisation" value={`${data.location_city}, ${data.location_country}`} />
        <div className="pt-1">
          <span className="text-muted font-dm text-sm">Bio</span>
          <p className="text-ink font-dm text-sm mt-1 leading-relaxed">{data.bio}</p>
        </div>
      </Section>

      <Section title="Parcours">
        <Row label="Expérience" value={`${data.experience_years} ans`} />
        <Row label="TJM" value={data.daily_rate > 0 ? `${data.daily_rate} € HT` : "—"} />
        {data.experiences.length > 0 && (
          <div className="pt-1 space-y-2">
            {data.experiences.map((exp, i) => (
              <div key={i} className="text-sm font-dm">
                <span className="text-ink font-medium">{exp.title}</span>
                <span className="text-muted"> · {exp.organization}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {data.skills.length > 0 && (
        <Section title="Compétences">
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-violet/10 text-violet rounded-full text-xs font-dm border border-violet/20"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="ADN Pédagogique">
        {data.pedagogy_dna.posture && (
          <Row label="Posture" value={data.pedagogy_dna.posture} />
        )}
        {data.pedagogy_dna.tone && (
          <Row label="Registre" value={data.pedagogy_dna.tone} />
        )}
        {data.pedagogy_dna.rhythm && (
          <Row label="Rythme" value={data.pedagogy_dna.rhythm} />
        )}
        {data.pedagogy_dna.animation_styles.length > 0 && (
          <Row
            label="Modes d'animation"
            value={data.pedagogy_dna.animation_styles.join(", ")}
          />
        )}
      </Section>

      <Section title="Disponibilités">
        <Row label="Jours" value={dayLabels || "—"} />
        <Row label="Formats" value={data.availability.formats.join(", ") || "—"} />
        {data.availability.available_from && (
          <Row
            label="À partir du"
            value={new Date(data.availability.available_from).toLocaleDateString("fr-FR")}
          />
        )}
      </Section>

      <div className="bg-violet/5 border border-violet/20 rounded-xl p-4">
        <p className="text-ink font-dm text-sm">
          En validant, ton profil sera créé et tu accéderas à ton tableau de bord FormaPro.
          Tu pourras modifier ces informations à tout moment.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 py-3 border border-border rounded-xl text-ink font-syne font-bold hover:bg-bg transition-colors disabled:opacity-50"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 py-3 bg-violet text-white font-syne font-bold rounded-xl hover:bg-violet-2 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sauvegarde...
            </>
          ) : (
            "Valider mon profil ✓"
          )}
        </button>
      </div>
    </div>
  );
}
