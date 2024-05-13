import React from 'react';
import { render } from '@testing-library/react';
import Home from '../screens/Home';

// Mock de la función de Supabase
jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<Home />', () => {
    it('renders correctly and shows user name', async () => {
        // Mockear la llamada a la función get_independent_user para que devuelva datos de perfil ficticios
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({
            data: {
                first_name: 'John',
            },
        });

        // Renderizar el componente
        const { getByText } = render(<Home />);

        // Verificar que el nombre de usuario se muestre correctamente
        expect(getByText('Bienvenido John')).toBeTruthy();
    });
    it('shows upcoming appointments or no appointments if none pending', async () => {
        // Mockear la llamada a la función de obtención de próximos turnos para que devuelva datos ficticios
        // Supongamos que devuelve una lista vacía para indicar que no hay turnos pendientes
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({
            data: [],
        });

        // Renderizar el componente
        const { getByText } = render(<Home />);

        // Verificar que se muestra el mensaje de que no hay pendientes
        expect(getByText('No tiene pendientes.')).toBeTruthy();
    });
});