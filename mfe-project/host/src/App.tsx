import React, { Suspense } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/slices/authSlice";
import type { RootState } from "./store";
import ErrorBoundary from "./components/ErrorBoundary";

const AuthApp = React.lazy(() => import("auth/App"));
const DashboardApp = React.lazy(() => import("dashboard/App"));
const ProfileApp = React.lazy(() => import("profile/App"));
const SettingsApp = React.lazy(() => import("settings/App"));
function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        MFE Portal
      </Link>
      {user ? (
        <>
          <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>
          </nav>
          <span className="user-name">Hi, {user.name}</span>
          <button
            onClick={() => {
              dispatch(logout());
              localStorage.removeItem("mfe_token");
              navigate("/auth", { replace: true });
            }}
          >
            Logout
          </button>
        </>
      ) : null}
    </header>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? <>{children}</> : <Navigate to="/auth" replace />;
}

function Remote({
  children,
  moduleName,
}: {
  children: React.ReactNode;
  moduleName: string;
}) {
  return (
    <ErrorBoundary moduleName={moduleName}>
      <Suspense fallback={<div className="loading">Loading {moduleName}...</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function Home() {
  return (
    <main className="page">
      <h1>MFE Portal</h1>
      <p>Sign in to explore the independently deployed micro-frontends.</p>
      <Link to="/auth">Go to sign in</Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth/*"
          element={
            <Remote moduleName="Authentication">
              <AuthApp />
            </Remote>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Remote moduleName="Dashboard">
                <DashboardApp />
              </Remote>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/*"
          element={
            <ProtectedRoute>
              <Remote moduleName="Profile">
                <ProfileApp />
              </Remote>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/*"
          element={
            <ProtectedRoute>
              <Remote moduleName="Settings">
                <SettingsApp />
              </Remote>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
