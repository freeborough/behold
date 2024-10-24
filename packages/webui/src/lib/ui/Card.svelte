<script lang="ts">
    import type { Snippet } from "svelte"

    type CardProps = {
        children: Snippet
    }

    const { children }: CardProps = $props()
</script>
<div class="card">
    {@render children()}
</div>