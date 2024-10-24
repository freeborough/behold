<script lang="ts">
    import Dialog from "./Dialog.svelte"
    import TextField from "./TextField.svelte"
    import Buttons from "./Buttons.svelte"
    import { Issue, IssueKind } from "common";

    type RegisterForm = {
        username: string,
        name: string,
        password: string,
        passwordConfirmation: string,
    }
    
    const issues: Issue[] = $state([])

    const registerForm: RegisterForm = {
        username: "", name: "", password: "", passwordConfirmation: ""
    }

    async function register() {
        issues.push(new Issue("Required.", IssueKind.VALIDATION, "username"))
        issues.push(new Issue("Required.", IssueKind.VALIDATION, "name"))
        issues.push(new Issue("Must be a valid email address.", IssueKind.VALIDATION, "username"))
        issues.push(new Issue("Must match password.", IssueKind.VALIDATION, "passwordConfirmation"))
        console.log(`Registering: ${registerForm.username}, ${registerForm.name}, ${registerForm.password}, ${registerForm.passwordConfirmation}`)
    }
</script>
<Dialog title="Register">
    <form>
        <TextField
            name="username"
            label="Email"
            type="email"
            placeholder="your@email.com"
            required={true}
            {issues}
            bind:value={registerForm.username} />

        <TextField
            name="name"
            label="Display Name"
            placeholder="Your Display Name"
            required={true}
            {issues}
            bind:value={registerForm.name} />
        
        <TextField
            name="password"
            label="Password"
            type="password"
            placeholder="********"
            required={true}
            {issues}
            bind:value={registerForm.password} />
        
        <TextField
            name="passwordConfirmation"
            label="Confirm Password"
            type="password"
            placeholder="********"
            required={true}
            {issues}
            bind:value={registerForm.passwordConfirmation} />

        <Buttons>
            <button onclick={register}>Register</button>
        </Buttons>
    </form>
</Dialog>