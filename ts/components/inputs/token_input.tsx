import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {Dispatcher} from 'ts/redux/dispatcher';
import {RequiredLabel} from 'ts/components/ui/required_label';
import {FakeTextField} from 'ts/components/ui/fake_text_field';
import {AssetToken, Side, TokenBySymbol, BlockchainErrs, Token} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order/asset_picker';
import {NewTokenDialog} from 'ts/components/generate_order/new_token_dialog';
import {customTokenStorage} from 'ts/local_storage/custom_token_storage';

interface TokenInputProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    dispatcher: Dispatcher;
    label: string;
    side: Side;
    assetToken: AssetToken;
    updateChosenAssetToken: (side: Side, token: AssetToken) => void;
    tokenBySymbol: TokenBySymbol;
}

interface TokenInputState {
    isNewTokenDialogOpen: boolean;
    isPickerOpen: boolean;
}

export class TokenInput extends React.Component<TokenInputProps, TokenInputState> {
    constructor(props: TokenInputProps) {
        super(props);
        this.state = {
            isNewTokenDialogOpen: false,
            isPickerOpen: false,
        };
    }
    public render() {
        const token = this.props.tokenBySymbol[this.props.assetToken.symbol];
        const label = <RequiredLabel label={this.props.label} />;
        return (
            <div>
                <FakeTextField label={label}>
                    <div
                        className="pt1"
                        style={{cursor: 'pointer'}}
                        onClick={this.onInputClick.bind(this)}
                    >
                        <div className="flex" style={{width: '100%'}}>
                            <div className="pr1">
                                <img src={token.iconUrl} style={{width: 20, height: 20}} />
                            </div>
                            <div style={{lineHeight: 1.4}}>{token.name}</div>
                        </div>
                    </div>
                </FakeTextField>
                <AssetPicker
                    isOpen={this.state.isPickerOpen}
                    currentAssetToken={this.props.assetToken}
                    onAssetChosen={this.onAssetChosen.bind(this)}
                    onCustomAssetChosen={this.onCustomAssetChosen.bind(this)}
                    side={this.props.side}
                    tokenBySymbol={this.props.tokenBySymbol}
                />
                <NewTokenDialog
                    blockchain={this.props.blockchain}
                    isOpen={this.state.isNewTokenDialogOpen}
                    onCloseDialog={this.onCloseNewTokenDialog.bind(this)}
                    onNewTokenSubmitted={this.onNewTokenSubmitted.bind(this)}
                    tokenBySymbol={this.props.tokenBySymbol}
                />
            </div>
        );
    }
    private onCloseNewTokenDialog() {
        this.setState({
            isNewTokenDialogOpen: false,
        });
    }
    private onInputClick() {
        if (this.props.blockchainErr !== '') {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return;
        }

        this.setState({
            isPickerOpen: true,
        });
    }
    private onAssetChosen(side: Side, assetToken: AssetToken) {
        this.setState({
            isPickerOpen: false,
        });
        this.props.updateChosenAssetToken(side, assetToken);
    }
    private onCustomAssetChosen() {
        this.setState({
            isNewTokenDialogOpen: true,
            isPickerOpen: false,
        });
    }
    private onNewTokenSubmitted(newToken: Token) {
        customTokenStorage.addCustomToken(newToken);
        this.props.dispatcher.addTokenToTokenBySymbol(newToken);
        this.props.updateChosenAssetToken(this.props.side, {
            amount: this.props.assetToken.amount,
            symbol: newToken.symbol,
        });
        this.setState({
            isNewTokenDialogOpen: false,
        });
    }
}
