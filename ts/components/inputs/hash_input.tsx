import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {constants} from 'ts/utils/constants';
import {utils} from 'ts/utils/utils';
import {Ox} from 'ts/utils/Ox';
import {
    TokenBySymbol,
    Side,
    Direction,
    HashData,
} from 'ts/types';

interface HashInputProps {
    blockchain: Blockchain;
    blockchainIsLoaded: boolean;
    hashData: HashData;
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
        const hashData = this.props.hashData;
        const orderHash = Ox.getOrderHash(exchangeContractAddr, hashData.orderMakerAddress,
                        hashData.orderTakerAddress, hashData.depositTokenContractAddr,
                        hashData.receiveTokenContractAddr, hashData.depositAmount,
                        hashData.receiveAmount, hashData.orderExpiryTimestamp);

        const msgHashHex = Ox.getMessageHash(orderHash, hashData.feeRecipientAddress, hashData.makerFee,
                                             hashData.takerFee);
        return msgHashHex;
    }
}
