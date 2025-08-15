import { lazy, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import WithLoader, { Loader } from "./components/loaders/page-loader";

import CreatorOutlet from "./pages/creator/creator-outlet";
import DashboardOutlet from "./components/dashboard/dashboard-outlet";

const AuthPage = lazy(() => import("@/pages/auth"));

const FeedPage = lazy(() => import("@/pages/creator/feed"));
const ClaimPage = lazy(() => import("@/pages/creator/claims"));
const MyPostPage = lazy(() => import("@/pages/creator/my-posts"));

const RatePage = lazy(() => import("@/pages/admin/rates"));
const AdminClaimPage = lazy(() => import("@/pages/admin/claims"));
const SettlementsPage = lazy(() => import("@/pages/admin/settlements"));

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route
          path="/auth"
          element={<WithLoader isFullSize={true} component={<AuthPage />} />}
        />

        <Route path="" element={<CreatorOutlet />}>
          <Route
            path="/feed"
            element={<WithLoader component={<FeedPage />} />}
          />
          <Route
            path="/my-posts"
            element={<WithLoader component={<MyPostPage />} />}
          />
          <Route
            path="/claims"
            element={<WithLoader component={<ClaimPage />} />}
          />
        </Route>

        <Route path="/admin" element={<DashboardOutlet />}>
          <Route
            path="rates"
            element={<WithLoader component={<RatePage />} />}
          />
          <Route
            path="claims"
            element={<WithLoader component={<AdminClaimPage />} />}
          />
          <Route
            path="settlements"
            element={<WithLoader component={<SettlementsPage />} />}
          />
        </Route>
        <Route path="/accountant" element={<DashboardOutlet />}>
          <Route
            path="claims"
            element={<WithLoader component={<AdminClaimPage />} />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;
