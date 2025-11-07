// This is a browser-only library, so we need to declare the global `emailjs` object
// to avoid TypeScript errors.
declare global {
    interface Window {
        emailjs: {
            send: (serviceID: string, templateID: string, templateParams: Record<string, unknown>, publicKey: string) => Promise<{ status: number; text: string; }>;
        }
    }
}

// IMPORTANT: Replace these placeholder values with your actual EmailJS credentials.
// 1. Go to https://www.emailjs.com/
// 2. Create an account and set up an email service (e.g., Gmail).
// 3. Create an email template with variables {{name}}, {{email}}, and {{code}}.
// 4. Find your Service ID, Template ID, and Public Key in your EmailJS dashboard.
const SERVICE_ID = 'service_pegew0s';
const TEMPLATE_ID = 'template_1riwxbm';
const PUBLIC_KEY = '2yVBceZecmvXtMokW';

/**
 * Sends a verification email to the user using the EmailJS service.
 * @param name The user's name.
 * @param email The user's email address.
 * @param code The verification code to be sent.
 * @returns A promise that resolves when the email is sent successfully.
 */
export const sendVerificationEmail = async (name: string, email: string, code: string): Promise<void> => {
    // Check if the placeholder values have been replaced.
    if (SERVICE_ID.startsWith('YOUR_') || TEMPLATE_ID.startsWith('YOUR_') || PUBLIC_KEY.startsWith('YOUR_')) {
        console.warn('EmailJS is not configured. Please replace placeholder values in services/emailService.ts.');
        // To ensure the app remains testable, we simulate the email by logging the code to the console.
        console.log(`EmailJS not configured. Simulating email to ${email} with code: ${code}`);
        // In a non-configured state, we resolve the promise to not block the registration flow during testing.
        return Promise.resolve();
    }
    
    try {
        // The template on EmailJS should be configured to accept these parameters.
        const templateParams = {
            name: name,
            email: email,
            code: code,
        };

        await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('Verification email sent successfully via EmailJS!');
    } catch (error) {
        console.error('Failed to send verification email via EmailJS:', error);
        // Throw a new error to be caught by the calling function in AuthContext.
        throw new Error('Failed to send verification email.');
    }
};