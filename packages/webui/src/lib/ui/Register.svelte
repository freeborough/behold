<script lang="ts">
    import Dialog from "./Dialog.svelte"
    import Field from "./Field.svelte"
    import Buttons from "./Buttons.svelte"
</script>
<Dialog title="Register">
    <form>
        <Field>
            <label for="email">Email <super>*</super></label>
            <input id="email" type="email" placeholder="your@email.com" />
        </Field>
        <Field>
            <label for="name">Display Name <super>*</super></label>
            <input id="name" type="text" placeholder="Your Display Name" />
        </Field>
        <Field>
            <label for="password">Password <super>*</super></label>
            <input id="password" type="password" placeholder="********" />
        </Field>
        <Field>
            <label for="passwordConfirmation">Confirm Password <super>*</super></label>
            <input id="passwordConfirmation" type="password" placeholder="********" />
        </Field>
        <Buttons>
            <button class="secondary">Login</button>
            <button>Register</button>
        </Buttons>
    </form>
</Dialog>