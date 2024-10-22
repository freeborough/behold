<script lang="ts">
    import { UserClient } from "$lib/client/UserClient"

    async function onClick() {
        await UserClient.register({ name: "Frodo Baggins", password: "ChangeMe123", username: "frodo@baggins.com" })
    }
</script>
<button on:click={onClick}>Push The Button</button>
