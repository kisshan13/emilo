import { useGetMeQuery } from "@/hooks/query/me-query";
import { Loader } from "../loaders/page-loader";
import { useNavigate } from "react-router";

const roleRedirects = {
  user: "/feed",
  accountant: "/accountant",
  admin: "/admin",
};

export default function Protected({
  role,
  allowRedirectIfRoleMismatch,
  redirectToAuth,
  children,
}) {
  const { data, isLoading } = useGetMeQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  const userRole = data?.role;

  if (userRole !== role) {
    if (allowRedirectIfRoleMismatch) {
      navigate(roleRedirects[userRole] || "/auth");
    }
  }

  if (!userRole) {
    if (redirectToAuth) {
      navigate("/auth");
    } else {
      return <></>;
    }
  }

  return <>{children}</>;
}
