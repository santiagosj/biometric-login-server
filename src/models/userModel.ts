export type User = {
    id: string;
    email: string;
    publicKey: string;
    credentialId: string;
    username?: string;
    passwordHash?: string;
}

export const users: User[] = [];