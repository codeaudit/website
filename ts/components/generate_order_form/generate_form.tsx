import * as _ from 'lodash';
import * as React from 'react';
import {Blockchain} from 'ts/blockchain';
import {colors} from 'material-ui/styles';
import {Dispatcher} from 'ts/redux/dispatcher';
import {Ox} from 'ts/utils/Ox';
import {utils} from 'ts/utils/utils';
import {ErrorAlert} from 'ts/components/ui/error_alert';
import {OrderJSON} from 'ts/components/order_json';
import {OrderAddressInput} from 'ts/components/inputs/order_address_input';
import {MakerAddressInput} from 'ts/components/inputs/maker_address_input';
import {TokenInput} from 'ts/components/inputs/token_input';
import {AmountInput} from 'ts/components/inputs/amount_input';
import {HashInput} from 'ts/components/inputs/hash_input';
import {ExpirationInput} from 'ts/components/inputs/expiration_input';
import {LifeCycleRaisedButton} from 'ts/components/ui/lifecycle_raised_button';
import {
    Side,
    SideToAssetToken,
    SignatureData,
    HashData,
    TabValue,
    TokenBySymbol,
} from 'ts/types';

enum SigningState {
    UNSIGNED,
    SIGNING,
    SIGNED,
}

interface GenerateFormProps {
    blockchain: Blockchain;
    blockchainIsLoaded: boolean;
    dispatcher: Dispatcher;
    hashData: HashData;
    orderExpiryTimestamp: number;
    orderMakerAddress: string;
    orderSignatureData: SignatureData;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    tokenBySymbol: TokenBySymbol;
    triggerTabChange: (tabValue: TabValue) => void;
}

interface GenerateFormState {
    globalErrMsg: string;
    shouldShowIncompleteErrs: boolean;
    signingState: SigningState;
    signingErrMsg: string;
}

export class GenerateForm extends React.Component<GenerateFormProps, any> {
    constructor(props: GenerateFormProps) {
        super(props);
        this.state = {
            globalErrMsg: '',
            shouldShowIncompleteErrs: false,
            signingErrMsg: '',
            signingState: SigningState.UNSIGNED,
        };
    }
    public componentWillReceiveProps(newProps: GenerateFormProps) {
        if (!utils.deepEqual(newProps.hashData, this.props.hashData)) {
            this.setState({
                signingState: SigningState.UNSIGNED,
            });
        }
    }
    public render() {
        const dispatcher = this.props.dispatcher;
        const depositTokenSymbol = this.props.sideToAssetToken[Side.deposit].symbol;
        const depositToken = this.props.tokenBySymbol[depositTokenSymbol];
        const receiveTokenSymbol = this.props.sideToAssetToken[Side.receive].symbol;
        const receiveToken = this.props.tokenBySymbol[receiveTokenSymbol];
        return (
            <div className="py2 mx-auto clearfix" style={{width: 600}}>
                <h3 className="px3">Generate an order</h3>
                <div className="px3">
                    <div className="mx-auto clearfix">
                        <div className="col col-6 pr2 relative">
                            <MakerAddressInput
                                blockchain={this.props.blockchain}
                                blockchainIsLoaded={this.props.blockchainIsLoaded}
                                orderMakerAddress={this.props.orderMakerAddress}
                                shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}
                            />
                        </div>
                        <div className="col col-6">
                            <OrderAddressInput
                                side={Side.receive}
                                label="Taker (address)"
                                blockchain={this.props.blockchain}
                                initialOrderAddress={this.props.orderTakerAddress}
                                updateOrderAddress={dispatcher.updateOrderAddress.bind(dispatcher)}
                            />
                        </div>
                    </div>
                </div>
                <div className="px3 pt3">
                    <div className="mx-auto clearfix">
                        <div className="col col-6 pr3">
                            <TokenInput
                                label="Token to sell (address)"
                                side={Side.deposit}
                                assetToken={this.props.sideToAssetToken[Side.deposit]}
                                updateChosenAssetToken={dispatcher.updateChosenAssetToken.bind(dispatcher)}
                                tokenBySymbol={this.props.tokenBySymbol}
                            />
                        </div>
                        <div className="col col-6">
                            <TokenInput
                                label="Token to receive (address)"
                                side={Side.receive}
                                assetToken={this.props.sideToAssetToken[Side.receive]}
                                updateChosenAssetToken={dispatcher.updateChosenAssetToken.bind(dispatcher)}
                                tokenBySymbol={this.props.tokenBySymbol}
                            />
                        </div>
                    </div>
                </div>
                <div className="px3 pt3">
                    <div className="mx-auto clearfix">
                        <div className="col col-6 pr3">
                            <AmountInput
                                label="Sell amount (uint)"
                                side={Side.deposit}
                                token={depositToken}
                                assetToken={this.props.sideToAssetToken[Side.deposit]}
                                updateChosenAssetToken={dispatcher.updateChosenAssetToken.bind(dispatcher)}
                                shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}
                                triggerTabChange={this.props.triggerTabChange}
                            />
                        </div>
                        <div className="col col-6">
                            <AmountInput
                                label="Receive amount (uint)"
                                side={Side.receive}
                                token={receiveToken}
                                assetToken={this.props.sideToAssetToken[Side.receive]}
                                updateChosenAssetToken={dispatcher.updateChosenAssetToken.bind(dispatcher)}
                                shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}
                                triggerTabChange={this.props.triggerTabChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="px3 pt3">
                    <div className="mx-auto" style={{width: 295}}>
                        <div style={{fontSize: 12, color: colors.grey500}}>Expiration (uint)</div>
                        <ExpirationInput
                            orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                            updateOrderExpiry={dispatcher.updateOrderExpiry.bind(dispatcher)}
                        />
                    </div>
                </div>
                <div className="px3 pt1">
                    <div className="mx-auto" style={{width: 60}}>
                        <i className="material-icons" style={{fontSize: 60}}>keyboard_arrow_down</i>
                    </div>
                </div>
                <div className="px3 pt1">
                    <div className="mx-auto" style={{width: 256}}>
                        <div style={{fontSize: 12, color: colors.grey500}}>Hash (byte32)</div>
                        <HashInput
                            blockchain={this.props.blockchain}
                            blockchainIsLoaded={this.props.blockchainIsLoaded}
                            hashData={this.props.hashData}
                        />
                    </div>
                </div>
                <div className="px3 pt3">
                    <div className="mx-auto center" style={{width: 112}}>
                        <LifeCycleRaisedButton
                            isHidden={this.state.signingState === SigningState.SIGNED}
                            labelReady="Sign hash"
                            labelLoading="Signing..."
                            labelComplete="Hash signed!"
                            onClickAsyncFn={this.onSignClickedAsync.bind(this)}
                        />
                    </div>
                    {this.state.signingErrMsg !== '' && <ErrorAlert message={this.state.signingErrMsg} />}
                    {this.state.globalErrMsg !== '' && <ErrorAlert message={this.state.globalErrMsg} />}
                </div>
                <div className="px3 pt3">
                    <div className="mx-auto" style={{width: 465}}>
                        {this.state.signingState === SigningState.SIGNED &&
                            <OrderJSON
                                orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                                orderSignatureData={this.props.orderSignatureData}
                                orderTakerAddress={this.props.orderTakerAddress}
                                sideToAssetToken={this.props.sideToAssetToken}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
    private async onSignClickedAsync() {
        // Check if all required inputs were supplied
        const debitToken = this.props.sideToAssetToken[Side.deposit];
        const debitBalance = this.props.tokenBySymbol[debitToken.symbol].balance;
        const receiveAmount = this.props.sideToAssetToken[Side.receive].amount;
        if (!_.isUndefined(debitToken.amount) && !_.isUndefined(receiveAmount) &&
            debitToken.amount > 0 && receiveAmount > 0 &&
            !_.isUndefined(this.props.orderMakerAddress) && debitBalance > debitToken.amount) {
            await this.signTransactionAsync();
            this.setState({
                globalErrMsg: '',
                shouldShowIncompleteErrs: false,
            });
        } else {
            let globalErrMsg = 'You must fix the above errors in order to generate a valid order';
            if (_.isUndefined(this.props.orderMakerAddress)) {
                globalErrMsg = 'You must enable wallet communication and make sure you have at least \
                                one account address in order to sign an order';
            }
            this.setState({
                globalErrMsg,
                shouldShowIncompleteErrs: true,
            });
        }
    }
    private async signTransactionAsync() {
        this.setState({
            signingState: SigningState.SIGNING,
        });
        const exchangeContractAddr = this.props.blockchain.getExchangeContractAddressIfExists();
        if (_.isUndefined(exchangeContractAddr)) {
            this.setState({
                isSigning: false,
                signingErrMsg: 'Exchange contract is not deployed on this network',
            });
            return;
        }
        const hashData = this.props.hashData;
        const orderHash = Ox.getOrderHash(exchangeContractAddr, hashData.orderMakerAddress,
                        hashData.orderTakerAddress, hashData.depositTokenContractAddr,
                        hashData.receiveTokenContractAddr, hashData.depositAmount,
                        hashData.receiveAmount, hashData.orderExpiryTimestamp);

        const msgHashHex = Ox.getMessageHash(orderHash, hashData.feeRecipientAddress, hashData.makerFee,
                                             hashData.takerFee);

        let signingErrMsg = '';
        try {
            await this.props.blockchain.sendSignRequestAsync(msgHashHex);
        } catch (err) {
            const errMsg = '' + err;
            if (_.includes(errMsg, 'User denied message')) {
                signingErrMsg = 'User denied sign request';
            } else {
                signingErrMsg = 'An unexpected error occured. Please try refreshing the page';
            }
        }
        this.setState({
            signingState: signingErrMsg === '' ? SigningState.SIGNED : SigningState.UNSIGNED,
            signingErrMsg,
        });
    }
}
