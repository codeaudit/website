import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {utils} from 'ts/utils/utils';
import {TokenBySymbol, AssetToken, Side, SideToAssetToken, Direction} from 'ts/types';

interface MakerAddressInputProps {
    blockchain: Blockchain;
    blockchainIsLoaded: boolean;
    initialMarketMakerAddress: string;
    updateOrderAddress: (side: Side, address: string) => void;
}

interface MakerAddressInputState {
    orderMakerAddress: string;
    orderMakerAddressErrMsg: string;
}

// TODO: listen for networkId changes and re-fetch the list of account addresses when it changes
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
        return (
            <TextField
                disabled={true}
                style={{height: 60}}
                floatingLabelFixed={true}
                floatingLabelStyle={{marginTop: -15, color: colors.grey500}}
                errorStyle={{marginTop: 15}}
                inputStyle={{marginTop: 0}}
                floatingLabelText="Maker (address)"
                value={this.state.orderMakerAddress}
            />
        );
    }
    private onSelectionChanged(e: any, index: number, value: string) {
        this.setState({
            orderMakerAddress: value,
        });
        this.props.updateOrderAddress(Side.deposit, value);
    }
    private async getMakerAddressesFireAndForgetAsync() {
        const orderMakerAddress = await this.props.blockchain.getFirstAccountIfExistsAsync();
        this.setState({
            orderMakerAddress,
        });
    }
}
