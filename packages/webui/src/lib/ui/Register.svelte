<script lang="ts">
    import Dialog from "./Dialog.svelte"
    import Field from "./Field.svelte"
    import Buttons from "./Buttons.svelte"
</script>
<Dialog>
    <h1>Register</h1>
    <form>
        <Field>
            <label for="email">Email</label>
            <input id="email" type="email" placeholder="your@email.com" />
        </Field>
        <Field>
            <label for="name">Display Name</label>
            <input id="name" type="text" placeholder="Your Display Name" />
        </Field>
        <Field>
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="********" />
        </Field>
        <Field>
            <label for="passwordConfirmation">Confirm Password</label>
            <input id="passwordConfirmation" type="password" placeholder="********" />
        </Field>
        <Buttons>
            <button class="secondary">Login</button>
            <button>Register</button>
        </Buttons>
    </form>
</Dialog>