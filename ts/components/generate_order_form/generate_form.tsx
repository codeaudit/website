import * as _ from 'lodash';
import * as React from 'react';
import {Blockchain} from 'ts/blockchain';
import {RaisedButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Dispatcher} from 'ts/redux/dispatcher';
import {ErrorAlert} from 'ts/components/ui/error_alert';
import {OrderAddressInput} from 'ts/components/inputs/order_address_input';
import {MakerAddressInput} from 'ts/components/inputs/maker_address_input';
import {TokenInput} from 'ts/components/inputs/token_input';
import {AmountInput} from 'ts/components/inputs/amount_input';
import {HashInput} from 'ts/components/inputs/hash_input';
import {ExpirationInput} from 'ts/components/inputs/expiration_input';
import {
    GenerateOrderSteps,
    Direction,
    TokenBySymbol,
    Side,
    AssetToken,
    SideToAssetToken,
    SignatureData,
    HashData,
} from 'ts/types';

interface GenerateFormProps {
    blockchain: Blockchain;
    blockchainIsLoaded: boolean;
    dispatcher: Dispatcher;
    hashData: HashData;
    orderExpiryTimestamp: number;
    orderMakerAddress: string;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
}

interface GenerateFormState {
    globalErrMsg: string;
    shouldShowIncompleteErrs: boolean;
}

export class GenerateForm extends React.Component<GenerateFormProps, any> {
    constructor(props: GenerateFormProps) {
        super(props);
        this.state = {
            globalErrMsg: '',
            shouldShowIncompleteErrs: false,
        };
    }
    public render() {
        const dispatcher = this.props.dispatcher;
        return (
            <div className="py2 mx-auto clearfix" style={{width: 600}}>
                <h3 className="px3">Generate an order</h3>
                <div className="px3">
                    <div className="mx-auto clearfix">
                        <div className="col col-6 pr2 relative">
                            <MakerAddressInput
                                blockchain={this.props.blockchain}
                                blockchainIsLoaded={this.props.blockchainIsLoaded}
                                initialMarketMakerAddress={this.props.orderMakerAddress}
                                updateOrderAddress={dispatcher.updateOrderAddress.bind(dispatcher)}
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
                            />
                        </div>
                        <div className="col col-6">
                            <TokenInput
                                label="Token to receive (address)"
                                side={Side.receive}
                                assetToken={this.props.sideToAssetToken[Side.receive]}
                                updateChosenAssetToken={dispatcher.updateChosenAssetToken.bind(dispatcher)}
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
                                assetToken={this.props.sideToAssetToken[Side.deposit]}
                                updateChosenAssetToken={dispatcher.updateChosenAssetToken.bind(dispatcher)}
                                shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}
                            />
                        </div>
                        <div className="col col-6">
                            <AmountInput
                                label="Receive amount (uint)"
                                side={Side.receive}
                                assetToken={this.props.sideToAssetToken[Side.receive]}
                                updateChosenAssetToken={dispatcher.updateChosenAssetToken.bind(dispatcher)}
                                shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}
                            />
                        </div>
                    </div>
                </div>
                <div className="px3 pt3">
                    <div className="mx-auto" style={{width: 295}}>
                        <div style={{fontSize: 12, color: colors.grey500}}>Expiration (uint)</div>
                        <ExpirationInput
                            orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                            updateOrderExpiry={dispatcher.updateOrderExpiry}
                        />
                    </div>
                </div>
                <div className="px3 pt1">
                    <div className="mx-auto" style={{width: 60}}>
                        <i className="material-icons" style={{fontSize: 60}}>keyboard_arrow_down</i>
                    </div>
                </div>
                <div className="px3 pt3">
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
                    <div className="mx-auto" style={{width: 112}}>
                        <RaisedButton onClick={this.onSignClicked.bind(this)} label="Sign hash" />
                    </div>
                    {this.state.globalErrMsg !== '' && <ErrorAlert message={this.state.globalErrMsg} />}
                </div>
            </div>
        );
    }
    private onSignClicked() {
        // Check if all required inputs were supplied
        const debitAmount = this.props.sideToAssetToken[Side.deposit].amount;
        const receiveAmount = this.props.sideToAssetToken[Side.receive].amount;
        if (!_.isUndefined(debitAmount) && !_.isUndefined(receiveAmount) && debitAmount > 0 &&
            receiveAmount > 0) {
            // TODO: Sign the transaction
        } else {
            this.setState({
                globalErrMsg: 'You must fix the above errors in order to generate a valid order',
                shouldShowIncompleteErrs: true,
            });
        }
    }
}
