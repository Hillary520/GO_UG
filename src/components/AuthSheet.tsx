import { useState } from "react";
import { Chrome, LockKeyhole, Mail, X } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { useApp } from "@/context/AppContext";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

export function AuthSheet() {
  const { authOpen, setAuthOpen, signIn, notify } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailMode, setEmailMode] = useState<"signIn" | "create">("signIn");
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

  const emailSignIn = async () => {
    if (!email.includes("@")) {
      notify("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      notify("Use at least 6 characters for your password");
      return;
    }
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    const displayName = name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ");

    if (!auth || !isFirebaseConfigured) {
      signIn({
        displayName: displayName || "GoUG Explorer",
        email,
        initials: (displayName || "GE").slice(0, 2).toUpperCase()
      });
      return;
    }

    try {
      setBusy(true);
      const result =
        emailMode === "create"
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);
      signIn({
        displayName: result.user.displayName || displayName || "GoUG Explorer",
        email: result.user.email || email,
        initials: (displayName || "GE").slice(0, 2).toUpperCase()
      });
    } catch (error) {
      const code =
        typeof error === "object" && error && "code" in error
          ? String(error.code)
          : "";
      if (code.includes("email-already-in-use")) {
        notify("That email already has an account. Try signing in.");
      } else if (
        code.includes("invalid-credential") ||
        code.includes("wrong-password") ||
        code.includes("user-not-found")
      ) {
        notify("The email or password doesn't match.");
      } else {
        notify("We couldn't complete that sign-in. Please try again.");
      }
    } finally {
      setBusy(false);
    }
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
            />
          </span>
        </label>
        <label className="field">
          <span>Password</span>
          <span className="field__input-wrap">
            <LockKeyhole size={18} />
            <input
              type="password"
              autoComplete={
                emailMode === "create" ? "new-password" : "current-password"
              }
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void emailSignIn();
              }}
            />
          </span>
        </label>
        <button
          className="button button--dark button--full"
          onClick={() => void emailSignIn()}
          disabled={busy}
        >
          {busy
            ? "Please wait…"
            : emailMode === "create"
              ? "Create account"
              : "Sign in with email"}
        </button>
        <button
          className="auth-sheet__switch"
          onClick={() =>
            setEmailMode((current) =>
              current === "signIn" ? "create" : "signIn"
            )
          }
        >
          {emailMode === "signIn"
            ? "New to GoUG? Create an account"
            : "Already have an account? Sign in"}
        </button>
        {!isFirebaseConfigured && (
          <p className="auth-sheet__demo">Local preview mode</p>
        )}
      </section>
    </div>
  );
}
