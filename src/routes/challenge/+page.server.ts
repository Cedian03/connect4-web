import { parseToken } from "$lib/auth";

export const load = async ({ params, fetch, cookies }) => {
    const token = cookies.get("token");
    const user = token !== undefined ? parseToken(token) : null;
    return { userId: user?.id };
};
