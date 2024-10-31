<script lang="ts">
    import { onMount, type Snippet } from "svelte"
    import { browser } from "$app/environment"
    import { goto } from "$lib/util/navigation"
    import { getSession } from "$lib/util/session"

    type IsAuthenticatedProps = {
        children: Snippet,
    }

    const {children }: IsAuthenticatedProps = $props()

    let authenticated: boolean = $state(false)

    onMount(() => {
        if (browser) {
            const session = getSession()
            if (session == undefined || session.user == undefined) {
                goto(`/login?redirect=${encodeURIComponent(document.location.pathname)}`)
            } else {
                authenticated = true
            }
        }
    })
</script>
{#if authenticated}
    {@render children()}
{/if}