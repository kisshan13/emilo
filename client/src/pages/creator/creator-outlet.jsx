import { Outlet, Link } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGetMeQuery } from "@/hooks/query/me-query";


export default function CreatorOutlet() {
  const { data } = useGetMeQuery();

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b bg-white">
        <nav className="flex gap-4">
          <Link to="/feed" className="font-medium hover:underline">
            Feed
          </Link>
          <Link to="/my-posts" className="font-medium hover:underline">
            My Posts
          </Link>
          <Link to="/claims" className="font-medium hover:underline">
            Claims
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{data?.name?.at(0) || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{data?.email}</span>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
