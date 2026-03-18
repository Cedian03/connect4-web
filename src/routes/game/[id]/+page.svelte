<script lang="ts">
    import { env } from "$env/dynamic/public";
    const { PUBLIC_API_BASE_URL } = env;

    import { getToken } from "$lib/auth.js";
    import { Board, Disk } from "$lib/board";
    import BoardComponent from "$lib/components/Board.svelte";

    interface Props {
        game: {
            id: number;
            as_x: number;
            as_o: number;
            moves: string;
            winner: Disk | null;
            forfeit: boolean | null;
        };
        userId: number;
    }

    interface GameState {
        moves: string;
        winner: Disk | null;
        forfeit: boolean | null;
    }

    const { data } = $props();
    const { game, userId }: Props = data;

    const takingPart = userId == game.as_x || userId == game.as_o;

    let state: GameState = $state(game);

    let board = $derived(Board.fromStr(state.moves));
    let diskToPlay = $derived(board.diskToPlay());
    let hasConcluded = $derived(state.forfeit !== null);

    $effect(() => {
        const es = new EventSource(
            `${PUBLIC_API_BASE_URL}/game/${game.id}/stream`,
        );

        es.addEventListener("game-update", (ev) => {
            const update: GameState = JSON.parse(ev.data);
            state = update;
        });

        return () => es.close();
    });

    async function tryPlay(col: number) {
        if (!takingPart || hasConcluded) return;

        const params = new URLSearchParams({ column: col.toString() });
        const _res = await fetch(
            `${PUBLIC_API_BASE_URL}/game/${game.id}/play?${params}`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            },
        );
    }

    async function tryForfeit() {
        const _res = await fetch(
            `${PUBLIC_API_BASE_URL}/game/${game.id}/forfeit`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${getToken()}` },
            },
        );
    }
</script>

<h1>Game {game.id}</h1>
<BoardComponent moves={state.moves} onColumnClick={tryPlay} />
<div>
    {#if hasConcluded}
        {#if state.winner === Disk.X}
            Red won
        {:else if state.winner === Disk.O}
            Yellow won
        {:else}
            Draw
        {/if}

        {#if state.forfeit}
            (by forfeit)
        {/if}
    {:else}
        {#if diskToPlay === Disk.X}
            Red to play
        {:else if diskToPlay === Disk.O}
            Yellow to play
        {/if}

        {#if (diskToPlay === Disk.X && userId == game.as_x) || (diskToPlay === Disk.O && userId == game.as_o)}
            (you)
        {/if}

        {#if takingPart}
            <button id="forfeit" onclick={tryForfeit}>Forfeit</button>
        {/if}
    {/if}
</div>
