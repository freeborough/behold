<script lang="ts">
    import { onMount } from "svelte"
    import type { ClientSession } from "common"
    import Eyes from "$lib/icons/Eyes.svelte"
    import { getSession } from "$lib/util/session"
    import IsAuthenticated from "./IsAuthenticated.svelte"

    let session: ClientSession

    onMount(async () => {
        session = getSession()
    })
</script>
<div class="app-bar">
    <Eyes />
    <h1>Behold VTT</h1>
    <IsAuthenticated>
        <div class="user">{session?.user?.name}</div>
    </IsAuthenticated>
</div>