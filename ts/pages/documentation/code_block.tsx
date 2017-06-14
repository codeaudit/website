import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';

const BLUE_GRAY = '#dde4e9';

interface CodeBlockProps {
    children: React.ReactNode;
}

export function CodeBlock(props: CodeBlockProps) {
    return (
        <div
            className="p3"
            style={{backgroundColor: BLUE_GRAY, borderLeft: `5px solid ${colors.cyanA700}`}}
        >
            {props.children}
        </div>
    );
}
