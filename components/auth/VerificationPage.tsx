import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';

const VerificationPage: React.FC = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { verify, user, goToLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await verify(code);
        if (!result.success) {
            if (result.reason === 'email_exists') {
                setError('Este e-mail já está cadastrado. Por favor, faça o login.');
            } else if (result.reason === 'api_error') {
                setError('Houve um problema ao finalizar seu cadastro. Por favor, tente novamente mais tarde.');
            } else {
                setError('Código de verificação inválido. Tente novamente.');
            }
        }
        setIsLoading(false);
    };

    return (
        <AuthLayout title="Verifique seu e-mail">
            <div className="text-center mb-6">
                <p className="text-gray-600">
                    Enviamos um código de 6 dígitos para <strong>{user?.email}</strong>.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Por favor, verifique sua caixa de entrada (e a pasta de spam) e insira o código abaixo para completar seu cadastro.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-md">
                        <p>{error}</p>
                        {error.includes('já está cadastrado') && (
                            <button
                                type="button"
                                onClick={goToLogin}
                                className="mt-2 font-semibold text-brand-blue hover:underline"
                            >
                                Ir para a página de Login
                            </button>
                        )}
                    </div>
                )}
                <Input
                    id="code"
                    label="Código de verificação"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="000000"
                    maxLength={6}
                    className="text-center tracking-[0.5em]"
                />
                <Button type="submit" isLoading={isLoading} fullWidth>
                    Verificar e Acessar
                </Button>
            </form>
        </AuthLayout>
    );
};

export default VerificationPage;