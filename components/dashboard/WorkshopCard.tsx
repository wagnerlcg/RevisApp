
import React from 'react';
import type { Workshop } from '../../types';
import Button from '../common/Button';

interface WorkshopCardProps {
    workshop: Workshop;
}

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.45 16.86L2.05 22L7.31 20.62C8.75 21.41 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 3.67C16.56 3.67 20.28 7.38 20.28 11.91C20.28 16.44 16.56 20.15 12.04 20.15C10.53 20.15 9.09 19.74 7.85 19L7.54 18.82L4.44 19.65L5.28 16.62L5.07 16.3C4.24 14.93 3.8 13.38 3.8 11.91C3.8 7.38 7.52 3.67 12.04 3.67M9.13 7.5C8.89 7.5 8.72 7.53 8.56 7.53C8.24 7.53 7.93 7.65 7.67 7.91C7.41 8.17 6.85 8.68 6.85 9.71C6.85 10.74 7.69 11.71 7.82 11.87C7.95 12.03 9.28 14.16 11.31 15C13.06 15.73 13.43 15.6 13.83 15.56C14.23 15.52 15.12 15.03 15.35 14.47C15.58 13.91 15.58 13.44 15.51 13.34C15.44 13.24 15.25 13.18 15 13.05C14.75 12.92 13.62 12.38 13.4 12.3C13.18 12.22 13.02 12.19 12.86 12.45C12.7 12.71 12.21 13.25 12.08 13.41C11.95 13.57 11.82 13.59 11.6 13.5C11.38 13.41 10.68 13.18 9.79 12.38C8.68 11.41 8.12 10.2 7.96 9.94C7.8 9.68 7.92 9.55 8.04 9.43C8.15 9.32 8.28 9.16 8.41 9C8.54 8.84 8.59 8.74 8.69 8.54C8.79 8.34 8.75 8.18 8.69 8.05C8.63 7.92 8.24 6.9 8.04 6.5C7.84 6.1 7.65 6.13 7.5 6.13" />
    </svg>
);


const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop }) => {
    const { name, address, phone } = workshop;

    const formattedPhone = phone.replace(/\D/g, '');
    const whatsAppUrl = `https://wa.me/${formattedPhone}`;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col">
            <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-brand-blue-dark mb-2">{name}</h3>
                <div className="space-y-3 text-gray-600">
                    <div className="flex items-start">
                        <LocationIcon className="w-5 h-5 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                        <span>{address}</span>
                    </div>
                    <div className="flex items-center">
                        <PhoneIcon className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                        <span>{phone}</span>
                    </div>
                </div>
            </div>
            <div className="p-6 pt-0 mt-auto">
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button fullWidth className="bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white">
                        <WhatsAppIcon className="w-5 h-5 mr-2" />
                        Entrar em Contato
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default WorkshopCard;
