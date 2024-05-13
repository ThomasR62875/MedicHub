import React from 'react';
import { render } from '@testing-library/react';
import Appointments from '../screens/Appointments';

jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<Appointments />', () => {
    it('renders correctly and shows "No hay turnos" message when no appointments available', async () => {
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({ data: [] });

        const { getByText } = render(<Appointments />);

        expect(getByText('No hay turnos')).toBeTruthy();
        expect(getByText('Usa el simbolo + de la esquina superior derecha para agregar tu primer doctor')).toBeTruthy();
    });

    it('renders appointments when appointments are available', async () => {
        const mockAppointments = [
            { id: 1, date: '2024-05-12', time: '10:00 AM' },
            { id: 2, date: '2024-05-14', time: '02:00 PM' },
        ];
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({ data: mockAppointments });

        const { getByText } = render(<Appointments />);

        mockAppointments.forEach(appointment => {
            expect(getByText(appointment.date)).toBeTruthy();
            expect(getByText(appointment.time)).toBeTruthy();
        });
    });
});
