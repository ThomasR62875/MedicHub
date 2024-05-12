
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SimpleComponent from '../screens/simple';


test('simpleComponent', () => {
    render(<SimpleComponent/>)
})



// describe('SimpleComponent', () => {
//     it('increments count when button is pressed', () => {
//         const { getByText } = render(<SimpleComponent />);
//         const incrementButton = getByText('Increment');
//         const countText = getByText(/Count:/);
//
//         expect(countText).toHaveTextContent('Count: 0');
//
//         fireEvent(incrementButton, new Event('press'));
//
//         expect(countText).toHaveTextContent('Count: 1');
//     });
// });
