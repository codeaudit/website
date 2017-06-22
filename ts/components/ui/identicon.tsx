import * as _ from 'lodash';
import * as React from 'react';
import {constants} from 'ts/utils/constants';
import jazzicon = require('jazzicon');

interface IdenticonProps {
    address: string;
    diameter: number;
}

interface IdenticonState {}

export class Identicon extends React.Component<IdenticonProps, IdenticonState> {
    public render() {
        let address = this.props.address;
        if (_.isUndefined(address)) {
            address = constants.NULL_ADDRESS;
        }
        const diameter = this.props.diameter;
        const numericalAddress = this.convertAddressToNumber(address);
        const jazzIcon = jazzicon(diameter, numericalAddress);
        const innerHtml: string = jazzIcon.innerHTML;
        return (
            <div
                className="circle mx-auto relative transitionFix"
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
