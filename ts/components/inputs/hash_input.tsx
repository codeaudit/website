import * as React from 'react';
import {Blockchain} from 'ts/blockchain';
import {zeroEx} from 'ts/utils/zero_ex';
import {FakeTextField} from 'ts/components/ui/fake_text_field';
import ReactTooltip = require('react-tooltip');
import {HashData, Styles} from 'ts/types';

const styles: Styles = {
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
    label: string;
}

interface HashInputState {}

export class HashInput extends React.Component<HashInputProps, HashInputState> {
    public render() {
        const msgHashHex = this.props.blockchainIsLoaded ? this.generateMessageHashHex() : '';
        return (
            <div>
                <FakeTextField label={this.props.label}>
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
        const exchangeContractAddr = this.props.blockchain.getExchangeContractAddressIfExists();
        const hashData = this.props.hashData;
        const orderHash = zeroEx.getOrderHash(exchangeContractAddr, hashData.orderMakerAddress,
                        hashData.orderTakerAddress, hashData.depositTokenContractAddr,
                        hashData.receiveTokenContractAddr, hashData.feeRecipientAddress,
                        hashData.depositAmount, hashData.receiveAmount, hashData.makerFee,
                        hashData.takerFee, hashData.orderExpiryTimestamp, hashData.orderSalt);
        return orderHash;
    }
}
