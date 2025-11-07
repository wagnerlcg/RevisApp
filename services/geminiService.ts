
import type { Workshop } from '../types';

// Define the structure of a workshop object as returned by the API
interface ApiWorkshop {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cep: string;
    status: number;
    empresa_id: number;
}

// Define the structure of the full API response
interface ApiResponse {
    status: string;
    oficinas: ApiWorkshop[];
}

/**
 * Finds accredited workshops by fetching data from the real API based on the user's CEP.
 * @param cep The user's postal code (CEP).
 * @returns A promise that resolves to an array of workshops in the user's region.
 */
export const findWorkshops = async (cep: string): Promise<Workshop[]> => {
    // Sanitize the CEP to get only digits and use the first 5 digits as the prefix for the search.
    const cepPrefix = cep.replace(/\D/g, '').substring(0, 5);
    
    // If there's no valid CEP prefix, return an empty array to avoid an API error.
    if (!cepPrefix) {
        return [];
    }

    const apiUrl = `https://pink-chough-163744.hostingersite.com/api/oficinas/cep/${cepPrefix}`;

    console.log(`Fetching workshops from API: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            // Log the error and throw an exception to be handled by the calling component.
            console.error(`API Error: ${response.status} ${response.statusText}`);
            throw new Error('Falha ao buscar oficinas na API.');
        }

        const data: ApiResponse = await response.json();

        // Check if the response is successful and contains the 'oficinas' array.
        if (data && data.status === 'success' && Array.isArray(data.oficinas)) {
            // Map the API response fields to our local Workshop interface.
            const workshops: Workshop[] = data.oficinas.map(apiShop => ({
                name: apiShop.nome,
                address: apiShop.endereco,
                phone: apiShop.telefone,
            }));
            
            console.log(`Found ${workshops.length} workshops from API.`);
            return workshops;
        } else {
            // Handle cases where the API returns a success status but no workshops,
            // or the data structure is unexpected.
            console.log('No workshops found for this CEP or API response format is incorrect.');
            return [];
        }
    } catch (error) {
        console.error('An error occurred while fetching workshops:', error);
        // Re-throw the error so the UI layer can display a user-friendly message.
        throw error;
    }
};
