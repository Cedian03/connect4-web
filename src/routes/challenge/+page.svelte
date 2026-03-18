<script lang="ts">
    import { goto } from "$app/navigation";
    import { env } from "$env/dynamic/public";
    import { Disk } from "$lib/board";
    const { PUBLIC_API_BASE_URL } = env;

    let { data } = $props();
    const { userId } = data;

    interface MinimalUser {
        id: number;
        username: string;
    }

    let query = $state("");
    let results: MinimalUser[] = $state([]);
    let timer: ReturnType<typeof setTimeout>;

    function onInput() {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            if (!query) return (results = []);
            const params = new URLSearchParams({ query });
            const res = await fetch(
                `${PUBLIC_API_BASE_URL}/user/search?${params}`,
            );
            results = await res.json();
        }, 300);
    }

    let selectedDisk = $state(Disk.X);

    async function tryChallenge(id: number) {
        let as_x;
        let as_o;

        if (selectedDisk === Disk.X) {
            as_x = userId;
            as_o = id;
        } else {
            as_x = id;
            as_o = userId;
        }

        const params = new URLSearchParams({ as_x, as_o });
        const res = await fetch(`${PUBLIC_API_BASE_URL}/game?${params}`, {
            method: "POST",
        });

        const game = await res.json();

        goto(`/game/${game.id}`);
    }
</script>

<input bind:value={query} oninput={onInput} placeholder="Search users..." />

I want to play as
<select bind:value={selectedDisk}>
    <option value={Disk.X}>Red</option>
    <option value={Disk.O}>Yellow</option>
</select>

{#if results.length}
    <ul>
        {#each results as user}
            <li>
                <button onclick={async () => tryChallenge(user.id)}
                    >{user.username}</button
                >
            </li>
        {/each}
    </ul>
{/if}
