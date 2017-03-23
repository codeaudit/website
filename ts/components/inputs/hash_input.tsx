import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {Blockchain} from 'ts/blockchain';
import {Ox} from 'ts/utils/Ox';
import {FakeTextField} from 'ts/components/ui/fake_text_field';
import ReactTooltip = require('react-tooltip');
import {
    HashData,
} from 'ts/types';

const styles = {
    textField: {
        overflow: 'hidden',
        paddingTop: 8,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

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
            <div>
                <FakeTextField>
                    <div
                        style={styles.textField}
                        data-tip={true}
                        data-for="hashTooltip"
                    >
                        {msgHashHex}
                    </div>
                </FakeTextField>
                <ReactTooltip id="hashTooltip">{msgHashHex}</ReactTooltip>
            </div>
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
