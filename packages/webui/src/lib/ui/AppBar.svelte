<script lang="ts">
    import { onMount } from "svelte"
    import Eyes from "$lib/icons/Eyes.svelte"
    import { getSession } from "$lib/util/session"
    import type { ClientSession } from "common"

    let session: ClientSession

    onMount(async () => {
        session = getSession()
    })
</script>
<div class="app-bar">
    <Eyes />
    <h1>Behold VTT</h1>
    {#if session?.user}
        <div class="user">{session.user.name}</div>
    {/if}
</div>