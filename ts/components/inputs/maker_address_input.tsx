import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {FakeTextField} from 'ts/components/ui/fake_text_field';
import {Side} from 'ts/types';
import ReactTooltip = require('react-tooltip');

const styles = {
    textField: {
        overflow: 'hidden',
        paddingTop: 8,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

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
                <div>
                    <FakeTextField label="Maker (address)">
                        <div
                            style={styles.textField}
                            data-tip={true}
                            data-for="makerAddressTooltip"
                        >
                            {this.state.orderMakerAddress}
                        </div>
                    </FakeTextField>
                    <ReactTooltip id="makerAddressTooltip">{this.state.orderMakerAddress}</ReactTooltip>
                </div>
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
