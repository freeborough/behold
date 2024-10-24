<script lang="ts">
    import type { Issue } from "common";
    import type { Snippet } from "svelte"
    import Issues from "./Issues.svelte";

    type FormFieldProps = {
        name: string,
        label?: string,
        required?: boolean,
        issues?: Issue[],
        children: Snippet,
    }

    let {
        name,
        label,
        required = true,
        issues = [],
        children
    }: FormFieldProps = $props()

    let myIssues = $derived(issues.filter(i => i.references === name))
</script>
<div class="form-field">
    {#if label}
        <label for={name}>{label}{#if required}<super class="required-symbol">*</super>{/if}</label>
    {/if}
    {@render children()}
    <Issues issues={myIssues} />
</div>