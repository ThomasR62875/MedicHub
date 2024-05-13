import React from 'react';
import { render } from '@testing-library/react';
import AddAppointment from '../screens/AddAppointment';

jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

const mockSession = {
    user: {
        id: 'user_id',
        email: 'test@example.com',
    },
};

describe('<AddAppointment />', () => {
    it('renders correctly', () => {
        const { getByText } = render(<AddAppointment route={{ params: { session: mockSession } }} />);
        expect(getByText('Add Appointment')).toBeDefined();
    });

    it('calls getAllDoctorsByUser and getAllUsers on mount', () => {
        render(<AddAppointment route={{ params: { session: mockSession } }} />);

        expect(require('../lib/supabase').supabase.rpc).toHaveBeenCalledWith(
            'get_independent_user_id',
            {}
        );
        expect(require('../lib/supabase').supabase.rpc).toHaveBeenCalledWith(
            'get_all_doctors_by_user',
            { user_id: 'user_id' }
        );
        expect(require('../lib/supabase').supabase.rpc).toHaveBeenCalledWith(
            'get_all_users',
            { user_id: 'user_id' }
        );
    });

    it('displays loading indicator while fetching data', async () => {
        const { getByText } = render(<AddAppointment route={{ params: { session: mockSession } }} />);

        expect(getByText('Loading...')).toBeDefined();
    });

    it('displays error message if fetching data fails', async () => {
        require('../lib/supabase').supabase.rpc.mockRejectedValueOnce(new Error('Failed to fetch data'));

        const { getByText } = render(<AddAppointment route={{ params: { session: mockSession } }} />);

        expect(getByText('Failed to fetch data')).toBeDefined();
    });
});
