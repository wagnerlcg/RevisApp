import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { AuthStatus } from '../types';
import { sendVerificationEmail } from '../services/emailService';

interface AuthContextType {
    authStatus: AuthStatus;
    user: User | null;
    verificationCode: string | null;
    login: (email: string) => Promise<{ success: boolean; reason?: 'network' | 'not_found' }>;
    register: (userData: User) => Promise<{ success: boolean; error?: string }>;
    verify: (code: string) => Promise<{ success: boolean; reason?: 'api_error' | 'invalid_code' | 'email_exists' }>;
    logout: () => void;
    goToRegister: () => void;
    goToLogin: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Unauthenticated);
    const [user, setUser] = useState<User | null>(null);
    const [verificationCode, setVerificationCode] = useState<string | null>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('revisapp_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setAuthStatus(AuthStatus.Authenticated);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('revisapp_user');
        }
    }, []);

    const goToRegister = () => setAuthStatus(AuthStatus.Registering);
    const goToLogin = () => setAuthStatus(AuthStatus.Unauthenticated);

    const login = useCallback(async (email: string): Promise<{ success: boolean; reason?: 'network' | 'not_found' }> => {
        const completeLogin = (userToLogin: User) => {
            setUser(userToLogin);
            localStorage.setItem('revisapp_user', JSON.stringify(userToLogin));
            localStorage.removeItem('revisapp_last_user');
            setAuthStatus(AuthStatus.Authenticated);
        };

        let placa = '';
        let localCep = '';
        const regUserRaw = localStorage.getItem(`revisapp_reg_${email}`);

        if (regUserRaw) {
            try {
                const regUser: Partial<User> = JSON.parse(regUserRaw);
                placa = regUser.placa || '';
                localCep = regUser.cep || '';
            } catch (e) { console.error("Failed to parse registration data", e); }
        }

        if (!placa) {
            const lastUserRaw = localStorage.getItem('revisapp_last_user');
            if (lastUserRaw) {
                try {
                    const lastUser: Partial<User> = JSON.parse(lastUserRaw);
                    if (lastUser.email === email) {
                        placa = lastUser.placa || '';
                    }
                } catch (e) { console.error("Failed to parse last user data", e); }
            }
        }

        let apiFailed = false;
        try {
            const response = await fetch('https://dansis-ia.com/public/api/usuarios');
            if (response.ok) {
                interface ApiUser { name: string; email: string; cep_usuario: string | null; }
                const apiUsers: ApiUser[] = await response.json();
                const apiUser = apiUsers.find(u => u.email === email);

                if (apiUser) {
                    const finalUser: User = {
                        name: apiUser.name,
                        email: apiUser.email,
                        cep: apiUser.cep_usuario || localCep,
                        placa: placa,
                    };
                    completeLogin(finalUser);
                    return { success: true };
                }
            } else {
                apiFailed = true;
            }
        } catch (error) {
            apiFailed = true;
        }

        if (regUserRaw) {
            try {
                const parsedUser: User = JSON.parse(regUserRaw);
                parsedUser.placa = placa;
                completeLogin(parsedUser);
                return { success: true };
            } catch (e) {
                // Fall through to failure
            }
        }

        return { success: false, reason: apiFailed ? 'network' : 'not_found' };
    }, []);

    const register = useCallback(async (userData: User): Promise<{ success: boolean; error?: string }> => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        try {
            await sendVerificationEmail(userData.name, userData.email, code);

            localStorage.setItem(`revisapp_reg_${userData.email}`, JSON.stringify(userData));
            setVerificationCode(code);
            setUser(userData);
            setAuthStatus(AuthStatus.Verifying);

            return { success: true };
        } catch (e) {
            console.error("Registration failed", e);
            return { success: false, error: 'Não foi possível enviar o e-mail de verificação. Verifique o endereço e tente novamente.' };
        }
    }, []);

    const verify = useCallback(async (code: string): Promise<{ success: boolean; reason?: 'api_error' | 'invalid_code' | 'email_exists' }> => {
        if (code !== verificationCode || !user) {
            return { success: false, reason: 'invalid_code' };
        }

        try {
            // FIX: Sending data in the exact format the user entered it, as the API accepts hyphens.
            const apiUserData = {
                nome: user.name,
                email: user.email,
                cep: user.cep,
                placa: user.placa.toUpperCase(),
            };

            const response = await fetch('https://pink-chough-163744.hostingersite.com/api/usuarios/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(apiUserData),
            });

            if (response.ok) {
                localStorage.setItem('revisapp_user', JSON.stringify(user));
                setVerificationCode(null);
                setAuthStatus(AuthStatus.Authenticated);
                return { success: true };
            } else {
                const responseText = await response.text();
                console.error('API registration failed:', response.status, responseText);
                
                // Check if the error is due to an existing email
                if (responseText.toLowerCase().includes('email já cadastrado')) {
                    return { success: false, reason: 'email_exists' };
                }

                return { success: false, reason: 'api_error' };
            }
        } catch (error) {
            console.error('Network error during registration:', error);
            return { success: false, reason: 'api_error' };
        }
    }, [verificationCode, user]);

    const logout = useCallback(() => {
        const currentUser = localStorage.getItem('revisapp_user');
        if (currentUser) {
            localStorage.setItem('revisapp_last_user', currentUser);
        }
        localStorage.removeItem('revisapp_user');
        localStorage.removeItem('revisapp_first_visit');
        setUser(null);
        setAuthStatus(AuthStatus.Unauthenticated);
    }, []);

    const value = {
        authStatus,
        user,
        verificationCode,
        login,
        register,
        verify,
        logout,
        goToRegister,
        goToLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};