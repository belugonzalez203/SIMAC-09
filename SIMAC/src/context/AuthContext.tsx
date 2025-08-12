import React, { createContext, useContext, useEffect, useState } from 'react';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';

interface User {
    user: string;
    name_user: string;
    type_user: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const USER_FILE = 'user.json';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const path = await appDataDir() + USER_FILE;
                console.log("Ruta del archivo de usuario:", path);
                const contents = await readTextFile(path);
                const parsedUser = JSON.parse(contents);
                setUser(parsedUser);
                console.log("Contenido del archivo de usuario:", contents);
            } catch (error) {
                console.log('No user logged in or failed to load user file.');
            }
        };
        loadUser();
    }, []);

    const login = async (user: User) => {
        setUser(user);
        try {
            const path = await appDataDir() + USER_FILE;
            await writeTextFile(path, JSON.stringify(user, null, 2));
            console.log("Guardando usuario en archivo:", user);
        } catch (error) {
            console.error('Error guardando usuario en archivo', error);
        }
    };

    const logout = async () => {
        setUser(null);
        console.log("Usuario removido del estado, archivo retenido.");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
