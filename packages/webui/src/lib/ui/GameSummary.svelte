<script lang="ts">
    import { type Game, type User } from "common"
    import { goto } from "$lib/util/navigation"
    import Card from "$lib/ui/Card.svelte"
    import Buttons from "$lib/ui/Buttons.svelte"

    // DEBUG: Dummy data.
    // TODO: Get from clientSession cookie (create a function to do so).
    const user: User = {
        id: "123",
        name: "Bilbo Baggins",
        username: "bilbo@baggins.com",
    }

    type GameSummaryProps = {
        game: Game
    }

    const { game }: GameSummaryProps = $props()

    function join() {
        goto(`/games/play/${game.slug}/`)
    }
</script>
<div class="game">
    <Card>
        <h2>{game.name}</h2>
        <p>{game.description}</p>
        <Buttons>
            {#if game.owner_id === user.id}
                <button class="secondary">Delete</button>
            {:else}
                <button class="secondary">Withdraw</button>
            {/if}
            <button onclick={join}>Join</button>
        </Buttons>
    </Card>
</div>