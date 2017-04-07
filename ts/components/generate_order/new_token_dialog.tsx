import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';
import {TextField, Dialog} from 'material-ui';
import {constants} from 'ts/utils/constants';
import {Blockchain} from 'ts/blockchain';
import {Token, TokenBySymbol} from 'ts/types';
import {OrderAddressInput} from 'ts/components/inputs/order_address_input';
import {ErrorAlert} from 'ts/components/ui/error_alert';
import {LifeCycleRaisedButton} from 'ts/components/ui/lifecycle_raised_button';
import {RequiredLabel} from 'ts/components/ui/required_label';

interface NewTokenDialogProps {
    blockchain: Blockchain;
    isOpen: boolean;
    tokenBySymbol: TokenBySymbol;
    onCloseDialog: () => void;
    onNewTokenSubmitted: (token: Token) => void;
}

interface NewTokenDialogState {
    globalErrMsg: string;
    name: string;
    nameErrorText: string;
    symbol: string;
    symbolErrorText: string;
    address: string;
    shouldShowAddressIncompleteErr: boolean;
}

export class NewTokenDialog extends React.Component<NewTokenDialogProps, NewTokenDialogState> {
    constructor(props: NewTokenDialogProps) {
        super(props);
        this.state = {
            address: '',
            globalErrMsg: '',
            name: '',
            nameErrorText: '',
            shouldShowAddressIncompleteErr: false,
            symbol: '',
            symbolErrorText: '',
        };
    }
    public render() {
        return (
            <Dialog
                title="Add an ERC20 token"
                modal={false}
                open={this.props.isOpen}
                onRequestClose={this.props.onCloseDialog.bind(this)}
            >
                <div className="mx-auto pb2" style={{width: 256}}>
                    <div>
                        <TextField
                            floatingLabelFixed={true}
                            floatingLabelStyle={{color: colors.grey500}}
                            floatingLabelText={<RequiredLabel label="Name" />}
                            value={this.state.name}
                            errorText={this.state.nameErrorText}
                            onChange={this.onTokenNameChanged.bind(this)}
                        />
                    </div>
                    <div>
                        <TextField
                            floatingLabelFixed={true}
                            floatingLabelStyle={{color: colors.grey500}}
                            floatingLabelText={<RequiredLabel label="Symbol" />}
                            value={this.state.symbol}
                            errorText={this.state.symbolErrorText}
                            onChange={this.onTokenSymbolChanged.bind(this)}
                        />
                    </div>
                    <div className="pt2">
                        <OrderAddressInput
                            isRequired={true}
                            label="Contract address"
                            blockchain={this.props.blockchain}
                            initialOrderAddress=""
                            shouldShowIncompleteErrs={this.state.shouldShowAddressIncompleteErr}
                            updateOrderAddress={this.onTokenAddressChanged.bind(this)}
                        />
                    </div>
                    <div className="pt2 mx-auto" style={{width: 120}}>
                        <LifeCycleRaisedButton
                            labelReady="Add"
                            labelLoading="Adding..."
                            labelComplete="Added!"
                            onClickAsyncFn={this.onAddNewTokenClickAsync.bind(this)}
                        />
                        {this.state.globalErrMsg !== '' && <ErrorAlert message={this.state.globalErrMsg} />}
                    </div>
                </div>
            </Dialog>
        );
    }
    private async onAddNewTokenClickAsync() {
        // Trigger validation of name and symbol
        this.onTokenNameChanged(undefined, this.state.name);
        this.onTokenSymbolChanged(undefined, this.state.symbol);

        const isAddressIncomplete = this.state.address === '';
        let doesContractExist = false;
        if (!isAddressIncomplete) {
            doesContractExist = await this.props.blockchain.doesContractExistAtAddressAsync(this.state.address);
        }

        let hasBalanceAllowanceErr = false;
        let balance = 0;
        let allowance = 0;
        if (doesContractExist) {
            try {
                [
                    balance,
                    allowance,
                ] = await this.props.blockchain.getTokenBalanceAndAllowanceAsync(this.state.address);
            } catch (err) {
                hasBalanceAllowanceErr = true;
            }
        }

        let globalErrMsg = '';
        if (this.state.nameErrorText !== '' || this.state.symbolErrorText !== '' ||
            isAddressIncomplete) {
            globalErrMsg = 'Please fix the above issues';
        } else if (!doesContractExist) {
            globalErrMsg = 'No contract found at supplied address';
        } else if (hasBalanceAllowanceErr) {
            globalErrMsg = 'Unsuccessful call to `balanceOf` and/or `allowance` on supplied contract address';
        } else if (!isAddressIncomplete) {
            const existingTokens = _.values(this.props.tokenBySymbol);
            const existingTokenAddresses = _.map(existingTokens, (t) => t.address);
            if (_.includes(existingTokenAddresses, this.state.address)) {
                globalErrMsg = 'A token already exists with this address';
            }
        }

        if (globalErrMsg !== '') {
            this.setState({
                globalErrMsg,
                shouldShowAddressIncompleteErr: isAddressIncomplete,
            });
            return;
        }

        const newToken: Token = {
            address: this.state.address,
            allowance,
            balance,
            iconUrl: constants.DEFAULT_TOKEN_ICON_URL,
            name: this.state.name,
            symbol: this.state.symbol.toUpperCase(),
        };
        this.props.onNewTokenSubmitted(newToken);
    }
    private onTokenNameChanged(e: any, name: string) {
        let nameErrorText = '';
        if (name === '') {
            nameErrorText = 'Name is required';
        } else if (!this.isAlphaNumeric(name)) {
            nameErrorText = 'Must be alphanumeric';
        } else if (name.length > 30) {
            nameErrorText = 'Max length is 30';
        }

        this.setState({
            name,
            nameErrorText,
        });
    }
    private onTokenSymbolChanged(e: any, symbol: string) {
        let symbolErrorText = '';
        if (symbol === '') {
            symbolErrorText = 'Symbol is required';
        } else if (!this.isLetters(symbol)) {
            symbolErrorText = 'Can only include letters';
        } else if (symbol.length > 5) {
            symbolErrorText = 'Max length is 5';
        } else if (!_.isUndefined(this.props.tokenBySymbol[symbol])) {
            symbolErrorText = 'Token with symbol already exists';
        }

        this.setState({
            symbol,
            symbolErrorText,
        });
    }
    private onTokenAddressChanged(address: string) {
        this.setState({
            address,
        });
    }
    private isAlphaNumeric(input: string) {
        return /^[a-z0-9]+$/i.test(input);
    }
    private isLetters(input: string) {
        return /^[a-zA-Z]+$/i.test(input);
    }
}
