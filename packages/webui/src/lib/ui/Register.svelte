<script lang="ts">
    import { session } from "$lib/store.svelte"
    import Dialog from "./Dialog.svelte"
    import TextField from "./TextField.svelte"
    import Buttons from "./Buttons.svelte"
    import { Issue, type UserRegisterClient } from "common"
    import { UserClient } from "$lib/rest/UserClient"
    
    let issues: Issue[] = $state([])

    const registerForm: UserRegisterClient = {
        username: "", name: "", password: "", passwordConfirmation: ""
    }

    async function register() {
        const result = await UserClient.register(registerForm)
        if (result.ok) {
            session.user = result.value
        } else {
            issues = result.issues
        }
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