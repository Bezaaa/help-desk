import { describe, it, expect } from "vitest"
import { DEBOUNCE_SEARCH, DEBOUNCE_RESIZE, THROTTLE_SCROLL, THROTTLE_MOUSE_MOVE } from "./debounce-throttle"
import { PAGINATION_ITEMS_PER_PAGE, PAGINATION_MAX_VISIBLE_PAGES, PAGINATION_SIZE } from "./pagination"

describe("Timing and pagination constants", () => {
  it("debounce and throttle timings are set to expected ms values", () => {
    expect(DEBOUNCE_SEARCH).toBe(300)
    expect(DEBOUNCE_RESIZE).toBe(250)
    expect(THROTTLE_SCROLL).toBe(150)
    expect(THROTTLE_MOUSE_MOVE).toBe(100)
  })

  it("pagination defaults are sensible", () => {
    expect(PAGINATION_ITEMS_PER_PAGE).toBe(10)
    expect(PAGINATION_MAX_VISIBLE_PAGES).toBe(7)
    expect(PAGINATION_SIZE).toBe("md")
  })
})
