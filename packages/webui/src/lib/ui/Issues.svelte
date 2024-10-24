<script lang="ts">
    import { slide } from "svelte/transition"
    import { Issue } from "common"

    type IssuesProps = {
        issues?: Issue[]
    }

    let { issues = [] }: IssuesProps = $props()
</script>

{#if issues.length > 0}
    <ul class="issues" transition:slide>
        {#each issues as issue}
            <li>{issue.message}</li>
        {/each}
    </ul>
{/if}
