import * as _ from 'lodash';
import * as React from 'react';
import {Token} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
import {EnableWalletDialog} from 'ts/components/enable_wallet_dialog';
import {
    RaisedButton,
} from 'material-ui';

const PRECISION = 5;

interface MintButtonProps {
    blockchain: Blockchain;
    token: Token;
    toggleEnableWalletDialog: (isOpen: boolean) => void;
}

interface MintButtonState {
    isMinting: boolean;
}

export class MintButton extends React.Component<MintButtonProps, MintButtonState> {
    constructor(props: MintButtonProps) {
        super(props);
        this.state = {
            isMinting: false,
        };
    }
    public render() {
        if (!this.state.isMinting) {
            return (
                <RaisedButton
                    label="Mint"
                    style={{margin: 12, width: '100%'}}
                    onClick={this.onMintTestTokens.bind(this, this.props.token)}
                />
            );
        } else {
            return <div>Minting...</div>;
        }
    }
    private async onMintTestTokens(token: Token) {
        this.setState({
            isMinting: true,
        });
        try {
            await this.props.blockchain.mintTestTokensAsync(token);
        } catch (err) {
            const errMsg = '' + err;
            if (_.includes(errMsg, 'User has no associated addresses')) {
                const isOpen = true;
                this.props.toggleEnableWalletDialog(isOpen);
            }
            /* tslint:disable */
            console.log('Unexpected error encountered: ', err);
            /* tslint:enable */
        }
        this.setState({
            isMinting: false,
        });
    }
}
