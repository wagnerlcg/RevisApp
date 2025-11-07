
import React from 'react';
// FIX: The `useAuth` hook is exported from `hooks/useAuth.ts`, not `context/AuthContext.tsx`.
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import VerificationPage from './components/auth/VerificationPage';
import DashboardPage from './components/dashboard/DashboardPage';
import { AuthStatus } from './types';
import { DebugLogger } from './components/common/DebugLogger';

const AppContent: React.FC = () => {
    const { authStatus } = useAuth();

    switch (authStatus) {
        case AuthStatus.Unauthenticated:
            return <LoginPage />;
        case AuthStatus.Registering:
            return <RegisterPage />;
        case AuthStatus.Verifying:
            return <VerificationPage />;
        case AuthStatus.Authenticated:
            return <DashboardPage />;
        default:
            return <LoginPage />;
    }
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-brand-gray text-brand-text">
                <AppContent />
                <DebugLogger />
            </div>
        </AuthProvider>
    );
};

export default App;