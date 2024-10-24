<script lang="ts">
    import type { Snippet } from "svelte"

    type FieldProps = {
        children: Snippet
    }

    const { children }: FieldProps = $props()
</script>
<div class="field">
    {@render children()}
</div>