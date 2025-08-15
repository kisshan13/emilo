import { Link, useLocation } from "react-router";
import { Fingerprint, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavLinks, accountantNavLinks } from "@/lib/constant";

export function AppSidebar({ className }) {
  const location = useLocation();
  const pathname = location.pathname;

  const navLinks = pathname.startsWith("/admin")
    ? adminNavLinks
    : accountantNavLinks;

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border/60 bg-muted/30",
        className
      )}
    >
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link to="/" className="flex items-center gap-2 font-lora">
          <Fingerprint className="text-primary" />
          <span className="text-lg font-semibold">Emilo</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 px-4 font-jakarta">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              to={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "absolute -left-4 h-6 w-1 rounded-full bg-primary transition-transform duration-200 ease-in-out",
                    isActive ? "scale-y-100" : "scale-y-0"
                  )}
                />
                <link.icon className="h-5 w-5" />
              </div>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
