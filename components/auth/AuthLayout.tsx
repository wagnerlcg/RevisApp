
import React from 'react';
import CarIcon from '../icons/CarIcon';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center mb-6">
                    <CarIcon className="w-12 h-12 text-brand-blue" />
                    <h1 className="ml-3 text-4xl font-bold text-brand-blue-dark">RevisApp</h1>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full">
                    <h2 className="text-2xl font-bold text-center text-brand-text mb-6">{title}</h2>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
