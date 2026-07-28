import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  value: () => undefined,
  writable: true
});

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  value: () => undefined,
  writable: true
});
