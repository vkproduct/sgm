import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Проверка сохраненной сессии
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const register = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            // Получаем существующих пользователей
            const usersData = localStorage.getItem('users');
            const users = usersData ? JSON.parse(usersData) : [];

            // Проверка на существующий email
            if (users.find((u: any) => u.email === email)) {
                alert('Пользователь с таким email уже существует');
                return false;
            }

            // Создаем нового пользователя
            const newUser = {
                id: Date.now().toString(),
                email,
                password, // В реальном приложении нужно хэшировать!
                name,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Автоматический вход после регистрации
            const userSession = { id: newUser.id, email: newUser.email, name: newUser.name, createdAt: newUser.createdAt };
            setUser(userSession);
            sessionStorage.setItem('currentUser', JSON.stringify(userSession));

            return true;
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            return false;
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const usersData = localStorage.getItem('users');
            const users = usersData ? JSON.parse(usersData) : [];

            const foundUser = users.find((u: any) => u.email === email && u.password === password);

            if (foundUser) {
                const userSession = {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: foundUser.name,
                    createdAt: foundUser.createdAt
                };
                setUser(userSession);
                sessionStorage.setItem('currentUser', JSON.stringify(userSession));
                return true;
            } else {
                alert('Неверный email или пароль');
                return false;
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
