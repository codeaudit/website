import * as React from 'react';
import {Blockchain} from 'ts/blockchain';
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

interface HashInputState {
    orderHash: string;
}

export class HashInput extends React.Component<HashInputProps, HashInputState> {
    constructor(props: HashInputProps) {
        super(props);
        this.state = {
            orderHash: '',
        };
    }
    public componentWillReceiveProps(nextProps: HashInputProps) {
        this.onNewPropsReceivedFireAndForgetAsync(nextProps);
    }
    public render() {
        return (
            <div>
                <FakeTextField label={this.props.label}>
                    <div
                        style={styles.textField}
                        data-tip={true}
                        data-for="hashTooltip"
                    >
                        {this.state.orderHash}
                    </div>
                </FakeTextField>
                <ReactTooltip id="hashTooltip">{this.state.orderHash}</ReactTooltip>
            </div>
        );
    }
    private async onNewPropsReceivedFireAndForgetAsync(nextProps: HashInputProps): Promise<void> {
        if (nextProps.blockchainIsLoaded) {
            const orderHash = await this.generateMessageHashHexAsync();
            this.setState({
                orderHash,
            });
        }
    }
    private async generateMessageHashHexAsync(): Promise<string> {
        const hashData = this.props.hashData;
        const orderHash = await this.props.blockchain.zeroEx.getOrderHashHexAsync({
            maker: hashData.orderMakerAddress,
            taker: hashData.orderTakerAddress,
            makerFee: hashData.makerFee,
            takerFee: hashData.takerFee,
            makerTokenAmount: hashData.depositAmount,
            takerTokenAmount: hashData.receiveAmount,
            makerTokenAddress: hashData.depositTokenContractAddr,
            takerTokenAddress: hashData.receiveTokenContractAddr,
            salt: hashData.orderSalt,
            feeRecipient: hashData.feeRecipientAddress,
            expirationUnixTimestampSec: hashData.orderExpiryTimestamp,
        });
        return orderHash;
    }
}
