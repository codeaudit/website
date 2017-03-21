import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {utils} from 'ts/utils/utils';
import {TokenBySymbol, AssetToken, Side, SideToAssetToken, Direction} from 'ts/types';

interface OrderAddressInputProps {
    disabled?: boolean;
    label: string;
    side: Side;
    blockchain: Blockchain;
    initialOrderAddress: string;
    updateOrderAddress: (side: Side, address: string) => void;
}

interface OrderAddressInputState {
    address: string;
    errMsg: string;
}

export class OrderAddressInput extends React.Component<OrderAddressInputProps, OrderAddressInputState> {
    constructor(props: OrderAddressInputProps) {
        super(props);
        this.state = {
            address: this.props.initialOrderAddress,
            errMsg: '',
        };
    }
    public render() {
        return (
            <TextField
                disabled={_.isUndefined(this.props.disabled) ? false : this.props.disabled}
                style={{height: 60}}
                floatingLabelFixed={true}
                floatingLabelStyle={{marginTop: -15, color: colors.grey500}}
                errorStyle={{marginTop: 15}}
                inputStyle={{marginTop: 0}}
                floatingLabelText={this.props.label}
                errorText={this.state.errMsg}
                value={this.state.address}
                onChange={this.onOrderTakerAddressUpdated.bind(this)}
            />
        );
    }
    private onOrderTakerAddressUpdated(e: any) {
        const address = e.target.value;
        const isValidAddress = this.props.blockchain.isValidAddress(address) ||
            address === '';
        this.setState({
            address,
            errMsg: isValidAddress ? '' : 'Invalid ethereum address',
        });
        if (isValidAddress) {
            this.props.updateOrderAddress(this.props.side, address);
        }
    }
}
