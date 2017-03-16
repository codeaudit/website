import * as React from 'react';
import {Direction} from 'ts/types';

interface BackButtonProps {
    onClick(): void;
}

export function BackButton(props: BackButtonProps) {
    return (
        <div
            style={{cursor: 'pointer'}}
            onClick={props.onClick.bind(this)}
        >
            <i className="material-icons">arrow_back</i>
        </div>
    );
}
