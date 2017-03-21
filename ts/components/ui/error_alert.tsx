import * as React from 'react';
import {colors} from 'material-ui/styles';

interface ErrorAlertProps {
    message: string;
}

export function ErrorAlert(props: ErrorAlertProps) {
    const errMsgStyles = {
        background: colors.red200,
        color: 'white',
        marginTop: 10,
        padding: 4,
        paddingLeft: 8,
    };

    return (
        <div className="rounded" style={errMsgStyles}>
            {props.message}
        </div>
    );
}
