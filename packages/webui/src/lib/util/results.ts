import { z } from "zod"
import { Issue, IssueKind, zodToIssue } from "common"

export function clientErrorToIssue(error: Error): Issue[] {
    const issues: Issue[] = []

    // TODO: Handle HTTP issues.
    if (error instanceof z.ZodError) {
        issues.push(...zodToIssue(error))
    } else {    
        console.error(error)
        issues.push(new Issue("Internal error.", IssueKind.INTERNAL, ""))
    }

    return issues
}
