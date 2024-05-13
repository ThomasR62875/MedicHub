import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddDoctor from '../screens/AddDoctor';

jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<AddDoctor />', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<AddDoctor />);

        expect(getByPlaceholderText('Nombre')).toBeDefined();
        expect(getByPlaceholderText('Teléfono')).toBeDefined();
        expect(getByPlaceholderText('email@address.com')).toBeDefined();
        expect(getByPlaceholderText('Dirección')).toBeDefined();

        // Verifica que el botón de agregar esté presente
        expect(getByText('Agregar')).toBeDefined();
    });

    it('calls addDoctor on button click with correct data', () => {
        const { getByPlaceholderText, getByText } = render(<AddDoctor />);

        fireEvent.changeText(getByPlaceholderText('Nombre'), 'John Doe');
        fireEvent.changeText(getByPlaceholderText('Teléfono'), '123456789');
        fireEvent.changeText(getByPlaceholderText('email@address.com'), 'john@example.com');
        fireEvent.changeText(getByPlaceholderText('Dirección'), '123 Main St');

        fireEvent.press(getByText('Agregar'));

        expect(require('../lib/supabase').supabase.rpc).toHaveBeenCalledWith(
            'add_doctor',
            {
                name_input: 'John Doe',
                specialty_input: '',
                phone_input: '123456789',
                email_input: 'john@example.com',
                addresses_input: ['123 Main St'],
            }
        );
    });

    it('displays error message if addDoctor fails', async () => {
        require('../lib/supabase').supabase.rpc.mockRejectedValueOnce(new Error('Failed to add doctor'));

        const { getByPlaceholderText, getByText } = render(<AddDoctor />);

        fireEvent.changeText(getByPlaceholderText('Nombre'), 'John Doe');
        fireEvent.changeText(getByPlaceholderText('Teléfono'), '123456789');
        fireEvent.changeText(getByPlaceholderText('email@address.com'), 'john@example.com');
        fireEvent.changeText(getByPlaceholderText('Dirección'), '123 Main St');

        fireEvent.press(getByText('Agregar'));

        expect(await findByText('Failed to add doctor')).toBeDefined();
    });
});
