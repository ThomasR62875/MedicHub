import React from 'react';
import { render } from '@testing-library/react';
import DependentUsers from '../screens/DependentUsers';

jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<DependentUsers />', () => {
    it('renders correctly and shows "No hay usuarios dependientes" message when no users available', async () => {
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({ data: [] });

        const { getByText } = render(<DependentUsers />);

        expect(getByText('No hay usuarios dependientes')).toBeTruthy();
    });

    it('renders dependent users when users are available', async () => {
        const mockUsers = [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' },
        ];
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({ data: mockUsers });

        const { getByText } = render(<DependentUsers />);

        mockUsers.forEach(user => {
            expect(getByText(user.name)).toBeTruthy();
        });
    });
});
