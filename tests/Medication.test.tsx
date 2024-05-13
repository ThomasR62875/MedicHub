import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Medication, { Medication as MedicationType } from '../screen/Medication';
import { supabase } from '../lib/supabase';

jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<Medication />', () => {
    it('renders "No hay medicamentos" message when no medications available', async () => {
        (supabase.rpc as jest.Mock).mockResolvedValueOnce({ data: [] });

        const { getByText } = render(<Medication navigation={{} as any} route={{ params: { session: {} } }} />);

        await waitFor(() => {
            expect(getByText('No hay medicamentos')).toBeTruthy();
            expect(getByText('Usa el simbolo + de la esquina superior derecha para agregar tu primer doctor')).toBeTruthy();
        });
    });

    it('renders medications when medications are available', async () => {
        const mockMedications: MedicationType[] = [
            { name: 'Ibuprofeno', prescription: 'Tomar cada 8 horas' },
            { name: 'Paracetamol', prescription: 'Tomar con alimentos' },
        ];
        (supabase.rpc as jest.Mock).mockResolvedValueOnce({ data: mockMedications });

        const { getByText } = render(<Medication navigation={{} as any} route={{ params: { session: {} } }} />);

        await waitFor(() => {
            mockMedications.forEach(medication => {
                expect(getByText(medication.name)).toBeTruthy();
                expect(getByText(medication.prescription)).toBeTruthy();
            });
        });
    });
});
