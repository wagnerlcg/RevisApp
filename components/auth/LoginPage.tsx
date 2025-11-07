import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, goToRegister } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await login(email);
        if (!result.success) {
            if (result.reason === 'network') {
                setError('Falha de comunicação. Verifique sua conexão e tente novamente.');
            } else {
                setError('E-mail não encontrado. Por favor, verifique ou cadastre-se.');
            }
        }
        setIsLoading(false);
    };

    return (
        <AuthLayout title="Acessar sua conta">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-md">{error}</p>}
                <Input
                    id="email"
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seuemail@exemplo.com"
                />
                <Button type="submit" isLoading={isLoading} fullWidth>
                    Entrar
                </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <button onClick={goToRegister} className="font-medium text-brand-blue hover:text-brand-blue-dark">
                    Cadastre-se
                </button>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;