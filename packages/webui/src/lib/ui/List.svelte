<script lang="ts">
    import type { Snippet } from "svelte"
    
    type ListProps = {
        children: Snippet
    }

    const { children }: ListProps = $props()
</script>
<div class="list">
    {@render children()}
</div>