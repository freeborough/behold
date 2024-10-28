import { goto as navGoto } from "$app/navigation"

/**
 * Simple wrapper of the Svelte goto function so it works consistently.
 * 
 * I'm having problems with using the built-in goto function and have yet to get to the bottom of
 * it, and this has been suggested in the GitHub issue as a workaround.  Not ideal, but if we do it
 * in a central place it makes it easier for us to transition back when there's a fix.
 *
 * @param url The url to navigate to.
 */
export function goto(url: string | URL) {
    requestAnimationFrame(() => navGoto(url))
}
