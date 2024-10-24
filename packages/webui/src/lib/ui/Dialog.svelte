<script lang="ts">
    import type { Snippet } from "svelte"
    import Card from "./Card.svelte"

    type DialogProps = {
        children: Snippet
    }
    
    const { children }: DialogProps = $props()
</script>
<div class="dialog">
    <Card>
        {@render children()}
    </Card>
</div>