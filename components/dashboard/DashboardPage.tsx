import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { Workshop } from '../../types';
import { findWorkshops } from '../../services/geminiService';
import WelcomeModal from './WelcomeModal';
import WorkshopCard from './WorkshopCard';
import Spinner from '../common/Spinner';
import CarIcon from '../icons/CarIcon';
import Input from '../common/Input';
import Button from '../common/Button';

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    
    const [searchCep, setSearchCep] = useState('');
    const [currentSearchedCep, setCurrentSearchedCep] = useState('');
    const [showSearchCard, setShowSearchCard] = useState(false);

    useEffect(() => {
        if (user?.cep) {
            setCurrentSearchedCep(user.cep);
            setSearchCep(user.cep);
        }
    }, [user?.cep]);
    
    useEffect(() => {
        const firstVisit = !localStorage.getItem('revisapp_first_visit');
        if (firstVisit) {
            setShowWelcome(true);
            localStorage.setItem('revisapp_first_visit', 'false');
        }

        const fetchWorkshops = async () => {
            // Só busca se tiver um CEP válido (5 ou mais dígitos)
            const cleanCep = currentSearchedCep.replace(/\D/g, '');
            if (cleanCep.length >= 5) {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await findWorkshops(currentSearchedCep);
                    setWorkshops(data);
                } catch (e) {
                    setError('Não foi possível carregar as oficinas. Tente novamente mais tarde.');
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
                setWorkshops([]);
                // Mostra automaticamente o card de busca se não houver CEP
                if (!currentSearchedCep) {
                    setShowSearchCard(true);
                }
            }
        };

        fetchWorkshops();
    }, [currentSearchedCep]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentSearchedCep(searchCep);
    };

    const handleSearchCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.substring(0, 8);
        }
        if (value.length > 5) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        setSearchCep(value);
    };

    return (
        <div className="min-h-screen bg-brand-gray">
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
            
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <CarIcon className="w-8 h-8 text-brand-blue" />
                        <h1 className="ml-2 text-2xl font-bold text-brand-blue-dark">RevisApp</h1>
                    </div>
                    <div className="flex items-center">
                        <div className="text-right mr-4 hidden sm:block">
                            <p className="text-sm text-gray-600">Placa: <strong>{user?.placa}</strong></p>
                            <p className="text-sm text-gray-600">CEP: <strong>{user?.cep}</strong></p>
                        </div>
                        <button
                            onClick={() => setShowSearchCard(true)}
                            className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors mr-4"
                        >
                            Busca
                        </button>
                        <button 
                            onClick={logout}
                            className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {showSearchCard && (
                    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-brand-text mb-4">Buscar oficinas por CEP</h2>
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4">
                            <Input
                                id="cep-search"
                                label="Digite o CEP desejado"
                                value={searchCep}
                                onChange={handleSearchCepChange}
                                placeholder="00000-000"
                                maxLength={9}
                                className="flex-grow"
                            />
                            <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
                                Buscar
                            </Button>
                        </form>
                    </div>
                )}

                <h2 className="text-3xl font-bold text-brand-text mb-6">
                    {currentSearchedCep 
                        ? `Oficinas encontradas para o CEP: ${currentSearchedCep}` 
                        : 'Use a busca para encontrar oficinas'}
                </h2>
                
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Spinner size="lg" />
                    </div>
                )}
                
                {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
                
                {!isLoading && !error && (
                    workshops.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workshops.map((shop, index) => (
                                <WorkshopCard key={index} workshop={shop} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-semibold text-brand-text">Nenhuma oficina encontrada</h3>
                            <p className="mt-2 text-gray-600">
                                {currentSearchedCep
                                    ? `Não encontramos oficinas para a região do CEP ${currentSearchedCep}. Tente buscar em outra localidade.`
                                    : 'Por favor, utilize a busca para encontrar oficinas.'
                                }
                            </p>
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default DashboardPage;