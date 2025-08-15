import { Outlet, useLocation } from "react-router";
import { AppHeader } from "./header";
import { AppSidebar } from "./sidebar";
import Protected from "../checks/protected";

export default function DashboardOutlet() {
  const { pathname } = useLocation();

  const role = pathname.includes("admin") ? "admin" : "accountant";

  return (
    <Protected allowRedirectIfRoleMismatch={true} role={role}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <AppSidebar className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64" />
        <div className="flex flex-1 flex-col lg:pl-64">
          <AppHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </Protected>
  );
}
