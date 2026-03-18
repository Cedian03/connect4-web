export function setToken(token: string) {
    document.cookie = `token=${token}; path=/; SameSite=Strict`;
}

export function getToken(): string | null {
    return document.cookie.match(/token=([^;]+)/)?.[1] ?? null;
}

export function parseToken(token: string) {
    if (token === null) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.sub, username: payload.username };
}
