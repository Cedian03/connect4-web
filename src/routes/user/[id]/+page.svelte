<script lang="ts">
    import { onMount } from "svelte";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_API_BASE_URL } = env;

    import { Disk } from "$lib/board";

    interface Props {
        user: User;
    }

    interface User {
        id: number;
        username: string;
    }

    interface Game {
        id: number;
        as_x: number;
        as_o: number;
        moves: string;
        winner: Disk | null;
        forfeit: boolean | null;
    }

    const { data } = $props();
    const { user }: Props = data;

    let games: Game[] = $state([]);

    onMount(async () => {
        const res = await fetch(`${PUBLIC_API_BASE_URL}/user/${user.id}/games`);
        games = await res.json();
    });
</script>

<h1>{user.username}</h1>

<h2>Games</h2>
<ul>
    {#each games as game}
        <li>
            <a href={`/game/${game.id}`}>
                {game.as_x} vs {game.as_o}
                {#if game.forfeit !== null}
                    {#if game.winner}
                        {#if game.winner === Disk.X}
                            Winner: Red
                        {:else}
                            Winner: Yellow
                        {/if}
                    {:else}
                        Draw
                    {/if}
                {:else}
                    On going
                {/if}
            </a>
        </li>
    {/each}
</ul>
