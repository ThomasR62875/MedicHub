import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EditAccount from '../screens/EditAccount';

// Mock de la función de Supabase
jest.mock('../lib/supabase', () => ({
    supabase: {
        rpc: jest.fn(),
    },
}));

describe('<EditAccount />', () => {
    it('renders correctly and shows profile information in input fields', async () => {
        const navigation: any = { navigate: jest.fn() };
        const route: any = { params: {} };
        // Mockear la llamada a la función get_independent_user para que devuelva datos de perfil ficticios
        require('../lib/supabase').supabase.rpc.mockResolvedValueOnce({
            data: {
                first_name: 'John',
                last_name: 'Doe',
                dni: 123456789,
                avatar_url: 'https://example.com/avatar.png',
            },
        });

        // Renderizar el componente
        const { getByLabelText } = render(<EditAccount navigation={navigation} route={route} />);

        // Verificar que los campos de entrada muestren los valores del perfil del usuario
        expect((getByLabelText('Nombre') as HTMLInputElement).value).toBe('John');
        expect((getByLabelText('Apellido') as HTMLInputElement).value).toBe('Doe');
        // Agregar más expectativas para otros campos si es necesario
    });

    it('disables save button if no changes made', async () => {
        const navigation: any = { navigate: jest.fn() };
        const route: any = { params: {} };

        // Renderizar el componente
        const { getByText } = render(<EditAccount navigation={navigation} route={route} />);

        // Verificar que el botón de guardar cambios esté deshabilitado inicialmente
        const saveButton = getByText('Guardar cambios') as HTMLButtonElement;
        expect(saveButton.disabled).toBeTruthy();
    });

    it('enables save button after changes', async () => {
        const navigation: any = { navigate: jest.fn() };
        const route: any = { params: {} };

        // Renderizar el componente
        const { getByLabelText, getByText } = render(<EditAccount navigation={navigation} route={route} />);

        // Simular cambios en los campos de entrada
        fireEvent.change(getByLabelText('Nombre'), { target: { value: 'Jane' } });
        fireEvent.change(getByLabelText('Apellido'), { target: { value: 'Smith' } });

        // Verificar que el botón de guardar cambios ahora está habilitado
        const saveButton = getByText('Guardar cambios') as HTMLButtonElement;
        expect(saveButton.disabled).toBeFalsy();
    });

    it('shows confirmation alert after saving changes', async () => {
        const navigation: any = { navigate: jest.fn() };
        const route: any = { params: {} };

        // Renderizar el componente
        const { getByText } = render(<EditAccount navigation={navigation} route={route} />);

        // Simular clic en el botón de guardar cambios
        fireEvent.click(getByText('Guardar cambios'));

        // Verificar que se muestra la alerta correspondiente
        await waitFor(() => {
            const confirmationElement = getByText('Cambios guardados correctamente');
            expect(confirmationElement).toBeTruthy();
        });

    });

    it('reflects changes after saving', async () => {
        const navigation: any = { navigate: jest.fn() };
        const route: any = { params: {} };

        // Renderizar el componente
        const { getByLabelText, getByText } = render(<EditAccount navigation={navigation} route={route} />);

        // Simular cambios en los campos de entrada
        fireEvent.change(getByLabelText('Nombre'), { target: { value: 'Jane' } });
        fireEvent.change(getByLabelText('Apellido'), { target: { value: 'Smith' } });

        // Simular clic en el botón de guardar cambios
        fireEvent.click(getByText('Guardar cambios'));

        // Verificar que al editar, aparezcan los cambios
        expect((getByLabelText('Nombre') as HTMLInputElement).value).toBe('Jane');
        expect((getByLabelText('Apellido') as HTMLInputElement).value).toBe('Smith');
        // Agregar más expectativas para otros campos si es necesario
    });
});
