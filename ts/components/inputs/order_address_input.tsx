import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {RequiredLabel} from 'ts/components/ui/required_label';

interface OrderAddressInputProps {
    blockchain: Blockchain;
    disabled?: boolean;
    initialOrderAddress: string;
    isRequired?: boolean;
    hintText?: string;
    shouldHideLabel?: boolean;
    label?: string;
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
        if (nextProps.shouldShowIncompleteErrs && this.props.isRequired &&
            this.state.address === '') {
                this.setState({
                    errMsg: 'Address is required',
                });
        }
    }
    public render() {
        const label = this.props.isRequired ? <RequiredLabel label={this.props.label} /> :
                      this.props.label;
        const labelDisplay = this.props.shouldHideLabel ? 'hidden' : 'block';
        const hintText = this.props.hintText ? this.props.hintText : '';
        return (
            <TextField
                id={`address-field-${this.props.label}`}
                disabled={_.isUndefined(this.props.disabled) ? false : this.props.disabled}
                fullWidth={true}
                hintText={hintText}
                floatingLabelFixed={true}
                floatingLabelStyle={{color: colors.grey500, display: labelDisplay}}
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
        const errMsg = isValidAddress ? '' : 'Invalid ethereum address';
        this.setState({
            address,
            errMsg,
        });
        if (isValidAddress) {
            this.props.updateOrderAddress(address);
        }
    }
}
