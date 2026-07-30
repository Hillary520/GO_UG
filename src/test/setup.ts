import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  value: () => undefined,
  writable: true
});

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  value: () => undefined,
  writable: true
});

Object.defineProperty(window.URL, "createObjectURL", {
  value: () => "blob:goug-test-worker",
  writable: true
});

Object.defineProperty(window.URL, "revokeObjectURL", {
  value: () => undefined,
  writable: true
});
