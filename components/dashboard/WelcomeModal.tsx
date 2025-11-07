
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

interface WelcomeModalProps {
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
    const { user } = useAuth();
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center transform transition-all animate-fade-in-up">
                <h2 className="text-3xl font-bold text-brand-blue-dark mb-4">Bem-vindo(a) ao RevisApp!</h2>
                <p className="text-lg text-gray-700 mb-6">
                    Olá! Estamos felizes em ter você por aqui. Encontre as melhores oficinas credenciadas para o seu veículo com placa <strong>{user?.placa}</strong>.
                </p>
                <Button onClick={onClose} fullWidth>
                    Começar a usar
                </Button>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WelcomeModal;