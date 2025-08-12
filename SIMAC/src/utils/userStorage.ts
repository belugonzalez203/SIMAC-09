import {readTextFile, writeTextFile} from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';

const filename = 'user.json';

export interface User {
    user: string;
    name_user: string;
    type_user: string;
}

export async function saveUserToFile(user: User) {
    const dir = await appDataDir();
    const path = dir + filename;

    await writeTextFile(path, JSON.stringify(user, null, 2));
}

export async function readUserFromFile(): Promise<User | null> {
    try {
        const dir = await appDataDir();
        const path = dir + filename;

        const content = await readTextFile(path);
        return JSON.parse(content);
    } catch (error) {
        console.error("No user logged in or failed to load user file", error);
        return null;
    }
}
