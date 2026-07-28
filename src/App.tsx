import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AuthSheet } from "@/components/AuthSheet";
import { Onboarding } from "@/components/Onboarding";
import { useApp } from "@/context/AppContext";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { AdminPage } from "@/pages/AdminPage";
import { DiscoverPage } from "@/pages/DiscoverPage";
import { GuideDetailPage } from "@/pages/GuideDetailPage";
import { GuidesPage } from "@/pages/GuidesPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PlaceDetailPage } from "@/pages/PlaceDetailPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { TripsPage } from "@/pages/TripsPage";

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useLocalStorage(
    "goug-onboarded",
    false
  );
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const { setAuthOpen } = useApp();
  const showOnboarding = !hasOnboarded && !onboardingDismissed;

  const completeOnboarding = (openAuth = false) => {
    setHasOnboarded(true);
    setOnboardingDismissed(true);
    if (openAuth) {
      window.setTimeout(() => setAuthOpen(true), 180);
    }
  };

  return (
    <>
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
          <Route path="guides" element={<GuidesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="places/:id" element={<PlaceDetailPage />} />
          <Route path="guides/:id" element={<GuideDetailPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
      <AuthSheet />
    </>
  );
}
