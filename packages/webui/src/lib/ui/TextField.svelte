<script lang="ts">
    import type { Issue } from "common";
    import FormField from "./FormField.svelte";

    type TextFieldProps = {
        name: string,
        value?: string,
        type?: "text" | "password" | "email",
        label?: string,
        required?: boolean,
        placeholder?: string,
        issues?: Issue[],
    }

    let {
        name,
        value = $bindable(""),
        type: inputType = "text",
        label,
        required,
        placeholder,
        issues = [],
        ...rest
    }: TextFieldProps = $props()
</script>
<FormField {name} {label} {required} {issues}>
    <input type={inputType} bind:value={value} {placeholder} {...rest} />
</FormField>