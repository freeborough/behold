import { describe, it, expect, vi } from "vitest";
import { errorToIssue } from "./results";

describe("util/results", () => {
    describe("errorToIssue", () => {
        it("returns an internal issue if it encounters an error it doesn't explicitly handle", () => {
            // Mock console.error to supress the errors that will of course be output.
            vi.spyOn(console, "error").mockImplementation(() => undefined)
            const issues = errorToIssue(new Error("Unknown Error"))
            vi.restoreAllMocks()

            expect(issues[0].kind).toBe("INTERNAL")
        })
    })
})