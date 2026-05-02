import { redirect } from "next/navigation";

// La racine redirige toujours vers /dashboard (le middleware gère l'auth)
export default function RootPage() {
  redirect("/dashboard");
}
