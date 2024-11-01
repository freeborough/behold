<script lang="ts">
    import type { Game } from "common"
    import { GameClient } from "$lib/rest/GameClient"
    import IsAuthenticated from "$lib/ui/IsAuthenticated.svelte"
    import Buttons from "$lib/ui/Buttons.svelte"
    import GameSummary from "$lib/ui/GameSummary.svelte"   
</script>
<IsAuthenticated>
    <h1>Games</h1>
    <Buttons>
        <button>Create New Game</button>
        <button class="secondary">Enter Invite Code</button>
    </Buttons>
    {#await GameClient.all() then result}
        {#if result.ok}
            {#if result.value.length > 0}
                <div class="games">
                    {#each result.value as game}
                        <GameSummary {game} />
                    {/each}
                </div>
            {/if}
        {/if}
    {/await}
</IsAuthenticated>