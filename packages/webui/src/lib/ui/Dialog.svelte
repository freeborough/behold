<script lang="ts">
    import type { Snippet } from "svelte"
    import Card from "./Card.svelte"

    type DialogProps = {
        title?: string,
        children: Snippet
    }
    
    const { title, children }: DialogProps = $props()
</script>
<div class="dialog">
    <Card>
        {#if title}
            <h1 class="title">{title}</h1>
        {/if}
        {@render children()}
    </Card>
</div>