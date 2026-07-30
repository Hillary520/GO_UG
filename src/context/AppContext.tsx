import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  deleteUser,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { catalog, guides } from "@/data/catalog";
import { auth, db } from "@/lib/firebase";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type {
  AppNotification,
  AppUser,
  BookingRequest,
  BookingStatus,
  ChatMessage,
  Guide,
  ManagedPlace,
  SupportTicket,
  ToastMessage,
  TravellerReview,
  TravelPreferences
} from "@/types";

type BookingInput = Omit<
  BookingRequest,
  "id" | "status" | "createdAt"
>;

type ReviewInput = Pick<TravellerReview, "entityId" | "rating" | "text">;

type AppContextValue = {
  savedIds: string[];
  tripIds: string[];
  user: AppUser | null;
  authOpen: boolean;
  notificationsOpen: boolean;
  preferences: TravelPreferences;
  notifications: AppNotification[];
  bookings: BookingRequest[];
  reviews: TravellerReview[];
  messages: ChatMessage[];
  supportTickets: SupportTicket[];
  customPlaces: ManagedPlace[];
  catalogItems: ManagedPlace[];
  guideItems: Guide[];
  featuredIds: string[];
  sponsoredIds: string[];
  verifiedGuideIds: string[];
  setAuthOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  updatePreferences: (next: Partial<TravelPreferences>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleSaved: (id: string) => void;
  addToTrip: (id: string) => void;
  removeFromTrip: (id: string) => void;
  addTemplateToTrip: (ids: string[]) => void;
  createBooking: (input: BookingInput) => Promise<string>;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  addReview: (input: ReviewInput) => Promise<void>;
  moderateReview: (
    id: string,
    status: TravellerReview["status"]
  ) => void;
  sendMessage: (guideId: string, text: string) => Promise<void>;
  submitSupportTicket: (
    subject: string,
    message: string
  ) => Promise<void>;
  addCustomPlace: (place: ManagedPlace) => void;
  updateCustomPlace: (id: string, next: Partial<ManagedPlace>) => void;
  removeCustomPlace: (id: string) => void;
  toggleFeatured: (id: string) => void;
  toggleSponsored: (id: string) => void;
  toggleGuideVerified: (id: string) => void;
  signIn: (user: AppUser) => void;
  signOut: () => void;
  deleteAccount: () => Promise<boolean>;
  notify: (message: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const defaultPreferences: TravelPreferences = {
  language: "English",
  currency: "UGX",
  notifications: true,
  interests: ["Safari", "Food", "Culture"]
};

const defaultNotifications: AppNotification[] = [
  {
    id: "welcome",
    title: "Your Uganda shortlist is ready",
    body: "Saved places and trip ideas now stay together in GoUG.",
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "guides",
    title: "Meet verified local guides",
    body: "Browse guides by destination, language and specialty.",
    read: false,
    createdAt: new Date().toISOString()
  }
];

const toManaged = (item: (typeof catalog)[number]): ManagedPlace => ({
  ...item,
  status: "published"
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("goug-saved", [
    "bunyonyi"
  ]);
  const [tripIds, setTripIds] = useLocalStorage<string[]>("goug-trip", []);
  const [user, setUser] = useLocalStorage<AppUser | null>("goug-user", null);
  const [preferences, setPreferences] = useLocalStorage<TravelPreferences>(
    "goug-preferences",
    defaultPreferences
  );
  const [notifications, setNotifications] = useLocalStorage<AppNotification[]>(
    "goug-notifications",
    defaultNotifications
  );
  const [bookings, setBookings] = useLocalStorage<BookingRequest[]>(
    "goug-bookings",
    []
  );
  const [reviews, setReviews] = useLocalStorage<TravellerReview[]>(
    "goug-reviews",
    []
  );
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>(
    "goug-messages",
    []
  );
  const [supportTickets, setSupportTickets] = useLocalStorage<SupportTicket[]>(
    "goug-support",
    []
  );
  const [customPlaces, setCustomPlaces] = useLocalStorage<ManagedPlace[]>(
    "goug-managed-places",
    []
  );
  const [featuredIds, setFeaturedIds] = useLocalStorage<string[]>(
    "goug-featured",
    catalog.filter((item) => item.featured).map((item) => item.id)
  );
  const [sponsoredIds, setSponsoredIds] = useLocalStorage<string[]>(
    "goug-sponsored",
    catalog.filter((item) => item.sponsored).map((item) => item.id)
  );
  const [verifiedGuideIds, setVerifiedGuideIds] = useLocalStorage<string[]>(
    "goug-verified-guides",
    guides.filter((guide) => guide.verified).map((guide) => guide.id)
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const notify = useCallback((message: string) => {
    const next = { id: Date.now(), message };
    setToast(next);
    window.setTimeout(() => {
      setToast((current) => (current?.id === next.id ? null : current));
    }, 2800);
  }, []);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        const storedUser = window.localStorage.getItem("goug-user");
        if (storedUser && storedUser !== "null") setUser(null);
        return;
      }
      const displayName = firebaseUser.displayName || "GoUG Explorer";
      setUser({
        displayName,
        email: firebaseUser.email || "",
        initials: displayName
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      });
    });
  }, [setUser]);

  const pushNotification = useCallback(
    (title: string, body: string) => {
      if (!preferences.notifications) return;
      setNotifications((current) => [
        {
          id: crypto.randomUUID(),
          title,
          body,
          read: false,
          createdAt: new Date().toISOString()
        },
        ...current
      ]);
    },
    [preferences.notifications, setNotifications]
  );

  const persist = useCallback(
    async (
      collectionName: string,
      value: Record<string, unknown>,
      documentId?: string
    ) => {
      if (!db || !auth?.currentUser) return;
      const payload = {
        ...value,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      };
      if (documentId) {
        await setDoc(doc(db, collectionName, documentId), payload);
      } else {
        await addDoc(collection(db, collectionName), payload);
      }
    },
    []
  );

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

  const createBooking = useCallback(
    async (input: BookingInput) => {
      const id = crypto.randomUUID();
      const request: BookingRequest = {
        ...input,
        id,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      setBookings((current) => [request, ...current]);
      pushNotification(
        "Request received",
        `We saved your request for ${input.title}.`
      );
      notify("Request saved");
      try {
        await persist(
          "bookings",
          {
            ...input,
            status: "pending"
          },
          id
        );
      } catch {
        notify("Saved on this device; cloud sync will retry after sign-in");
      }
      return id;
    },
    [notify, persist, pushNotification, setBookings]
  );

  const addReview = useCallback(
    async (input: ReviewInput) => {
      const review: TravellerReview = {
        ...input,
        id: crypto.randomUUID(),
        author: user?.displayName || "GoUG traveller",
        status: "pending",
        createdAt: new Date().toISOString()
      };
      setReviews((current) => [review, ...current]);
      notify("Review sent for moderation");
      try {
        await persist(
          "reviews",
          {
            entityId: input.entityId,
            rating: input.rating,
            text: input.text,
            status: "pending"
          },
          review.id
        );
      } catch {
        notify("Review saved on this device");
      }
    },
    [notify, persist, setReviews, user?.displayName]
  );

  const sendMessage = useCallback(
    async (guideId: string, text: string) => {
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        guideId,
        sender: "traveller",
        text,
        createdAt: new Date().toISOString()
      };
      setMessages((current) => [...current, message]);
      try {
        await persist("guide_messages", {
          guideId,
          text,
          sender: "traveller"
        });
      } catch {
        notify("Message saved on this device");
      }
    },
    [notify, persist, setMessages]
  );

  const submitSupportTicket = useCallback(
    async (subject: string, message: string) => {
      const ticket: SupportTicket = {
        id: crypto.randomUUID(),
        subject,
        message,
        status: "received",
        createdAt: new Date().toISOString()
      };
      setSupportTickets((current) => [ticket, ...current]);
      notify("Support request received");
      try {
        await persist("reports", {
          type: "support",
          subject,
          message,
          reporterId: auth?.currentUser?.uid || "guest"
        });
      } catch {
        notify("Support request saved on this device");
      }
    },
    [notify, persist, setSupportTickets]
  );

  const catalogItems = useMemo(() => {
    const managedSeeds = catalog.map(toManaged);
    return [...customPlaces, ...managedSeeds].map((item) => ({
      ...item,
      featured: featuredIds.includes(item.id),
      sponsored: sponsoredIds.includes(item.id)
    }));
  }, [customPlaces, featuredIds, sponsoredIds]);
  const guideItems = useMemo(
    () =>
      guides.map((guide) => ({
        ...guide,
        verified: verifiedGuideIds.includes(guide.id)
      })),
    [verifiedGuideIds]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      savedIds,
      tripIds,
      user,
      authOpen,
      notificationsOpen,
      preferences,
      notifications,
      bookings,
      reviews,
      messages,
      supportTickets,
      customPlaces,
      catalogItems,
      guideItems,
      featuredIds,
      sponsoredIds,
      verifiedGuideIds,
      setAuthOpen,
      setNotificationsOpen,
      updatePreferences: (next) =>
        setPreferences((current) => ({ ...current, ...next })),
      markNotificationRead: (id) =>
        setNotifications((current) =>
          current.map((item) =>
            item.id === id ? { ...item, read: true } : item
          )
        ),
      markAllNotificationsRead: () =>
        setNotifications((current) =>
          current.map((item) => ({ ...item, read: true }))
        ),
      toggleSaved,
      addToTrip,
      removeFromTrip: (id) => {
        setTripIds((current) =>
          current.filter((itemId) => itemId !== id)
        );
        notify("Removed from trip");
      },
      addTemplateToTrip: (ids) => {
        setTripIds((current) => [...new Set([...current, ...ids])]);
        notify("Itinerary added to your trip");
      },
      createBooking,
      updateBookingStatus: (id, status) => {
        setBookings((current) =>
          current.map((item) =>
            item.id === id ? { ...item, status } : item
          )
        );
        if (db && auth?.currentUser) {
          void updateDoc(doc(db, "bookings", id), { status }).catch(() =>
            notify("Status changed here; cloud sync needs an administrator")
          );
        }
        if (status === "confirmed") {
          pushNotification(
            "Request confirmed",
            "Your GoUG request has been confirmed. Open Trips for the details."
          );
        }
        notify(status === "cancelled" ? "Request cancelled" : "Request updated");
      },
      addReview,
      moderateReview: (id, status) => {
        setReviews((current) =>
          current.map((item) =>
            item.id === id ? { ...item, status } : item
          )
        );
        if (db && auth?.currentUser) {
          void updateDoc(doc(db, "reviews", id), { status }).catch(() =>
            notify("Moderation saved here; cloud sync needs a moderator")
          );
        }
        notify(status === "published" ? "Review published" : "Review rejected");
      },
      sendMessage,
      submitSupportTicket,
      addCustomPlace: (place) => {
        setCustomPlaces((current) => [place, ...current]);
        notify(`${place.title} added`);
      },
      updateCustomPlace: (id, next) => {
        setCustomPlaces((current) =>
          current.map((item) => (item.id === id ? { ...item, ...next } : item))
        );
        notify("Place updated");
      },
      removeCustomPlace: (id) => {
        setCustomPlaces((current) =>
          current.filter((item) => item.id !== id)
        );
        notify("Place removed");
      },
      toggleFeatured: (id) =>
        setFeaturedIds((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id]
        ),
      toggleSponsored: (id) =>
        setSponsoredIds((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id]
        ),
      toggleGuideVerified: (id) =>
        setVerifiedGuideIds((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id]
        ),
      signIn: (nextUser) => {
        setUser(nextUser);
        setAuthOpen(false);
        notify(`Welcome, ${nextUser.displayName.split(" ")[0]}`);
      },
      signOut: () => {
        if (auth) void firebaseSignOut(auth);
        setUser(null);
        notify("Signed out");
      },
      deleteAccount: async () => {
        try {
          if (auth?.currentUser) await deleteUser(auth.currentUser);
          setUser(null);
          setSavedIds([]);
          setTripIds([]);
          setBookings([]);
          setReviews([]);
          setMessages([]);
          setSupportTickets([]);
          notify("Account data removed");
          return true;
        } catch {
          notify("Please sign in again before deleting your account");
          return false;
        }
      },
      notify
    }),
    [
      addReview,
      addToTrip,
      authOpen,
      bookings,
      catalogItems,
      createBooking,
      customPlaces,
      featuredIds,
      guideItems,
      messages,
      notifications,
      notificationsOpen,
      notify,
      preferences,
      pushNotification,
      reviews,
      savedIds,
      sendMessage,
      setBookings,
      setCustomPlaces,
      setFeaturedIds,
      setMessages,
      setNotifications,
      setPreferences,
      setReviews,
      setSavedIds,
      setSponsoredIds,
      setSupportTickets,
      setTripIds,
      setUser,
      setVerifiedGuideIds,
      sponsoredIds,
      submitSupportTicket,
      supportTickets,
      toggleSaved,
      tripIds,
      user,
      verifiedGuideIds
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
