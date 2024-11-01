<script lang="ts">   
    import { page } from "$app/stores";
    import IsAuthenticated from "$lib/ui/IsAuthenticated.svelte"
</script>
<IsAuthenticated>
    <h1>DEBUG: Playing Game: {$page.params.slug}</h1>
</IsAuthenticated>
