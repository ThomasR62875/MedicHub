import React from 'react';
import {getByText, render} from '@testing-library/react';
import Account from '../screens/Account';
import {useNavigation} from "@react-navigation/native";
import {Session} from '@supabase/supabase-js';


const navigation = useNavigation();
const mockSession = {
    user: {
        id: 'user_id',
        email: 'test@example.com',
        // @ts-ignore
        app_metadata: undefined,
        // @ts-ignore
        user_metadata: undefined,
        aud: '',
        created_at: ''
    },
    access_token: 'your_access_token_here',
    refresh_token: 'your_refresh_token_here',
    expires_in: 3600, // Example value
    token_type: 'Bearer',
};



test('renders correctly', () =>{
    render(<Account/>);
})




describe('Account', () => {
    it('renders correctly and calls getProfile on mount', () => {
        const supabaseMock = {
            rpc: jest.fn().mockResolvedValue({ data: { first_name: 'John', last_name: 'Doe', dni: 12345, avatar_url: '' } }),
        };

        jest.mock('../lib/supabase', () => ({
            supabase: supabaseMock,
        }));

        const { getByText } = render(<Account route={{ params: { session: mockSession } }} />);

        expect(supabaseMock.rpc).toHaveBeenCalledWith('get_independent_user', { auth_id_input: mockSession.user.id });
        expect(getByText('Mail:')).toBeTruthy();
        expect(getByText('DNI:')).toBeTruthy();
    });
});