import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TextField, Paper} from 'material-ui';
import {Step} from 'ts/components/ui/step';
import {Side, TokenBySymbol, Order, TabValue, AssetToken, BlockchainErrs} from 'ts/types';
import {ErrorAlert} from 'ts/components/ui/error_alert';
import {AmountInput} from 'ts/components/inputs/amount_input';
import {VisualOrder} from 'ts/components/visual_order';
import {EnableWalletDialog} from 'ts/components/enable_wallet_dialog';
import {LifeCycleRaisedButton} from 'ts/components/ui/lifecycle_raised_button';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';
import {Dispatcher} from 'ts/redux/dispatcher';
import {Blockchain} from 'ts/blockchain';

interface FillOrderProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    orderFillAmount: number;
    orderMakerAddress: string;
    tokenBySymbol: TokenBySymbol;
    triggerTabChange: (tabValue: TabValue) => void;
    dispatcher: Dispatcher;
}

interface FillOrderState {
    isEnableWalletDialogOpen: boolean;
    isValidOrder: boolean;
    globalErrMsg: string;
    orderJSON: string;
    orderJSONErrMsg: string;
    parsedOrder: Order;
}

export class FillOrder extends React.Component<FillOrderProps, FillOrderState> {
    private validator: Validator;
    constructor(props: FillOrderProps) {
        super(props);
        this.state = {
            globalErrMsg: '',
            isEnableWalletDialogOpen: false,
            isValidOrder: false,
            orderJSON: '',
            orderJSONErrMsg: '',
            parsedOrder: undefined,
        };
        this.validator = new Validator();
    }
    public render() {
        const symbols = _.keys(this.props.tokenBySymbol);
        const hintSideToAssetToken = {
            [Side.deposit]: {
                amount: 35,
                symbol: symbols[0],
            },
            [Side.receive]: {
                amount: 89,
                symbol: symbols[1],
            },
        };
        const hintOrderExpiryTimestamp = utils.initialOrderExpiryUnixTimestampSec();
        const hintSignatureData = {
            hash: '0xf965a9978a0381ab58f5a2408ad967c...',
            r: '0xf01103f759e2289a28593eaf22e5820032...',
            s: '937862111edcba395f8a9e0cc1b2c5e12320...',
            v: 27,
        };
        const hintOrderJSON = utils.generateOrderJSON(hintSideToAssetToken, hintOrderExpiryTimestamp,
                              '', '', hintSignatureData);
        return (
            <div className="py3 clearfix" style={{minHeight: 600}}>
                <h3 className="center">Fill an order</h3>
                <div className="pb2 px4">Order JSON</div>
                <Paper className="mx4 center">
                    <TextField
                        id="orderJSON"
                        style={{width: 745}}
                        value={this.state.orderJSON}
                        onChange={this.onFillOrderChanged.bind(this)}
                        hintText={hintOrderJSON}
                        multiLine={true}
                        rows={4}
                        rowsMax={8}
                        underlineStyle={{display: 'none'}}
                    />
                </Paper>
                <div className="px4">
                    {this.state.orderJSONErrMsg !== '' &&
                        <ErrorAlert message={this.state.orderJSONErrMsg} />
                    }
                    {!_.isUndefined(this.state.parsedOrder) && this.renderVisualOrder()}
                </div>
                <EnableWalletDialog
                    isOpen={this.state.isEnableWalletDialogOpen}
                    toggleDialogFn={this.toggleEnableWalletDialog.bind(this)}
                />
            </div>
        );
    }
    private renderVisualOrder() {
        const assetToken = {
            amount: this.props.orderFillAmount,
            symbol: this.state.parsedOrder.assetTokens[Side.receive].symbol,
        };
        const token = this.props.tokenBySymbol[assetToken.symbol];
        return (
            <div className="pt2 pb1">
                <VisualOrder
                    orderExpiryTimestamp={this.state.parsedOrder.expiry}
                    orderTakerAddress={this.props.orderMakerAddress}
                    orderMakerAddress={this.state.parsedOrder.maker}
                    sideToAssetToken={this.state.parsedOrder.assetTokens}
                />
                <div className="center">
                    <AmountInput
                        label="Fill amount"
                        side={Side.receive}
                        assetToken={assetToken}
                        shouldCheckBalanceAndAllowance={true}
                        shouldShowIncompleteErrs={false} // TODO
                        token={token}
                        triggerTabChange={this.props.triggerTabChange}
                        updateChosenAssetToken={this.onFillAmountUpdated.bind(this)}
                    />
                </div>
                <div>
                    <LifeCycleRaisedButton
                        labelReady="Fill order"
                        labelLoading="Filling order..."
                        labelComplete="Order filled!"
                        onClickAsyncFn={this.onFillOrderClickAsync.bind(this)}
                    />
                    {this.state.globalErrMsg !== '' &&
                        <ErrorAlert message={this.state.globalErrMsg} />
                    }
                </div>
            </div>
        );
    }
    private onFillAmountUpdated(side: Side, assetToken: AssetToken) {
        this.props.dispatcher.updateOrderFillAmount(assetToken.amount);
    }
    private onFillOrderChanged(e: any) {
        const orderJSON = e.target.value;
        let orderJSONErrMsg = '';
        let parsedOrder;
        try {
            const order = JSON.parse(orderJSON);
            const validationResult = this.validator.validate(order, orderSchema);
            if (validationResult.errors.length > 0) {
                orderJSONErrMsg = 'Submitted order JSON is not a valid order';
                utils.consoleLog(`Unexpected order JSON validation error: ${validationResult.errors.join(', ')}`);
            } else {
                parsedOrder = order;
            }
        } catch (err) {
            if (orderJSON !== '') {
                orderJSONErrMsg = 'Submitted order JSON is not valid JSON';
            }
        }
        this.setState({
            orderJSON,
            orderJSONErrMsg,
            parsedOrder,
        });
    }
    private async onFillOrderClickAsync(): Promise<boolean> {
        if (this.props.blockchainErr === BlockchainErrs.A_CONTRACT_NOT_DEPLOYED_ON_NETWORK) {
            this.props.dispatcher.updateShouldNotDeployedDialogBeOpen(true);
            return;
        }

        // TODO: add fillAmount < allowance check
        // TODO: get amount of order already filled, and don't let them try to fill more then whats left
        // TODO: validate that takerAddress (if specified) is same as users address
        const depositToken = this.state.parsedOrder.assetTokens[Side.deposit];
        const receiveToken = this.state.parsedOrder.assetTokens[Side.receive];
        const fillAmount = this.props.orderFillAmount;
        const takerAddress = this.props.orderMakerAddress;
        const takerToken = this.props.tokenBySymbol[receiveToken.symbol];
        if (_.isUndefined(takerAddress)) {
            this.toggleEnableWalletDialog(true);
            return false;
        }
        let globalErrMsg = '';
        if (fillAmount > receiveToken.amount) {
            globalErrMsg = `Cannot fill more then order limit of ${receiveToken.amount} ${receiveToken.symbol}`;
        } else if (fillAmount < 0 || fillAmount > takerToken.balance || fillAmount > takerToken.allowance) {
            globalErrMsg = 'You must fix the above errors in order to fill this order';
        }
        if (globalErrMsg !== '') {
            this.setState({
                globalErrMsg,
            });
            return false;
        }

        try {
            await this.props.blockchain.fillOrderAsync(this.state.parsedOrder.maker,
                                                       this.state.parsedOrder.taker,
                                                       this.props.tokenBySymbol[depositToken.symbol].address,
                                                       this.props.tokenBySymbol[receiveToken.symbol].address,
                                                       depositToken.amount,
                                                       receiveToken.amount,
                                                       this.state.parsedOrder.expiry,
                                                       this.props.orderFillAmount,
                                                       this.state.parsedOrder.signature,
                                                   );
            return true;
        } catch (err) {
            utils.consoleLog(`${err}`);
            this.setState({
                globalErrMsg: 'Failed to fill order, please refresh and try again',
            });
            return false;
        }
    }
    private toggleEnableWalletDialog(isOpen: boolean) {
        this.setState({
            isEnableWalletDialogOpen: isOpen,
        });
    }
}
