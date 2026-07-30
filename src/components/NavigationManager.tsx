import { useEffect, useLayoutEffect, useRef } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import {
  useLocation,
  useNavigate,
  useNavigationType
} from "react-router-dom";
import { useApp } from "@/context/AppContext";

type NavigationManagerProps = {
  onboardingVisible: boolean;
};

const scrollPositions = new Map<string, number>();

function fallbackFor(pathname: string) {
  if (pathname.startsWith("/guides/")) return "/guides";
  return "/";
}

export function NavigationManager({
  onboardingVisible
}: NavigationManagerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const {
    authOpen,
    setAuthOpen,
    notificationsOpen,
    setNotificationsOpen
  } = useApp();
  const stateRef = useRef({
    authOpen,
    notificationsOpen,
    onboardingVisible,
    location
  });

  stateRef.current = {
    authOpen,
    notificationsOpen,
    onboardingVisible,
    location
  };

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const restored =
          navigationType === "POP"
            ? scrollPositions.get(location.key) ?? 0
            : 0;
        window.scrollTo({ left: 0, top: restored, behavior: "auto" });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      scrollPositions.set(location.key, window.scrollY);
    };
  }, [location.key, navigationType]);

  useEffect(() => {
    const lockScroll = authOpen || notificationsOpen || onboardingVisible;
    document.body.classList.toggle("is-scroll-locked", lockScroll);
    return () => document.body.classList.remove("is-scroll-locked");
  }, [authOpen, notificationsOpen, onboardingVisible]);

  useEffect(() => {
    if (!authOpen && !notificationsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (notificationsOpen) setNotificationsOpen(false);
      else setAuthOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [
    authOpen,
    notificationsOpen,
    setAuthOpen,
    setNotificationsOpen
  ]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let disposed = false;
    let removeListener: (() => Promise<void>) | undefined;

    void CapacitorApp.addListener("backButton", () => {
      const current = stateRef.current;

      if (current.notificationsOpen) {
        setNotificationsOpen(false);
        return;
      }

      if (current.authOpen) {
        setAuthOpen(false);
        return;
      }

      if (current.onboardingVisible) {
        void CapacitorApp.exitApp();
        return;
      }

      const pathname = current.location.pathname;
      const isDetail =
        pathname.startsWith("/places/") || pathname.startsWith("/guides/");
      const isSecondary =
        pathname.startsWith("/messages/") ||
        pathname.startsWith("/request/") ||
        pathname === "/preferences" ||
        pathname === "/privacy" ||
        pathname === "/support";

      if (isDetail || isSecondary) {
        if (current.location.key === "default") {
          const fallback = pathname.startsWith("/messages/")
            ? `/guides/${pathname.split("/").at(-1)}`
            : pathname.startsWith("/request/guide/")
              ? `/guides/${pathname.split("/").at(-1)}`
              : pathname.startsWith("/request/place/")
                ? `/places/${pathname.split("/").at(-1)}`
                : isDetail
                  ? fallbackFor(pathname)
                  : "/profile";
          navigate(fallback, { replace: true });
        } else {
          navigate(-1);
        }
        return;
      }

      if (pathname !== "/") {
        navigate("/", { replace: true });
        return;
      }

      void CapacitorApp.exitApp();
    }).then((handle) => {
      if (disposed) {
        void handle.remove();
      } else {
        removeListener = () => handle.remove();
      }
    });

    return () => {
      disposed = true;
      void removeListener?.();
    };
  }, [navigate, setAuthOpen, setNotificationsOpen]);

  return null;
}
