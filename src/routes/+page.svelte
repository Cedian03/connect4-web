<script lang="ts">
    import { goto } from "$app/navigation";
    import { env } from "$env/dynamic/public";
    const { PUBLIC_API_BASE_URL } = env;

    import { setToken } from "$lib/auth";

    let username = $state("");
    let password = $state("");

    async function login() {
        const res = await fetch(`${PUBLIC_API_BASE_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.status != 200) {
            alert("Login attempt failed");
            return;
        }

        alert("Login successful");
        const { token } = await res.json();
        setToken(token);
        goto("/");
    }

    async function signup() {
        const res = await fetch(`${PUBLIC_API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.status != 200) {
            alert("Signup attempt failed");
            return;
        }

        alert("Signup successful");
        const { token } = await res.json();
        setToken(token);
        goto("/");
    }
</script>

<input bind:value={username} placeholder="username" />
<input bind:value={password} type="password" placeholder="password" />
<button onclick={async () => await login()}>Login</button>
<button onclick={async () => await signup()}>Signup</button>
