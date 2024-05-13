import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import Register from '../screens/Register';

describe('<Register />', () => {
    let component: RenderResult;

    beforeEach(() => {
        component = render(<Register />);
    });

    it('renders correctly and shows input fields', async () => {
        const { getByPlaceholderText } = component;

        // Verificar que los campos de entrada estén presentes
        expect(getByPlaceholderText('Nombre')).toBeTruthy();
        expect(getByPlaceholderText('Apellido')).toBeTruthy();
        expect(getByPlaceholderText('DNI')).toBeTruthy();
        expect(getByPlaceholderText('email@address.com')).toBeTruthy();
        expect(getByPlaceholderText('Contraseña')).toBeTruthy();
        expect(getByPlaceholderText('Confirmar contraseña')).toBeTruthy();
    });

    it('initializes with empty input fields', () => {
        const { getByPlaceholderText } = component;

        // Verificar que los campos de entrada estén vacíos inicialmente
        expect(getByPlaceholderText('Nombre').getAttribute('value')).toBe('');
        expect(getByPlaceholderText('Apellido').getAttribute('value')).toBe('');
        expect(getByPlaceholderText('DNI').getAttribute('value')).toBe('');
        expect(getByPlaceholderText('email@address.com').getAttribute('value')).toBe('');
        expect(getByPlaceholderText('Contraseña').getAttribute('value')).toBe('');
        expect(getByPlaceholderText('Confirmar contraseña').getAttribute('value')).toBe('');
    });

    it('validates email field correctly', () => {
        const { getByPlaceholderText, getByText } = component;
        const emailInput = getByPlaceholderText('email@address.com') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'invalid_email' } });
        fireEvent.blur(emailInput);

        // Verificar que se muestre un mensaje de error para un email inválido
        expect(getByText('Ingrese un correo electrónico válido')).toBeTruthy();
    });

    it('validates password fields correctly', () => {
        const { getByPlaceholderText, getByText } = component;
        const passwordInput = getByPlaceholderText('Contraseña') as HTMLInputElement;
        const confirmPasswordInput = getByPlaceholderText('Confirmar contraseña') as HTMLInputElement;

        // Introducir una contraseña inválida
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'different_password' } });
        fireEvent.blur(confirmPasswordInput);

        // Verificar que se muestre un mensaje de error para contraseñas que no coinciden
        expect(getByText('Las contraseñas no coinciden')).toBeTruthy();
    });
});
