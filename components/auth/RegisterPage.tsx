import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [placa, setPlaca] = useState('');
    const [cep, setCep] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, goToLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await register({ name, placa, cep, email });
        if (!result.success) {
            setError(result.error || 'Não foi possível iniciar o cadastro. Tente novamente.');
        }
        // The context will handle navigation to the verification page if successful
        setIsLoading(false);
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.substring(0, 8);
        }
        if (value.length > 5) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        setCep(value);
    };
    
    return (
        <AuthLayout title="Crie sua conta">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-md">{error}</p>}
                <Input
                    id="name"
                    label="Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Seu nome completo"
                />
                <Input
                    id="placa"
                    label="Placa do carro"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    required
                    placeholder="ABC-1D23"
                    maxLength={8}
                />
                <Input
                    id="cep"
                    label="CEP"
                    value={cep}
                    onChange={handleCepChange}
                    required
                    placeholder="00000-000"
                    maxLength={9}
                />
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
                    Cadastrar
                </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button onClick={goToLogin} className="font-medium text-brand-blue hover:text-brand-blue-dark">
                    Faça login
                </button>
            </p>
        </AuthLayout>
    );
};

export default RegisterPage;