import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Menu, PlusCircle, Search } from "lucide-react";
import { Link, useLocation } from "react-router";
import { AppSidebar } from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { accountantNavLinks, adminNavLinks } from "@/lib/constant";

export function AppHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const navLinks = pathname.includes("/admin")
    ? adminNavLinks
    : accountantNavLinks;
  const currentPage = navLinks.find((link) => link.href === pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <AppSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden w-full flex-1 lg:block">
        <h1 className="text-lg font-semibold">
          {currentPage?.label || "Dashboard"}
        </h1>
      </div>
    </header>
  );
}
