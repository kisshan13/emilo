import { useGetMeQuery } from "@/hooks/query/me-query";
import { Loader } from "../loaders/page-loader";
import { useNavigate } from "react-router";

const roleRedirects = {
  user: "/feed",
  accountant: "/accountant",
  admin: "/admin",
};

export default function RedirectOnLoggedIn({ children }) {
  const { data, isLoading } = useGetMeQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <>{children}</>;
  }

  const userRole = data?.role;

  const redirecturl = roleRedirects[userRole];

  navigate(redirecturl || "/feed");

  return <></>;
}
