import { env } from "$env/dynamic/public";
const { PUBLIC_API_BASE_URL } = env;

import { parseToken } from "$lib/auth";

export const load = async ({ params, fetch, cookies }) => {
    const token = cookies.get("token");
    const user = token !== undefined ? parseToken(token) : null;
    const res = await fetch(`${PUBLIC_API_BASE_URL}/game/${params.id}`);
    const game = await res.json();
    return { game, userId: user?.id };
};
