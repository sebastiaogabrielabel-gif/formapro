"use client";

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center space-y-4">
        <p className="font-syne font-bold text-xl text-ink">
          Une erreur est survenue
        </p>
        <p className="text-muted font-dm">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-violet text-white rounded-xl font-dm text-sm hover:bg-[#3f35b0] transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
