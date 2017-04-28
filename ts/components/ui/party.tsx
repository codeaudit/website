import * as _ from 'lodash';
import * as React from 'react';
import {CopyIcon} from 'ts/components/ui/copy_icon';
import ReactTooltip = require('react-tooltip');
import {Identicon} from 'ts/components/ui/identicon';
import {Styles} from 'ts/types';

const MIN_ADDRESS_WIDTH = 70;

const styles: Styles = {
    address: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

interface PartyProps {
    label: string;
    address: string;
    identiconDiameter: number;
}

interface PartyState {}

export class Party extends React.Component<PartyProps, PartyState> {
    public render() {
        const label = this.props.label;
        const address = this.props.address;
        const tooltipId = `${label}Tooltip`;
        const identiconDiameter = this.props.identiconDiameter;
        const addressWidth = identiconDiameter > MIN_ADDRESS_WIDTH ?
                             identiconDiameter : MIN_ADDRESS_WIDTH;
        return (
            <div style={{overflow: 'hidden'}}>
                <div className="pb1">{label}</div>
                <Identicon
                    address={this.props.address}
                    diameter={identiconDiameter}
                />
                <div
                    className="mx-auto pt1"
                    style={{...styles.address, width: addressWidth}}
                >
                    {!_.isEmpty(address) &&
                        <div className="pr1 inline">
                            <CopyIcon data={address}/>
                        </div>
                    }
                    <div
                        className="inline"
                        data-tip={true}
                        data-for={tooltipId}
                    >
                        {!_.isEmpty(address) ? address : 'Anybody'}
                    </div>
                </div>
                {!_.isEmpty(address) && <ReactTooltip id={tooltipId}>{address}</ReactTooltip>}
            </div>
        );
    }
}
