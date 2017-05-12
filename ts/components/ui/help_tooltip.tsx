import * as React from 'react';
import ReactTooltip = require('react-tooltip');

interface HelpTooltipProps {
    explanation: React.ReactNode;
}

export const HelpTooltip = (props: HelpTooltipProps) => {
    return (
        <div
            className="inline-block"
            data-tip={props.explanation}
            data-for="helpTooltip"
            data-multiline={true}
        >
            <i style={{fontSize: 16}} className="zmdi zmdi-help" />
            <ReactTooltip id="helpTooltip" />
        </div>
    );
};
