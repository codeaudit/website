import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {Identicon} from 'ts/components/ui/identicon';
import {RequiredLabel} from 'ts/components/ui/required_label';
import {OrderAddressInput} from 'ts/components/inputs/order_address_input';

interface IdenticonAddressInputProps {
    blockchain: Blockchain;
    address: string;
    isRequired?: boolean;
    label: string;
    updateOrderAddress: (address: string) => void;
}

interface IdenticonAddressInputState {}

const styles = {
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

export class IdenticonAddressInput extends React.Component<IdenticonAddressInputProps, IdenticonAddressInputState> {
    public render() {
        const label = this.props.isRequired ? <RequiredLabel label={this.props.label} /> :
                      this.props.label;
        return (
            <div className="relative">
                <label style={styles.label}>{label}</label>
                <div className="flex" style={{width: 385}}>
                    <div className="col col-1 pb1 pr1" style={{paddingTop: 27}}>
                        <Identicon address={this.props.address} diameter={25} />
                    </div>
                    <div className="col col-11 pt2 pb1 pl1" style={{height: 86}}>
                        <OrderAddressInput
                            blockchain={this.props.blockchain}
                            hintText="0x75bE4F78AA3699B3A348c84bDB2a96c3D..."
                            shouldHideLabel={true}
                            initialOrderAddress={this.props.address}
                            updateOrderAddress={this.props.updateOrderAddress}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
