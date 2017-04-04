import * as React from 'react';

interface BackButtonProps {
    onClick(): void;
}

export function BackButton(props: BackButtonProps) {
    return (
        <div
            style={{cursor: 'pointer'}}
            onClick={props.onClick.bind(this)}
        >
            <i style={{fontSize: 24}} className="zmdi zmdi-arrow-left" />
        </div>
    );
}
