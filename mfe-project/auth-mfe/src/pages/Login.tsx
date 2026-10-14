import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "host/store";
import { Panel, Field } from "host/shared";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("nasif@example.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to sign in");
      const user = result.user;
      localStorage.setItem("mfe_token", result.token);
      dispatch(login({ user: { ...user, id: user.id || user._id }, token: result.token }));
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    }
  };
  return (
    <main className="page">
      <Panel title="Welcome back">
        <form className="form" onSubmit={submit}>
          {error && <p className="error">{error}</p>} <Field id="email" label="Email" type="email" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
          <Field id="password" label="Password" type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <div className="links">
            <Link to="../signup">Create an account</Link>
            <Link to="../forgot-password">Forgot password?</Link>
          </div>
        </form>
      </Panel>
    </main>
  );
}
