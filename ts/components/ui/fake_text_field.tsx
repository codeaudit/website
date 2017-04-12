import * as React from 'react';
import {colors} from 'material-ui/styles';

const styles = {
    hr: {
        borderBottom: '1px solid rgb(224, 224, 224)',
        borderLeft: 'none rgb(224, 224, 224)',
        borderRight: 'none rgb(224, 224, 224)',
        borderTop: 'none rgb(224, 224, 224)',
        bottom: 6,
        boxSizing: 'content-box',
        margin: 0,
        position: 'absolute',
        width: '100%',
    },
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

interface FakeTextFieldProps {
    label?: React.ReactNode | string;
    children?: any;
}

export function FakeTextField(props: FakeTextFieldProps) {
    return (
        <div className="relative">
            {props.label !== '' && <label style={styles.label}>{props.label}</label>}
            <div className="py2">
                {props.children}
            </div>
            <hr style={styles.hr} />
        </div>
    );
}
