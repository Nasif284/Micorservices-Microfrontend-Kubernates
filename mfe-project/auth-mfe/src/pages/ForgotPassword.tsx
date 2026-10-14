import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Panel, Field } from "host/shared";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };
  return (
    <main className="page">
      <Panel title="Reset your password">
        <form className="form" onSubmit={submit}>
          <Field id="email" label="Email" type="email" required />
          <button type="submit">Send reset link</button>
          {submitted && <p className="success">If the account exists, a reset link has been sent.</p>}
          <p className="links">
            <Link to="../login">Back to login</Link>
          </p>
        </form>
      </Panel>
    </main>
  );
}
