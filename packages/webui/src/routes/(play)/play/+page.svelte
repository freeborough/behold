<script lang="ts">
    import type { Game } from "common"
    import IsAuthenticated from "$lib/ui/IsAuthenticated.svelte"
    import Buttons from "$lib/ui/Buttons.svelte"
    import GameSummary from "$lib/ui/GameSummary.svelte"   

    // DEBUG: Dummy data.
    const games: Game[] = [
        {
            id: "123",
            owner_id: "123",
            name: "The Blind Leading the Blind",
            slug: "the-blind-leading-the-blind",
            description: "In a world where magic has been forgotten... four wizards set out to save the world.",
        },
        {
            id: "345",
            owner_id: "345",
            name: "Mech Assault Mayhem",
            slug: "mech-assault-mayhem",
            description: "Four pilots must solve mysterys by punching their way to the truth in giant death robots.",
        },
        {
            id: "123",
            owner_id: "123",
            name: "The Blind Leading the Blind",
            slug: "the-blind-leading-the-blind",
            description: "In a world where magic has been forgotten... four wizards set out to save the world.",
        },
        {
            id: "123",
            owner_id: "123",
            name: "The Blind Leading the Blind",
            slug: "the-blind-leading-the-blind",
            description: "In a world where magic has been forgotten... four wizards set out to save the world.",
        },
        {
            id: "345",
            owner_id: "345",
            name: "Mech Assault Mayhem",
            slug: "mech-assault-mayhem",
            description: "Four pilots must solve mysterys by punching their way to the truth in giant death robots.",
        },
    ]
</script>
<IsAuthenticated>
    <div class="content">
        <h1>Play</h1>
        <Buttons>
            <button>Create New Game</button>
            <button class="secondary">Enter Invite Code</button>
        </Buttons>
        {#if games.length > 0}
            <div class="games">
                {#each games as game}
                    <GameSummary {game} />
                {/each}
            </div>
        {/if}
    </div>
</IsAuthenticated>