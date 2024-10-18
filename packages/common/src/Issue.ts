import { z } from "zod"

/**
 * The kind (type) of issue.  Currently we only have three possibilities:
 *
 *   - VALIDATION: For when the input was malformed or missing in some way.  For example, a supplied
 *     email address is not a well-formed email.
 *
 *   - CONSTRAINT: For when the input is well formed but fails an underlying constraint.  For
 *     example, trying to create a record with a unique field that already exists.
 *
 *   - INTERNAL: For when it's an issue that we don't want to feed back the details of to the end
 *     users.  These should be logged on the server.  For example, if a connection couldn't be
 *     established with a database.
 */
export enum IssueKind {
    VALIDATION = "VALIDATION",
    CONSTRAINT = "CONSTRAINT",
    INTERNAL = "INTERNAL",
}

/**
 * Issues are for encapsulating errors that we will ultimately want to be fed back to the end user
 * in some form.
 *
 * Follows the Notification pattern, but I have called it Issue as notifications have a specific
 * meaning in modern web and mobile development.  While it's idiomatic to throw Errors in
 * JavaScript, ultimately you can't throw an Error from the server to the client. Therefore the
 * errors need to be encapsulated in a way that can be sent back to the client application such that
 * they may be properly interpretted for the end user.  It makes the code dramatically cleaner if we
 * simply use this approach throughout rather than just in controllers and views.
 *
 * @example
 * issues.push(new Issue("Invalid email.", "VALIDATION", "email"))
 */
export class Issue {
    message: string
    kind: IssueKind
    references: string

    constructor(message: string, kind: IssueKind, references: string) {
        this.message = message
        this.kind = kind
        this.references = references
    }
}

/**
 * Converts all the issues within a ZodError into our Issues.  These can then be used by the client
 * to highlight and display validation issues.
 *
 * @param zodError The ZodError to convert to Issues.
 * @returns An Issue per issue within the ZodError
 * 
 * @example
 * try {
 *   const parsed = z.string().email().parse(data)
 * } catch(e) {
 *   issues.push(...zodToIssue(e))
 * }
 */
export function zodToIssue(zodError: z.ZodError): Issue[] {
    const result: Issue[] = []

    if (zodError.issues.length > 0) {
        for (const issue of zodError.issues) {
            result.push(new Issue(issue.message, IssueKind.VALIDATION, issue.path.join(".")))
        }
    }

    return result
}