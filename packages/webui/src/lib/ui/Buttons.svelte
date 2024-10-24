<script lang="ts">
    import type { Snippet } from "svelte"

    type ButtonsProps = {
        children: Snippet
    }

    const { children }: ButtonsProps = $props()
</script>
<div class="buttons">
    {@render children()}
</div>