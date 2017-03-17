import * as React from 'react';
import ReactTooltip = require('react-tooltip');

interface HelpTooltipProps {
    explanation: React.ReactNode;
}

export const HelpTooltip = (props: HelpTooltipProps) => {
    return (
        <div
            className="inline-block"
            data-tip={true}
            data-for="helpTooltip"
        >
            <i
                style={{fontSize: 16}}
                className="material-icons"
            >
                help
            </i>
            <ReactTooltip id="helpTooltip">{props.explanation}</ReactTooltip>
        </div>
    );
};
