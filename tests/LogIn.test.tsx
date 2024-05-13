export { LogIn };
import React from 'react';
import { render } from '@testing-library/react';
import LogIn from '../screens/LogIn';
import userEvent from '@testing-library/user-event';

// Mock de las funciones de Supabase
jest.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: jest.fn(),
        },
    },
}));

const mockUser = {
    email: 'testuser@example.com',
    password: 'password123',
};

describe('Integration tests for LogIn', () => {
    it('should call signInWithPassword with correct credentials when login button is clicked', async () => {
        const navigation: any = { navigate: jest.fn() };
        const route: any = { params: {} };

        // Renderiza el componente de formulario de inicio de sesión
        const { getByPlaceholderText } = render(<LogIn navigation={navigation} route={route}/>);
        const emailInput = getByPlaceholderText('Correo electrónico');
        const passwordInput = getByPlaceholderText('Contraseña');

        // Simula la entrada del usuario y envía el formulario
        await userEvent.type(emailInput, mockUser.email);
        await userEvent.type(passwordInput, mockUser.password);
        // await userEvent.click(getByText('Ingresar'));

        // Verifica que la función de inicio de sesión se haya llamado correctamente con las credenciales adecuadas
        expect(require('../lib/supabase').supabase.auth.signInWithPassword)
            .toHaveBeenCalledWith({
                email: mockUser.email,
                password: mockUser.password,
            });
    });

    it('should display error message if email is not provided', () => {
        const navigation: any = { navigate: jest.fn() };
        const route: any = { params: {} };

        const { getByPlaceholderText, getByText } = render(<LogIn navigation={navigation} route={route}/>);
        const passwordInput = getByPlaceholderText('Contraseña');

        userEvent.type(passwordInput, mockUser.password);
        userEvent.click(getByText('Ingresar'));
        expect(getByText('Por favor, ingrese un correo electrónico')).toBeTruthy();
    });

    it('should display error message if password is not provided', () => {
        const navigation: any = { navigate: jest.fn() };
        const route: any = { params: {} };

        const { getByPlaceholderText, getByText } = render(<LogIn navigation={navigation} route={route}/>);
        const emailInput = getByPlaceholderText('Correo electrónico');

        userEvent.type(emailInput, mockUser.email);
        userEvent.click(getByText('Ingresar'));
        expect(getByText('Por favor, ingrese una contraseña')).toBeTruthy();
    });
});