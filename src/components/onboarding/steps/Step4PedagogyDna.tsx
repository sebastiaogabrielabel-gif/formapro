"use client";

import { useState } from "react";
import type { OnboardingData, PedagogyDnaData } from "../OnboardingWizard";

const ANIMATION_STYLES = [
  "Présentiel",
  "Distanciel",
  "Hybride",
  "Coaching individuel",
  "Workshop collectif",
  "Classe inversée",
];

const TOOLS = [
  "Slides",
  "Vidéos pédagogiques",
  "Exercices pratiques",
  "Cas réels",
  "Jeux de rôle",
  "Quiz interactifs",
  "Mises en situation",
  "Mind mapping",
  "Kahoot / Mentimeter",
  "Padlet / Miro",
];

const POSTURES = [
  { value: "Expert", description: "Tu transmets ton savoir-faire" },
  { value: "Facilitateur", description: "Tu fais émerger les solutions" },
  { value: "Coach", description: "Tu accompagnes la progression" },
  { value: "Mentor", description: "Tu guides par l'exemple" },
];

const RHYTHMS = [
  { value: "Intensif", description: "Immersion courte et dense" },
  { value: "Progressif", description: "Apprentissage par paliers" },
  { value: "À la demande", description: "Flexibilité totale" },
];

const TONES = [
  { value: "Bienveillant", emoji: "🤗" },
  { value: "Exigeant", emoji: "🎯" },
  { value: "Ludique", emoji: "🎮" },
  { value: "Pragmatique", emoji: "⚡" },
];

interface Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function Step4PedagogyDna({ data, onNext, onBack }: Props) {
  const [dna, setDna] = useState<PedagogyDnaData>(data.pedagogy_dna);
  const [error, setError] = useState("");

  function handleNext() {
    if (dna.animation_styles.length === 0) {
      setError("Sélectionne au moins un mode d'animation.");
      return;
    }
    if (!dna.posture) {
      setError("Sélectionne ta posture de formateur.");
      return;
    }
    if (!dna.tone) {
      setError("Sélectionne ton registre.");
      return;
    }
    onNext({ pedagogy_dna: dna });
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-syne font-bold text-2xl text-ink">
          Ton ADN pédagogique
        </h2>
        <p className="text-muted font-dm mt-1 text-sm">
          Comment tu formes — ce qui te différencie des autres formateurs.
        </p>
      </div>

      <div>
        <h3 className="font-syne font-semibold text-ink text-base mb-3">
          Modes d&apos;animation <span className="text-violet">*</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {ANIMATION_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() =>
                setDna((prev) => ({
                  ...prev,
                  animation_styles: toggle(prev.animation_styles, style),
                }))
              }
              className={`px-4 py-2 rounded-xl text-sm font-dm border transition-colors
                ${
                  dna.animation_styles.includes(style)
                    ? "bg-violet text-white border-violet"
                    : "bg-white text-ink border-border hover:border-violet hover:text-violet"
                }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-syne font-semibold text-ink text-base mb-3">
          Posture <span className="text-violet">*</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {POSTURES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setDna((prev) => ({ ...prev, posture: p.value }))}
              className={`p-4 rounded-xl text-left border transition-colors
                ${
                  dna.posture === p.value
                    ? "bg-violet/10 border-violet"
                    : "bg-white border-border hover:border-violet/50"
                }`}
            >
              <p
                className={`font-syne font-semibold text-sm ${dna.posture === p.value ? "text-violet" : "text-ink"}`}
              >
                {p.value}
              </p>
              <p className="text-muted font-dm text-xs mt-0.5">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-syne font-semibold text-ink text-base mb-3">
          Rythme pédagogique
        </h3>
        <div className="flex gap-2 flex-wrap">
          {RHYTHMS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setDna((prev) => ({ ...prev, rhythm: r.value }))}
              className={`flex-1 min-w-0 p-3 rounded-xl text-center border transition-colors
                ${
                  dna.rhythm === r.value
                    ? "bg-violet text-white border-violet"
                    : "bg-white text-ink border-border hover:border-violet hover:text-violet"
                }`}
            >
              <p className="font-syne font-semibold text-sm">{r.value}</p>
              <p
                className={`font-dm text-xs mt-0.5 ${dna.rhythm === r.value ? "text-white/80" : "text-muted"}`}
              >
                {r.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-syne font-semibold text-ink text-base mb-3">
          Outils pédagogiques
        </h3>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() =>
                setDna((prev) => ({
                  ...prev,
                  tools: toggle(prev.tools, tool),
                }))
              }
              className={`px-3 py-1.5 rounded-lg text-sm font-dm border transition-colors
                ${
                  dna.tools.includes(tool)
                    ? "bg-violet/10 text-violet border-violet/30"
                    : "bg-white text-muted border-border hover:border-violet/50 hover:text-ink"
                }`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-syne font-semibold text-ink text-base mb-3">
          Registre <span className="text-violet">*</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setDna((prev) => ({ ...prev, tone: t.value }))}
              className={`p-3 rounded-xl border text-center transition-colors
                ${
                  dna.tone === t.value
                    ? "bg-violet text-white border-violet"
                    : "bg-white text-ink border-border hover:border-violet hover:text-violet"
                }`}
            >
              <span className="text-lg">{t.emoji}</span>
              <p className="font-syne font-semibold text-sm mt-1">{t.value}</p>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm font-dm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-border rounded-xl text-ink font-syne font-bold hover:bg-bg transition-colors"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3 bg-violet text-white font-syne font-bold rounded-xl hover:bg-violet-2 transition-colors"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
