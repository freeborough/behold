import { Issue } from "./Issue";

/**
 * Result type used to encapsulate errors in a way that can then be fed back to the client and
 * ultimately end users.
 *
 * Follows the Result pattern.  While not idiomatic JavaScript, one could argue that it is becoming
 * so for TypeScript as it is a widely used pattern.  It makes the whole process of tracking errors
 * and feeding them back to the end user far cleaner in all layers of the application.
 * 
 * @template T  The type of the result value.
 * @template I  The type of the issues, defaults to Issue[].
 * 
 * @example
 * function findUserById(id: string): Result<User> {
 *   const user = users.findById(id)
 *   if (user !== undefined) {
 *     return { ok: true, value: user }
 *   } else {
 *     return { ok: false, issues: [ new Issue("User not found.", "CONSTRAINT", "id") ]}
 *   }
 * }
 */
export type Result<T, I = Issue> = 
    | { ok: true, value: T }
    | { ok: false, issues: I[] }

/**
 * Helper function to create an ok Result.
 * 
 * @param value The value to be wrapped.
 * @returns The value wrapped in a result with ok set to true and value set to the passed value.
 * 
 * @example
 * return ok(record)
 */
export function ok<T>(value: T) {
    return { ok: true, value} as Result<T>
}

/**
 * Helper function to create an issue Result.
 * 
 * @param issues The issues to be wrapped.
 * @returns The issues wrapped in a result with ok set to false and issues set to the passed issues.
 * 
 * @example
 * return issue(new Issue("Record not found.", IssueKind.CONSTRAINT, "id"))
 */
export function issue<T, I = Issue>(issues: I | I[]) {
    if (!Array.isArray(issues)) {
        issues = [issues]
    }

    return { ok: false, issues } as Result<T>
}