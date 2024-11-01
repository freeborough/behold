<script lang="ts">
    import { type ClientSession, type Game } from "common"
    import { goto } from "$lib/util/navigation"
    import { getSession } from "$lib/util/session"
    import Card from "$lib/ui/Card.svelte"
    import Buttons from "$lib/ui/Buttons.svelte"

    const session: ClientSession = getSession()

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
            {#if session?.user != undefined && game.owner_id === session?.user?.id}
                <button class="secondary">Delete</button>
            {:else}
                <button class="secondary">Withdraw</button>
            {/if}
            <button onclick={join}>Join</button>
        </Buttons>
    </Card>
</div>