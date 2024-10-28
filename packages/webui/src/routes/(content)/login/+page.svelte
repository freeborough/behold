<script lang="ts">
    import { goto } from "$lib/util/navigation"
    import { Issue, type UserLogin } from "common"
    import { session } from "$lib/store.svelte"
    import Dialog from "$lib/ui/Dialog.svelte"
    import TextField from "$lib/ui/TextField.svelte"
    import Buttons from "$lib/ui/Buttons.svelte"
    import { UserClient } from "$lib/rest/UserClient"
    
    let issues: Issue[] = $state([])

    const loginForm: UserLogin = { username: "", password: "" }

    async function register() {
        goto("/register")
    }

    async function login() {
        const result = await UserClient.login(loginForm)
        if (result.ok) {
            session.user = result.value
            goto("/play")
        } else {
            issues = result.issues
        }
    }
</script>
<Dialog title="Login">
    <form>
        <TextField
            name="username"
            label="Email"
            type="email"
            placeholder="your@email.com"
            required={true}
            {issues}
            bind:value={loginForm.username} />
        
        <TextField
            name="password"
            label="Password"
            type="password"
            placeholder="********"
            required={true}
            {issues}
            bind:value={loginForm.password} />

        <Buttons>
            <button class="secondary" onclick={register}>Register</button>
            <button onclick={login}>Login</button>
        </Buttons>
    </form>
</Dialog>
