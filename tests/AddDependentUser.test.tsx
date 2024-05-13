import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddDependentUser from './AddDependentUser';

jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<AddDependentUser />', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<AddDependentUser />);

        expect(getByPlaceholderText('Nombre')).toBeDefined();
        expect(getByPlaceholderText('Apellido')).toBeDefined();
        expect(getByPlaceholderText('DNI')).toBeDefined();
        expect(getByText('Confirmar')).toBeDefined();
    });

    it('calls addUser on confirmation', () => {
        const { getByPlaceholderText, getByText } = render(<AddDependentUser />);

        fireEvent.changeText(getByPlaceholderText('Nombre'), 'John');
        fireEvent.changeText(getByPlaceholderText('Apellido'), 'Doe');
        fireEvent.changeText(getByPlaceholderText('DNI'), '12345678');

        fireEvent.press(getByText('Confirmar'));

        expect(require('../lib/supabase').supabase.rpc).toHaveBeenCalledWith(
            'add_dependent_user',
            {
                first_name_input: 'John',
                last_name_input: 'Doe',
                dni_input: '12345678',
            }
        );
    });

    it('displays error message if addUser fails', () => {
        require('../lib/supabase').supabase.rpc.mockRejectedValueOnce(new Error('Failed to add user'));

        const { getByPlaceholderText, getByText } = render(<AddDependentUser />);

        fireEvent.changeText(getByPlaceholderText('Nombre'), 'John');
        fireEvent.changeText(getByPlaceholderText('Apellido'), 'Doe');
        fireEvent.changeText(getByPlaceholderText('DNI'), '12345678');

        fireEvent.press(getByText('Confirmar'));

        expect(getByText('Failed to add user')).toBeDefined();
    });
});
