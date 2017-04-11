import * as _ from 'lodash';
import * as React from 'react';
import {constants} from 'ts/utils/constants';
import {CopyIcon} from 'ts/components/ui/copy_icon';
import jazzicon = require('jazzicon');
import ReactTooltip = require('react-tooltip');

const MIN_ADDRESS_WIDTH = 70;

const styles = {
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
                {this.renderIdenticon(address)}
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
    private renderIdenticon(address: string) {
        if (_.isUndefined(address)) {
            address = constants.NULL_ADDRESS;
        }
        const diameter = this.props.identiconDiameter;
        const numericalAddress = this.convertAddressToNumber(address);
        const jazzIcon = jazzicon(diameter, numericalAddress);
        const innerHtml: string = jazzIcon.innerHTML;
        return (
            <div
                className="circle mx-auto relative"
                style={{width: diameter, height: diameter, overflow: 'hidden'}}
            >
                <div
                    dangerouslySetInnerHTML={{__html: innerHtml}}
                />
            </div>
        );
    }
    private convertAddressToNumber(address: string): number {
        const addressWithoutPrefix = address.slice(2, 10);
        const numericanAddress = parseInt(addressWithoutPrefix, 16);
        return numericanAddress;
    }
}
