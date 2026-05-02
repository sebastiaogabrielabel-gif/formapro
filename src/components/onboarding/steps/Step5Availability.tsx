"use client";

import { useState } from "react";
import type { OnboardingData, AvailabilityData } from "../OnboardingWizard";

const DAYS = [
  { value: 0, label: "Lun" },
  { value: 1, label: "Mar" },
  { value: 2, label: "Mer" },
  { value: 3, label: "Jeu" },
  { value: 4, label: "Ven" },
  { value: 5, label: "Sam" },
  { value: 6, label: "Dim" },
];

const FORMATS = [
  { value: "Présentiel", description: "En salle, chez le client" },
  { value: "Distanciel", description: "Visio, plateforme LMS" },
  { value: "Hybride", description: "Combinaison des deux" },
];

interface Props {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

function toggleNumber(arr: number[], value: number): number[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function toggleString(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function Step5Availability({ data, onNext, onBack }: Props) {
  const [avail, setAvail] = useState<AvailabilityData>(data.availability);
  const [error, setError] = useState("");

  function handleNext() {
    if (avail.days_of_week.length === 0) {
      setError("Sélectionne au moins un jour de disponibilité.");
      return;
    }
    if (avail.formats.length === 0) {
      setError("Sélectionne au moins un format d'intervention.");
      return;
    }
    onNext({ availability: avail });
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-syne font-bold text-2xl text-ink">
          Tes disponibilités
        </h2>
        <p className="text-muted font-dm mt-1 text-sm">
          Pour matcher avec les bonnes missions au bon moment.
        </p>
      </div>

      <div>
        <h3 className="font-syne font-semibold text-ink text-base mb-3">
          Jours disponibles <span className="text-violet">*</span>
        </h3>
        <div className="flex gap-2">
          {DAYS.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() =>
                setAvail((prev) => ({
                  ...prev,
                  days_of_week: toggleNumber(prev.days_of_week, day.value),
                }))
              }
              className={`flex-1 py-3 rounded-xl text-sm font-syne font-semibold border transition-colors
                ${
                  avail.days_of_week.includes(day.value)
                    ? "bg-violet text-white border-violet"
                    : "bg-white text-ink border-border hover:border-violet hover:text-violet"
                }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-syne font-semibold text-ink text-base mb-3">
          Disponible à partir du
        </h3>
        <input
          type="date"
          value={avail.available_from}
          onChange={(e) =>
            setAvail((prev) => ({ ...prev, available_from: e.target.value }))
          }
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-ink font-dm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet transition-colors"
        />
      </div>

      <div>
        <h3 className="font-syne font-semibold text-ink text-base mb-3">
          Formats d&apos;intervention <span className="text-violet">*</span>
        </h3>
        <div className="space-y-2">
          {FORMATS.map((format) => (
            <button
              key={format.value}
              type="button"
              onClick={() =>
                setAvail((prev) => ({
                  ...prev,
                  formats: toggleString(prev.formats, format.value),
                }))
              }
              className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors
                ${
                  avail.formats.includes(format.value)
                    ? "bg-violet/10 border-violet"
                    : "bg-white border-border hover:border-violet/50"
                }`}
            >
              <div>
                <p
                  className={`font-syne font-semibold text-sm ${avail.formats.includes(format.value) ? "text-violet" : "text-ink"}`}
                >
                  {format.value}
                </p>
                <p className="text-muted font-dm text-xs mt-0.5">
                  {format.description}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${avail.formats.includes(format.value) ? "border-violet bg-violet" : "border-border"}`}
              >
                {avail.formats.includes(format.value) && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
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
