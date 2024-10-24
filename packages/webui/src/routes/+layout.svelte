<script lang="ts">
    const { children } = $props()

    import "$lib/themes/lurk/main.scss"
    import AppBar from "$lib/ui/AppBar.svelte"
</script>
<AppBar />
<div class="page">
    {@render children()}
</div>