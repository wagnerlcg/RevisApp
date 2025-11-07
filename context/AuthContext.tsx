import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { AuthStatus } from '../types';
import { sendVerificationEmail } from '../services/emailService';
import { logger } from '../services/logService';

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
            logger.logInfo('Iniciando login', { email });
            logger.logApiCall('GET', 'https://dansis-ia.com/public/api/usuarios');
            
            const response = await fetch('https://dansis-ia.com/public/api/usuarios');
            logger.logApiResponse('https://dansis-ia.com/public/api/usuarios', response.status);
            
            if (response.ok) {
                interface ApiUser { name: string; email: string; cep_usuario: string | null; }
                const apiUsers: ApiUser[] = await response.json();
                logger.logInfo('Usuários recebidos da API', { count: apiUsers.length });
                
                const apiUser = apiUsers.find(u => u.email === email);

                if (apiUser) {
                    logger.logInfo('Usuário encontrado na API', { email: apiUser.email });
                    const finalUser: User = {
                        name: apiUser.name,
                        email: apiUser.email,
                        cep: apiUser.cep_usuario || localCep,
                        placa: placa,
                    };
                    completeLogin(finalUser);
                    return { success: true };
                } else {
                    logger.logInfo('Usuário não encontrado na API', { email });
                }
            } else {
                apiFailed = true;
                logger.logError('Falha na API de login', { status: response.status, statusText: response.statusText });
            }
        } catch (error) {
            apiFailed = true;
            logger.logError('Erro de rede no login', error);
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
        logger.logInfo('Iniciando registro', { email: userData.email, name: userData.name });
        
        // Verificar se o email já existe na base de dados
        try {
            logger.logApiCall('GET', 'https://dansis-ia.com/public/api/usuarios', { reason: 'Verificação de email duplicado' });
            
            const response = await fetch('https://dansis-ia.com/public/api/usuarios');
            logger.logApiResponse('https://dansis-ia.com/public/api/usuarios', response.status);
            
            if (response.ok) {
                interface ApiUser { name: string; email: string; cep_usuario: string | null; }
                const apiUsers: ApiUser[] = await response.json();
                logger.logInfo('Verificando email duplicado', { totalUsers: apiUsers.length, emailToCheck: userData.email });
                
                const existingUser = apiUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
                
                if (existingUser) {
                    logger.logInfo('Email já existe na base de dados', { email: userData.email });
                    return { success: false, error: 'Este email já está cadastrado. Por favor, faça login ou use outro email.' };
                } else {
                    logger.logInfo('Email disponível para cadastro', { email: userData.email });
                }
            } else {
                logger.logError('Falha ao verificar email duplicado', { status: response.status, statusText: response.statusText });
            }
        } catch (error) {
            logger.logError('Erro ao verificar email duplicado', error);
            // Continua com o registro mesmo se a verificação falhar
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        logger.logInfo('Código de verificação gerado', { email: userData.email, codeLength: code.length });
        
        try {
            logger.logInfo('Enviando email de verificação', { to: userData.email, name: userData.name });
            await sendVerificationEmail(userData.name, userData.email, code);
            logger.logInfo('Email de verificação enviado com sucesso', { email: userData.email });

            localStorage.setItem(`revisapp_reg_${userData.email}`, JSON.stringify(userData));
            setVerificationCode(code);
            setUser(userData);
            setAuthStatus(AuthStatus.Verifying);

            return { success: true };
        } catch (e) {
            logger.logError('Falha ao enviar email de verificação', e);
            return { success: false, error: 'Não foi possível enviar o e-mail de verificação. Verifique o endereço e tente novamente.' };
        }
    }, []);

    const verify = useCallback(async (code: string): Promise<{ success: boolean; reason?: 'api_error' | 'invalid_code' | 'email_exists' }> => {
        logger.logInfo('Iniciando verificação de código', { codeProvided: code.length });
        
        if (code !== verificationCode || !user) {
            logger.logError('Código inválido ou usuário não encontrado', { 
                codeMatch: code === verificationCode, 
                hasUser: !!user 
            });
            return { success: false, reason: 'invalid_code' };
        }

        try {
            // FIX: Sending data in the exact format the user entered it, as the API accepts hyphens.
            const apiUserData = {
                name: user.name,
                email: user.email,
                cep: user.cep,
                placa: user.placa.toUpperCase(),
            };

            logger.logApiCall('POST', 'https://dansis-ia.com/public/api/usuarios/revisapp', apiUserData);

            const response = await fetch('https://dansis-ia.com/public/api/usuarios/revisapp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(apiUserData),
            });

            const responseText = await response.text();
            logger.logApiResponse('https://dansis-ia.com/public/api/usuarios/revisapp', response.status, {
                responseText,
                ok: response.ok,
                statusText: response.statusText
            });

            if (response.ok) {
                logger.logInfo('Cadastro concluído com sucesso', { email: user.email });
                localStorage.setItem('revisapp_user', JSON.stringify(user));
                setVerificationCode(null);
                setAuthStatus(AuthStatus.Authenticated);
                return { success: true };
            } else {
                logger.logError('Falha no cadastro da API', { 
                    status: response.status, 
                    statusText: response.statusText,
                    responseText 
                });
                
                // Check if the error is due to an existing email
                if (responseText.toLowerCase().includes('email já cadastrado')) {
                    logger.logInfo('Email já cadastrado detectado na resposta');
                    return { success: false, reason: 'email_exists' };
                }

                return { success: false, reason: 'api_error' };
            }
        } catch (error) {
            logger.logError('Erro de rede durante cadastro', error);
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