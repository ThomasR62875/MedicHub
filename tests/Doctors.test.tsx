import React from 'react';
import { render } from '@testing-library/react';
import Doctors from '../screens/Doctors';

jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<Doctors />', () => {
    it('renders correctly and shows "No has cargado doctores aún." message when no doctors available', async () => {
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({ data: [] });

        const { getByText } = render(<Doctors />);

        expect(getByText('No has cargado doctores aún.')).toBeTruthy();
    });

    it('renders doctors when doctors are available', async () => {
        const mockDoctors = [
            { id: 1, name: 'Dr. John Doe' },
            { id: 2, name: 'Dr. Jane Smith' },
        ];
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({ data: mockDoctors });

        const { getByText } = render(<Doctors />);

        mockDoctors.forEach(doctor => {
            expect(getByText(doctor.name)).toBeTruthy();
        });
    });
});
