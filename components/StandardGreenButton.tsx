import React from 'react';
import { Button, ButtonProps } from 'react-native-elements';

interface StandardGreenButtonProps extends ButtonProps {
    title: string;
}

const StandardGreenButton: React.FC<StandardGreenButtonProps> = ({ title, onPress, disabled }) => {
    return (
        <Button
            title={title}
            disabled={disabled}
            onPress={onPress}
            buttonStyle={{ width: '40%', alignSelf: 'center', borderRadius: 10, backgroundColor: '#3EB77F' }}
        />
    );
}

export default StandardGreenButton;
