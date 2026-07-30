import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useSmartBack(fallback: string) {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(() => {
    if (location.key === "default") {
      navigate(fallback, { replace: true });
      return;
    }

    navigate(-1);
  }, [fallback, location.key, navigate]);
}
