import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "@/App";
import { AppProvider } from "@/context/AppContext";

function renderApp(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>
  );
}

describe("GoUG app", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("moves from welcome into the discovery experience", () => {
    renderApp();
    expect(
      screen.getByRole("heading", {
        name: /the stories are closer than you think/i
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /explore uganda/i }));

    expect(
      screen.getByRole("heading", { name: /where to next/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /start with something remarkable/i
      })
    ).toBeInTheDocument();
  });

  it("filters the catalogue by search", () => {
    window.localStorage.setItem("goug-onboarded", "true");
    renderApp();

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "coffee" }
    });

    expect(screen.getByText(/place found/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /sipi falls & coffee country/i
      })
    ).toBeInTheDocument();
  });

  it("builds a trip from a curated itinerary", () => {
    window.localStorage.setItem("goug-onboarded", "true");
    renderApp("/trips");

    fireEvent.click(
      screen.getByRole("button", { name: /add wild western uganda to trip/i })
    );

    expect(screen.getByText("3 stops")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /bwindi impenetrable forest/i })
    ).toBeInTheDocument();
  });
});
