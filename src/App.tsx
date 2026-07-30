import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AuthSheet } from "@/components/AuthSheet";
import { NavigationManager } from "@/components/NavigationManager";
import { NotificationSheet } from "@/components/NotificationSheet";
import { Onboarding } from "@/components/Onboarding";
import { useApp } from "@/context/AppContext";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { AdminPage } from "@/pages/AdminPage";
import { DiscoverPage } from "@/pages/DiscoverPage";
import { GuideDetailPage } from "@/pages/GuideDetailPage";
import { GuidesPage } from "@/pages/GuidesPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { MessagesPage } from "@/pages/MessagesPage";
import { MapPage } from "@/pages/MapPage";
import { PlaceDetailPage } from "@/pages/PlaceDetailPage";
import { PreferencesPage } from "@/pages/PreferencesPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RequestPage } from "@/pages/RequestPage";
import { SupportPage } from "@/pages/SupportPage";
import { TripsPage } from "@/pages/TripsPage";

export default function App() {
  const location = useLocation();
  const [hasOnboarded, setHasOnboarded] = useLocalStorage(
    "goug-onboarded",
    false
  );
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const { setAuthOpen } = useApp();
  const showOnboarding =
    location.pathname !== "/privacy" &&
    !hasOnboarded &&
    !onboardingDismissed;

  const completeOnboarding = (openAuth = false) => {
    setHasOnboarded(true);
    setOnboardingDismissed(true);
    if (openAuth) {
      window.setTimeout(() => setAuthOpen(true), 180);
    }
  };

  return (
    <>
      <NavigationManager onboardingVisible={showOnboarding} />
      {showOnboarding && (
        <Onboarding
          onExplore={() => completeOnboarding(false)}
          onSignIn={() => completeOnboarding(true)}
        />
      )}
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DiscoverPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="guides" element={<GuidesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="places/:id" element={<PlaceDetailPage />} />
          <Route path="guides/:id" element={<GuideDetailPage />} />
          <Route path="messages/:id" element={<MessagesPage />} />
          <Route path="request/:kind/:id" element={<RequestPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
      <AuthSheet />
      <NotificationSheet />
    </>
  );
}
