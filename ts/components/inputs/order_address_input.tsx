import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {Side} from 'ts/types';
import {RequiredLabel} from 'ts/components/ui/required_label';

interface OrderAddressInputProps {
    blockchain: Blockchain;
    disabled?: boolean;
    initialOrderAddress: string;
    isRequired?: boolean;
    label: string;
    shouldShowIncompleteErrs?: boolean;
    updateOrderAddress: (address: string) => void;
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
    public componentWillReceiveProps(nextProps: OrderAddressInputProps) {
        const errMsg = nextProps.shouldShowIncompleteErrs && this.props.isRequired &&
                       this.state.address === '' ?
                          'Address is required' : this.state.errMsg;
        this.setState({
            errMsg,
        });
    }
    public render() {
        const label = this.props.isRequired ? <RequiredLabel label={this.props.label} /> :
                      this.props.label;
        return (
            <TextField
                disabled={_.isUndefined(this.props.disabled) ? false : this.props.disabled}
                fullWidth={true}
                style={{height: 60}}
                floatingLabelFixed={true}
                floatingLabelStyle={{marginTop: -15, color: colors.grey500}}
                errorStyle={{marginTop: 15}}
                inputStyle={{marginTop: 0}}
                floatingLabelText={label}
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
            this.props.updateOrderAddress(address);
        }
    }
}
