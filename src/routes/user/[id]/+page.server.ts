import { env } from "$env/dynamic/public";
const PUBLIC_API_BASE_URL = env.PUBLIC_API_BASE_URL;

export const load = async ({ params, fetch }) => {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/user/${params.id}`);
    const user = await res.json();
    return { user };
};
