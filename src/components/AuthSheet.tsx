import { useState } from "react";
import { Chrome, Mail, X } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useApp } from "@/context/AppContext";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export function AuthSheet() {
  const { authOpen, setAuthOpen, signIn, notify } = useApp();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  if (!authOpen) return null;

  const googleSignIn = async () => {
    if (!auth || !isFirebaseConfigured) {
      signIn({
        displayName: "Guest Explorer",
        email: "explorer@goug.app",
        initials: "GE"
      });
      return;
    }

    try {
      setBusy(true);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const displayName = result.user.displayName || "GoUG Explorer";
      signIn({
        displayName,
        email: result.user.email || "",
        initials: displayName
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      });
    } catch {
      notify("We couldn't sign you in. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const emailSignIn = () => {
    if (!email.includes("@")) {
      notify("Enter a valid email address");
      return;
    }
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    const displayName = name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ");
    signIn({
      displayName: displayName || "GoUG Explorer",
      email,
      initials: (displayName || "GE").slice(0, 2).toUpperCase()
    });
  };

  return (
    <div
      className="sheet-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) setAuthOpen(false);
      }}
    >
      <section className="auth-sheet" role="dialog" aria-modal="true">
        <button
          className="icon-button auth-sheet__close"
          onClick={() => setAuthOpen(false)}
          aria-label="Close sign in"
        >
          <X size={20} />
        </button>
        <span className="auth-sheet__mini-mark">GoUG</span>
        <p className="eyebrow">Your trips, in one place</p>
        <h2>Save the Uganda you want to see.</h2>
        <p className="muted">
          Sign in to sync saved places and build a trip across your devices.
        </p>
        <button
          className="button button--outline button--full"
          onClick={googleSignIn}
          disabled={busy}
        >
          <Chrome size={19} />
          {busy ? "Connecting…" : "Continue with Google"}
        </button>
        <div className="auth-sheet__divider">
          <span>or</span>
        </div>
        <label className="field">
          <span>Email address</span>
          <span className="field__input-wrap">
            <Mail size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") emailSignIn();
              }}
            />
          </span>
        </label>
        <button className="button button--dark button--full" onClick={emailSignIn}>
          Continue with email
        </button>
        {!isFirebaseConfigured && (
          <p className="auth-sheet__demo">
            Demo mode is active. Add Firebase credentials to enable real
            authentication.
          </p>
        )}
      </section>
    </div>
  );
}
