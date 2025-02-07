import { getServerSession } from "next-auth/next";
import LoginForm from "@/components/LoginForm";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoginForm />
    </div>
  );
}
