<script lang="ts">
    import { onMount } from 'svelte'
    import type { ClientSession } from 'common'
    import { getSession } from '$lib/util/session'
    import { goto } from '$lib/util/navigation'

    const { children } = $props()

    let session: ClientSession
    onMount(() => {
        // TODO: Wrap this up in a middleware-esque function/component.
        session = getSession()
        if (session == undefined || session.user == undefined) {
            // TODO: Pass this URL as a param so we can redirect back.
            goto("/login")
        }
    })
</script>
{@render children()}