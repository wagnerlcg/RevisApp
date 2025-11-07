
export interface User {
    name: string;
    placa: string;
    cep: string;
    email: string;
}

export interface Workshop {
    name: string;
    address: string;
    phone: string;
}

export enum AuthStatus {
    Unauthenticated,
    Registering,
    Verifying,
    Authenticated
}