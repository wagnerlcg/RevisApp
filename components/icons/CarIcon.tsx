
import React from 'react';

const CarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M14 16.5V18a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.5" />
        <path d="M20 15.5V18a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2.5" />
        <path d="M4 9L2.5 12H2" />
        <path d="M22 9l-1.5 3H21" />
        <path d="M4 9h16" />
        <path d="M4 9l1-5h14l1 5" />
        <path d="M7 14h.01" />
        <path d="M17 14h.01" />
    </svg>
);

export default CarIcon;
