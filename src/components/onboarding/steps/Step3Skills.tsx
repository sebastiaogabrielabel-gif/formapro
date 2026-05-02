"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import type { OnboardingData, SkillEntry } from "../OnboardingWizard";

const CATEGORIES = [
  { value: "domain" as const, label: "Domaine", color: "bg-violet/10 text-violet border-violet/20" },
  { value: "skill" as const, label: "Compétence", color: "bg-blue-50 text-blue-600 border-blue-200" },
  { value: "public" as const, label: "Public cible", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "format" as const, label: "Format", color: "bg-orange-50 text-orange-600 border-orange-200" },
];

const SUGGESTIONS: Record<string, string[]> = {
  domain: ["Management", "RH", "Commercial", "Finance", "Soft skills", "Leadership", "Communication", "Digital", "Agile", "Sécurité", "Droit"],
  skill: ["Prise de parole", "Négociation", "Feedback", "Gestion du temps", "Excel", "Facilitation", "Coaching", "Design Thinking"],
  public: ["Managers", "Commerciaux", "Dirigeants", "RH", "Équipes terrain", "Cadres", "Alternants", "Demandeurs d'emploi"],
  format: ["Présentiel", "Distanciel", "Blended", "SPOC", "Atelier", "Séminaire", "E-learning", "Coaching"],
};

interface Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export default function Step3Skills({ data, onNext, onBack }: Props) {
  const [skills, setSkills] = useState<SkillEntry[]>(data.skills);
  const [input, setInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<SkillEntry["category"]>("domain");
  const [error, setError] = useState("");

  function addSkill(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (skills.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    setSkills((prev) => [...prev, { name: trimmed, category: activeCategory }]);
    setInput("");
    setError("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(input);
    }
  }

  function removeSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  function handleNext() {
    if (skills.length < 3) {
      setError("Ajoute au moins 3 compétences pour continuer.");
      return;
    }
    onNext({ skills });
  }

  const skillsByCategory = CATEGORIES.map((cat) => ({
    ...cat,
    items: skills.filter((s) => s.category === cat.value),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-2xl text-ink">
          Tes compétences
        </h2>
        <p className="text-muted font-dm mt-1 text-sm">
          Ajoute tes domaines, compétences, publics cibles et formats. Minimum 3.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-dm font-medium border transition-colors
              ${activeCategory === cat.value ? cat.color : "bg-white text-muted border-border hover:border-ink hover:text-ink"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
            placeholder={`Ajouter un(e) ${CATEGORIES.find((c) => c.value === activeCategory)?.label.toLowerCase()}...`}
          />
          <button
            type="button"
            onClick={() => addSkill(input)}
            className="px-4 py-3 bg-violet text-white rounded-xl font-dm font-medium hover:bg-violet-2 transition-colors"
          >
            +
          </button>
        </div>

        {SUGGESTIONS[activeCategory] && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS[activeCategory]
              .filter((s) => !skills.find((sk) => sk.name === s))
              .slice(0, 6)
              .map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addSkill(suggestion)}
                  className="px-3 py-1 bg-bg border border-border rounded-full text-xs text-muted font-dm hover:border-violet hover:text-violet transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="space-y-4">
          {skillsByCategory
            .filter((cat) => cat.items.length > 0)
            .map((cat) => (
              <div key={cat.value}>
                <p className="text-xs font-dm font-medium text-muted mb-2 uppercase tracking-wide">
                  {cat.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill, i) => {
                    const globalIndex = skills.findIndex(
                      (s) => s.name === skill.name && s.category === skill.category
                    );
                    return (
                      <span
                        key={i}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-dm border ${cat.color}`}
                      >
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => removeSkill(globalIndex)}
                          className="hover:opacity-70 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}

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
