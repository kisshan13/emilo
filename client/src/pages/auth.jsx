import { AuthForm } from "@/components/auth/auth-form";
import RedirectOnLoggedIn from "@/components/checks/check-user";

export default function AuthPage() {
  return (
    <>
      <div className=" w-[100vw] h-[100vh] flex items-center justify-center">
        <RedirectOnLoggedIn>
          <AuthForm />
        </RedirectOnLoggedIn>
      </div>
    </>
  );
}
