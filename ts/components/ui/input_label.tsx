import * as React from 'react';
import {colors} from 'material-ui/styles';

export interface InputLabelProps {
    text: string | Element | React.ReactNode;
}

const styles = {
    label: {
        color: colors.grey500,
        left: 0,
        marginTop: -6,
        pointerEvents: 'none',
        position: 'absolute',
        textAlign: 'left',
        top: 32,
        transform: 'scale(0.75) translate(0px, -28px)',
        transformOrigin: 'left top 0px',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        userSelect: 'none',
        width: 240,
        zIndex: 1,
    },
};

export const InputLabel = (props: InputLabelProps) => {
    return (
        <label style={styles.label}>{props.text}</label>
    );
};
