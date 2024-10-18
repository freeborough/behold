import { describe, it, expect } from "vitest";
import { errorToIssue } from "./results";

describe("util/results", () => {
    describe("errorToIssue", () => {
        it("returns an internal issue if it encounters an error it doesn't explicitly handle", () => {
            const issues = errorToIssue(new Error("Unknown Error"))

            expect(issues[0].kind).toBe("INTERNAL")
        })
    })
})