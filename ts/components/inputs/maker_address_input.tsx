import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {RequiredLabel} from 'ts/components/ui/required_label';
import {Side} from 'ts/types';
import ReactTooltip = require('react-tooltip');

const styles = {
    underlineDisabled: {
        borderBottom: `1px solid ${colors.grey300}`,
        borderColor: colors.grey300,
    },
};

interface MakerAddressInputProps {
    blockchain: Blockchain;
    blockchainIsLoaded: boolean;
    initialMarketMakerAddress: string;
    updateOrderAddress: (side: Side, address: string) => void;
    shouldShowIncompleteErrs: boolean;
}

interface MakerAddressInputState {
    orderMakerAddress: string;
    orderMakerAddressErrMsg: string;
}

export class MakerAddressInput extends React.Component<MakerAddressInputProps, MakerAddressInputState> {
    constructor(props: MakerAddressInputProps) {
        super(props);
        this.state = {
            orderMakerAddress: this.props.initialMarketMakerAddress,
            orderMakerAddressErrMsg: '',
        };
    }
    public componentWillReceiveProps(nextProps: MakerAddressInputProps) {
        if (nextProps.blockchainIsLoaded) {
            this.getMakerAddressesFireAndForgetAsync();
        }
    }
    public render() {
        const label = <RequiredLabel label="Maker (address)" />;
        const hasMakerAddress = !_.isUndefined(this.state.orderMakerAddress);
        const errorText = this.props.shouldShowIncompleteErrs && !hasMakerAddress ?
            'Didn\'t find any accounts via web3.eth.accounts' : '';
        const value = hasMakerAddress ? this.state.orderMakerAddress : '';
        return (
            <div>
                <div
                    data-tip={true}
                    data-for="makerAddressTooltip"
                >
                    <TextField
                        disabled={true}
                        style={{height: 60}}
                        errorText={errorText}
                        floatingLabelFixed={true}
                        floatingLabelStyle={{marginTop: -15, color: colors.grey500}}
                        underlineDisabledStyle={styles.underlineDisabled}
                        errorStyle={{marginTop: 15}}
                        inputStyle={{marginTop: 0}}
                        floatingLabelText={label}
                        value={value}
                    />
                </div>
                <ReactTooltip id="makerAddressTooltip">{this.state.orderMakerAddress}</ReactTooltip>
            </div>
        );
    }
    private async getMakerAddressesFireAndForgetAsync() {
        const orderMakerAddress = await this.props.blockchain.getFirstAccountIfExistsAsync();
        this.setState({
            orderMakerAddress,
        });
    }
}
