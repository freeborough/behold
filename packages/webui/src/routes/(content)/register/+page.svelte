<script lang="ts">
    import { goto } from "$app/navigation"
    import { Issue, type UserRegisterClient } from "common"
    import { session } from "$lib/store.svelte"
    import Dialog from "$lib/ui/Dialog.svelte"
    import TextField from "$lib/ui/TextField.svelte"
    import Buttons from "$lib/ui/Buttons.svelte"
    import { UserClient } from "$lib/rest/UserClient"
    
    let issues: Issue[] = $state([])

    const registerForm: UserRegisterClient = {
        username: "", name: "", password: "", passwordConfirmation: ""
    }

    function login() {
        requestAnimationFrame(() => goto("/login"))
    }

    async function register() {
        const result = await UserClient.register(registerForm)
        if (result.ok) {
            session.user = result.value
            requestAnimationFrame(() => goto("/play"))
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
            <button class="secondary" onclick={login}>Login</button>
            <button onclick={register}>Register</button>
        </Buttons>
    </form>
</Dialog>
