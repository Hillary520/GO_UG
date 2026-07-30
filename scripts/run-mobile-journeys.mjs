import { readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl =
  process.env.GOUG_BASE_URL || "http://127.0.0.1:4173/GO_UG/";
const xml = await readFile(
  new URL("../tests/journeys/navigation.xml", import.meta.url),
  "utf8"
);
const journeyNames = [...xml.matchAll(/<journey name="([^"]+)">/g)].map(
  (match) => match[1]
);

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"]
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true
});
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

const results = [];
let discoveryScroll = 0;

async function record(journey, action, execute) {
  try {
    const comment = await execute();
    results.push({ journey, action, status: "PASSED", comment });
  } catch (error) {
    results.push({
      journey,
      action,
      status: "FAILED",
      comment: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

const detailJourney = journeyNames[0];
await record(detailJourney, "Open the app and complete onboarding", async () => {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Explore Uganda" }).click();
  await page.getByRole("heading", { name: "Where to next?" }).waitFor();
  return "Discovery screen is visible at a 390×844 mobile viewport.";
});
await record(detailJourney, "Scroll to the discovery catalogue", async () => {
  const card = page.locator(".catalog-card__body").first();
  await card.scrollIntoViewIfNeeded();
  discoveryScroll = await page.evaluate(() => window.scrollY);
  expect(discoveryScroll > 300, `Expected a meaningful scroll position, got ${discoveryScroll}.`);
  return `Discovery scroll position recorded at ${discoveryScroll}px.`;
});
await record(detailJourney, "Open the first catalogue place", async () => {
  await page.locator(".catalog-card__body").first().click();
  await page.waitForURL(/#\/places\//);
  await page.locator(".detail-page h1").first().waitFor();
  return `Opened ${page.url()}.`;
});
await record(
  detailJourney,
  "Verify that the place detail screen starts at the top",
  async () => {
    await page.waitForTimeout(100);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY <= 2, `Place detail opened at ${scrollY}px instead of the top.`);
    return "Place detail opened at the top.";
  }
);
await record(detailJourney, "Tap the detail back button", async () => {
  await page.getByRole("button", { name: "Go back" }).click();
  await page.waitForURL((url) => !url.hash || url.hash === "#/");
  return "Returned to Discover using the in-app back control.";
});
await record(
  detailJourney,
  "Verify that discovery returns to its previous scroll position",
  async () => {
    await page.waitForTimeout(100);
    const restored = await page.evaluate(() => window.scrollY);
    expect(
      Math.abs(restored - discoveryScroll) < 80,
      `Expected roughly ${discoveryScroll}px but restored ${restored}px.`
    );
    return `Discovery restored to ${restored}px.`;
  }
);

const tabsJourney = journeyNames[1];
await record(tabsJourney, "Scroll down on Discover", async () => {
  await page.evaluate(() => window.scrollTo(0, 900));
  return "Discover moved away from the top.";
});
await record(tabsJourney, "Tap the Trips tab", async () => {
  await page.getByRole("link", { name: "Trips", exact: true }).click();
  await page.waitForURL(/#\/trips$/);
  return "Trips route opened.";
});
await record(tabsJourney, "Verify that Trips starts at the top", async () => {
  await page.waitForTimeout(100);
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY <= 2, `Trips opened at ${scrollY}px.`);
  return "Trips opened at the top.";
});
await record(tabsJourney, "Scroll down on Trips", async () => {
  await page.evaluate(() => window.scrollTo(0, 700));
  return "Trips moved away from the top.";
});
await record(tabsJourney, "Tap the Guides tab", async () => {
  await page.getByRole("link", { name: "Guides", exact: true }).click();
  await page.waitForURL(/#\/guides$/);
  return "Guides route opened.";
});
await record(tabsJourney, "Verify that Guides starts at the top", async () => {
  await page.waitForTimeout(100);
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY <= 2, `Guides opened at ${scrollY}px.`);
  return "Guides opened at the top.";
});

const fallbackJourney = journeyNames[2];
await record(fallbackJourney, "Open a guide profile directly", async () => {
  await page.goto(`${baseUrl}#/guides/amina`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Go back" }).waitFor();
  return "Direct guide URL loaded.";
});
await record(fallbackJourney, "Tap the detail back button", async () => {
  await page.getByRole("button", { name: "Go back" }).click();
  await page.waitForURL(/#\/guides$/);
  return "Direct detail used its Guides fallback.";
});
await record(
  fallbackJourney,
  "Verify that the Guides page opens at the top",
  async () => {
    await page.waitForTimeout(100);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY <= 2, `Guides fallback opened at ${scrollY}px.`);
    return "Guides fallback opened at the top.";
  }
);
await record(fallbackJourney, "Open the sign-in sheet", async () => {
  await page.getByRole("link", { name: "Trips", exact: true }).click();
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("dialog").waitFor();
  return "Sign-in sheet opened.";
});
await record(
  fallbackJourney,
  "Verify that background scrolling is locked",
  async () => {
    const locked = await page.locator("body").evaluate((body) =>
      body.classList.contains("is-scroll-locked")
    );
    expect(locked, "Body did not lock while the modal was open.");
    return "Background scroll is locked.";
  }
);
await record(
  fallbackJourney,
  "Dismiss the sign-in sheet with Escape",
  async () => {
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    return "Sign-in sheet dismissed.";
  }
);
await record(
  fallbackJourney,
  "Verify that background scrolling is restored",
  async () => {
    const locked = await page.locator("body").evaluate((body) =>
      body.classList.contains("is-scroll-locked")
    );
    expect(!locked, "Body remained locked after the modal closed.");
    expect(consoleErrors.length === 0, `Browser errors: ${consoleErrors.join(" | ")}`);
    return "Background scroll is restored and no browser errors were recorded.";
  }
);

const mapJourney = journeyNames[3];
await record(mapJourney, "Open the Map tab", async () => {
  await page.getByRole("link", { name: "Map", exact: true }).click();
  await page.waitForURL(/#\/map$/);
  return "Map route opened inside the app.";
});
await record(mapJourney, "Wait for the interactive map", async () => {
  await page.locator(".maplibregl-canvas").waitFor({ timeout: 20000 });
  return "MapLibre rendered an interactive canvas.";
});
await record(
  mapJourney,
  "Verify that Uganda place markers are visible",
  async () => {
    const markers = await page.locator(".goug-map-marker").count();
    expect(markers >= 8, `Expected at least 8 map markers, found ${markers}.`);
    return `${markers} mapped Uganda places are visible.`;
  }
);

const bookingJourney = journeyNames[4];
await record(
  bookingJourney,
  "Request availability for Bwindi",
  async () => {
    await page.goto(`${baseUrl}#/places/bwindi`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Request availability" }).click();
    await page.waitForURL(/#\/request\/place\/bwindi$/);
    const date = new Date();
    date.setDate(date.getDate() + 14);
    await page.locator('input[type="date"]').fill(date.toISOString().slice(0, 10));
    await page.locator('input[type="number"]').fill("2");
    await page.locator("textarea").fill("Morning start and a gentle walking pace.");
    await page.getByRole("button", { name: "Save request" }).click();
    await page.waitForURL(/#\/trips$/);
    return "Availability request submitted without a payment step.";
  }
);
await record(
  bookingJourney,
  "Verify the pending request in Trips",
  async () => {
    await page.getByRole("heading", { name: "Bwindi Impenetrable Forest" }).waitFor();
    await page.locator(".request-list__status--pending").waitFor();
    return "Trips displays the request as pending.";
  }
);
await record(
  bookingJourney,
  "Confirm the request in Content studio",
  async () => {
    await page.goto(`${baseUrl}#/admin`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: "Bookings" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await page.locator(".request-status--confirmed").waitFor();
    return "Content studio confirmed the traveller request.";
  }
);
await record(
  bookingJourney,
  "Verify the confirmed request in Trips",
  async () => {
    await page.goto(`${baseUrl}#/trips`, { waitUntil: "networkidle" });
    await page.locator(".request-list__status--confirmed").waitFor();
    return "Trips immediately reflects the confirmed status.";
  }
);

const messageJourney = journeyNames[5];
await record(messageJourney, "Send a message to a guide", async () => {
  await page.goto(`${baseUrl}#/guides/amina`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Ask a question" }).click();
  const input = page.getByRole("textbox", { name: "Message" });
  await input.fill("Can we focus on Kampala food markets?");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText("Can we focus on Kampala food markets?", { exact: true }).waitFor();
  return "The guide conversation displays the sent message.";
});
await record(messageJourney, "Update language and currency", async () => {
  await page.goto(`${baseUrl}#/preferences`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Luganda/ }).click();
  await page.getByRole("button", { name: /USD/ }).click();
  return "Luganda and USD were selected.";
});
await record(messageJourney, "Verify preferences were persisted", async () => {
  await page.reload({ waitUntil: "networkidle" });
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("goug-preferences") || "{}")
  );
  expect(saved.language === "Luganda", `Saved language was ${saved.language}.`);
  expect(saved.currency === "USD", `Saved currency was ${saved.currency}.`);
  return "Language and currency survived a full reload.";
});

const reviewJourney = journeyNames[6];
await record(reviewJourney, "Seed a pending traveller review", async () => {
  await page.evaluate(() => {
    localStorage.setItem(
      "goug-reviews",
      JSON.stringify([
        {
          id: "journey-review",
          entityId: "bwindi",
          author: "Journey Traveller",
          rating: 5,
          text: "Thoughtful guiding and an unforgettable forest morning.",
          status: "pending",
          createdAt: new Date().toISOString()
        }
      ])
    );
  });
  await page.reload({ waitUntil: "networkidle" });
  return "A pending review was created in the local-first store.";
});
await record(
  reviewJourney,
  "Publish the review in Content studio",
  async () => {
    await page.goto(`${baseUrl}#/admin`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: /Moderation/ }).click();
    await page.getByRole("button", { name: "Publish" }).click();
    await page.getByText("published", { exact: true }).waitFor();
    return "The moderation queue published the review.";
  }
);
await record(
  reviewJourney,
  "Verify the review appears on the place page",
  async () => {
    await page.goto(`${baseUrl}#/places/bwindi`, { waitUntil: "networkidle" });
    await page
      .getByText("Thoughtful guiding and an unforgettable forest morning.", {
        exact: true
      })
      .waitFor();
    expect(consoleErrors.length === 0, `Browser errors: ${consoleErrors.join(" | ")}`);
    return "The published review is visible and no browser errors were recorded.";
  }
);

await browser.close();
console.log(JSON.stringify({ viewport: "390x844", results }, null, 2));
