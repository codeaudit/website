import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {constants} from 'ts/utils/constants';
import {utils} from 'ts/utils/utils';
import {Ox} from 'ts/utils/Ox';
import {TokenBySymbol, AssetToken, Side, SideToAssetToken, Direction} from 'ts/types';

interface HashInputProps {
    blockchain: Blockchain;
    blockchainIsLoaded: boolean;
    orderTakerAddress: string;
    orderMakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    orderExpiryTimestamp: number;
}

interface HashInputState {}

export class HashInput extends React.Component<HashInputProps, HashInputState> {
    public render() {
        const msgHashHex = this.props.blockchainIsLoaded ? this.generateMessageHashHex() : '';
        return (
            <TextField
                name="hash"
                style={{height: 60}}
                inputStyle={{marginTop: 0}}
                value={msgHashHex}
            />
        );
    }
    private generateMessageHashHex() {
        const exchangeContractAddr = this.props.blockchain.getExchangeContractAddress();
        const orderTakerAddress = this.props.orderTakerAddress !== '' ?
            this.props.orderTakerAddress : constants.NULL_ADDRESS;
        const depositTokenContractAddr = constants.NULL_ADDRESS; // TODO: get actual token contract addr
        const receiveTokenContractAddr = constants.NULL_ADDRESS; // TODO: get actual token contract addr
        const depositAmt = this.props.sideToAssetToken[Side.deposit].amount;
        const receiveAmt = this.props.sideToAssetToken[Side.receive].amount;
        const orderHash = Ox.getOrderHash(exchangeContractAddr, this.props.orderMakerAddress,
                        orderTakerAddress, depositTokenContractAddr, receiveTokenContractAddr,
                        depositAmt, receiveAmt, this.props.orderExpiryTimestamp);

        const feeRecipientAddr = constants.NULL_ADDRESS;
        const makerFee = 0;
        const takerFee = 0;
        const msgHashHex = Ox.getMessageHash(orderHash, feeRecipientAddr, makerFee, takerFee);
        return msgHashHex;
    }
}
