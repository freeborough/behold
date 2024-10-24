<script lang="ts">
    import Eyes from "$lib/icons/Eyes.svelte"
    import { session } from "$lib/store.svelte"
</script>
<div class="app-bar">
    <Eyes />
    <h1>Behold VTT</h1>
    {#if session.user !== undefined}
        <div class="user">{session.user.name}</div>
    {/if}
</div>