import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type { AppUser, ToastMessage } from "@/types";

type AppContextValue = {
  savedIds: string[];
  tripIds: string[];
  user: AppUser | null;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  toggleSaved: (id: string) => void;
  addToTrip: (id: string) => void;
  removeFromTrip: (id: string) => void;
  addTemplateToTrip: (ids: string[]) => void;
  signIn: (user: AppUser) => void;
  signOut: () => void;
  notify: (message: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("goug-saved", [
    "bunyonyi"
  ]);
  const [tripIds, setTripIds] = useLocalStorage<string[]>("goug-trip", []);
  const [user, setUser] = useLocalStorage<AppUser | null>("goug-user", null);
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const notify = useCallback((message: string) => {
    const next = { id: Date.now(), message };
    setToast(next);
    window.setTimeout(() => {
      setToast((current) => (current?.id === next.id ? null : current));
    }, 2800);
  }, []);

  const toggleSaved = useCallback(
    (id: string) => {
      setSavedIds((current) => {
        const isSaved = current.includes(id);
        notify(isSaved ? "Removed from saved places" : "Saved for later");
        return isSaved
          ? current.filter((itemId) => itemId !== id)
          : [...current, id];
      });
    },
    [notify, setSavedIds]
  );

  const addToTrip = useCallback(
    (id: string) => {
      setTripIds((current) => {
        if (current.includes(id)) {
          notify("Already in your trip");
          return current;
        }
        notify("Added to your trip");
        return [...current, id];
      });
    },
    [notify, setTripIds]
  );

  const removeFromTrip = useCallback(
    (id: string) => {
      setTripIds((current) => current.filter((itemId) => itemId !== id));
      notify("Removed from trip");
    },
    [notify, setTripIds]
  );

  const addTemplateToTrip = useCallback(
    (ids: string[]) => {
      setTripIds((current) => [...new Set([...current, ...ids])]);
      notify("Itinerary added to your trip");
    },
    [notify, setTripIds]
  );

  const value = useMemo(
    () => ({
      savedIds,
      tripIds,
      user,
      authOpen,
      setAuthOpen,
      toggleSaved,
      addToTrip,
      removeFromTrip,
      addTemplateToTrip,
      signIn: (nextUser: AppUser) => {
        setUser(nextUser);
        setAuthOpen(false);
        notify(`Welcome, ${nextUser.displayName.split(" ")[0]}`);
      },
      signOut: () => {
        setUser(null);
        notify("Signed out");
      },
      notify
    }),
    [
      addTemplateToTrip,
      addToTrip,
      authOpen,
      notify,
      removeFromTrip,
      savedIds,
      setUser,
      toggleSaved,
      tripIds,
      user
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <div
        className={`toast ${toast ? "toast--visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast?.message}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
