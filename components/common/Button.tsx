
import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    isLoading = false,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseClasses = 'font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center';
    
    const variantClasses = {
        primary: 'bg-brand-blue text-white hover:bg-brand-blue-dark focus:ring-brand-blue-dark disabled:bg-gray-400',
        secondary: 'bg-white text-brand-blue border border-brand-blue hover:bg-gray-100 focus:ring-brand-blue disabled:bg-gray-200 disabled:text-gray-500',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? <Spinner /> : children}
        </button>
    );
};

export default Button;
