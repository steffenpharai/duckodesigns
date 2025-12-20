import { redirect } from "next/navigation"

export default function RegisterPage() {
  // Registration is now handled via Google OAuth only
  redirect("/auth/signin")
}

