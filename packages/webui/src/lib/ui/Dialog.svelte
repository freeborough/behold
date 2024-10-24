<script lang="ts">
    import Card from "./Card.svelte"
    const { children } = $props()
</script>
<div class="dialog">
    <Card>
        {@render children()}
    </Card>
</div>