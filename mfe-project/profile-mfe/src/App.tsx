import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Panel } from "host/shared";

type User = { id: string; name: string; email: string; role?: "user" | "admin" };

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mfe_token");
    fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token || ""}` },
    })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load profile"))))
      .then((result) => setUser(result.user || result))
        .catch((e) => setError(e.message));
  }, []);

  if (!user)
    return (
      <main className="page">
        <Panel title="Profile">
          <p>{error || "Loading profile..."}</p>
        </Panel>
      </main>
    );

  return (
    <main className="page">
      <Panel title="Your profile">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role || "user"}</p>
        {error && <p className="error">{error}</p>}
      </Panel>
    </main>
  );
}
