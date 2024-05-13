import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddMedication from '../screens/AddMedication';

jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<AddMedication />', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<AddMedication />);

        expect(getByPlaceholderText('Nombre')).toBeDefined();
        expect(getByPlaceholderText('Prescripción')).toBeDefined();

        expect(getByText('Agregar')).toBeDefined();
    });

    it('calls AddMedication on button click with correct data', () => {
        const { getByPlaceholderText, getByText } = render(<AddMedication />);

        fireEvent.changeText(getByPlaceholderText('Nombre'), 'Ibuprofeno');
        fireEvent.changeText(getByPlaceholderText('Prescripción'), 'Tomar cada 8 horas');

        fireEvent.press(getByText('Agregar'));

        expect(require('../lib/supabase').supabase.rpc).toHaveBeenCalledWith(
            'add_medication',
            {
                name_input: 'Ibuprofeno',
                prescription_input: 'Tomar cada 8 horas',
            }
        );
    });

    it('displays error message if AddMedication fails', async () => {
        require('../lib/supabase').supabase.rpc.mockRejectedValueOnce(new Error('Failed to add medication'));

        const { getByPlaceholderText, getByText } = render(<AddMedication />);

        fireEvent.changeText(getByPlaceholderText('Nombre'), 'Ibuprofeno');
        fireEvent.changeText(getByPlaceholderText('Prescripción'), 'Tomar cada 8 horas');

        fireEvent.press(getByText('Agregar'));

        expect(await findByText('Failed to add medication')).toBeDefined();
    });
});
