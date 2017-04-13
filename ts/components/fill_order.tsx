import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {Ox} from 'ts/utils/Ox';
import {TextField, Paper, Divider} from 'material-ui';
import {Step} from 'ts/components/ui/step';
import {Side, TokenBySymbol, Order, MenuItemValue, AssetToken, BlockchainErrs} from 'ts/types';
import {ErrorAlert} from 'ts/components/ui/error_alert';
import {AmountInput} from 'ts/components/inputs/amount_input';
import {VisualOrder} from 'ts/components/visual_order';
import {LifeCycleRaisedButton} from 'ts/components/ui/lifecycle_raised_button';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';
import {Dispatcher} from 'ts/redux/dispatcher';
import {Blockchain} from 'ts/blockchain';
import {errorReporter} from 'ts/utils/error_reporter';

interface FillOrderProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    orderFillAmount: number;
    userAddress: string;
    tokenBySymbol: TokenBySymbol;
    triggerMenuClick: (menuItemValue: MenuItemValue) => void;
    initialOrder: Order;
    dispatcher: Dispatcher;
}

interface FillOrderState {
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
            isValidOrder: false,
            orderJSON: _.isUndefined(this.props.initialOrder) ? '' : JSON.stringify(this.props.initialOrder),
            orderJSONErrMsg: '',
            parsedOrder: this.props.initialOrder,
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
        const hintOrder = utils.generateOrder(hintSideToAssetToken, hintOrderExpiryTimestamp,
                              '', '', hintSignatureData);
        const hintOrderJSON = JSON.stringify(hintOrder, null, '\t');
        return (
            <div className="clearfix px4" style={{minHeight: 600}}>
                <h3>Fill an order</h3>
                <Divider />
                <div className="pt2 pb2">
                    Paste an order JSON snippet below to begin
                </div>
                <div className="pb2">Order JSON</div>
                <Paper className="center p1" style={{width: 640}}>
                    <TextField
                        id="orderJSON"
                        style={{width: 620, height: 148}}
                        value={this.state.orderJSON}
                        onChange={this.onFillOrderChanged.bind(this)}
                        hintText={hintOrderJSON}
                        multiLine={true}
                        rows={4}
                        rowsMax={8}
                        underlineStyle={{display: 'none'}}
                    />
                </Paper>
                <div>
                    {this.state.orderJSONErrMsg !== '' &&
                        <ErrorAlert message={this.state.orderJSONErrMsg} />
                    }
                    {!_.isUndefined(this.state.parsedOrder) && this.renderVisualOrder()}
                </div>
            </div>
        );
    }
    private renderVisualOrder() {
        const assetToken = {
            amount: this.props.orderFillAmount,
            symbol: this.state.parsedOrder.assetTokens[Side.receive].symbol,
        };
        const token = this.props.tokenBySymbol[assetToken.symbol];
        const orderTaker = this.state.parsedOrder.taker !== '' ? this.state.parsedOrder.taker :
                           this.props.userAddress;
        const expiryDate = utils.convertToReadableDateTimeFromUnixTimestamp(this.state.parsedOrder.expiry);
        return (
            <div className="pt2 pb1">
                <div className="px4">
                    <div className="px4 pt3">
                        <VisualOrder
                            orderTakerAddress={orderTaker}
                            orderMakerAddress={this.state.parsedOrder.maker}
                            sideToAssetToken={this.state.parsedOrder.assetTokens}
                        />
                        <div className="center pt3 pb2">
                            Expires: {expiryDate} UTC
                        </div>
                    </div>
                </div>
                <div className="center">
                    <AmountInput
                        label="Fill amount"
                        side={Side.receive}
                        assetToken={assetToken}
                        shouldCheckBalanceAndAllowance={true}
                        shouldShowIncompleteErrs={false} // TODO
                        token={token}
                        triggerMenuClick={this.props.triggerMenuClick}
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
                return;
            }
            parsedOrder = order;

            const exchangeContractAddr = this.props.blockchain.getExchangeContractAddressIfExists();
            const depositToken = this.props.tokenBySymbol[parsedOrder.assetTokens[Side.deposit].symbol];
            const receiveToken = this.props.tokenBySymbol[parsedOrder.assetTokens[Side.receive].symbol];
            const depositAmount = parsedOrder.assetTokens[Side.deposit].amount;
            const receiveAmount = parsedOrder.assetTokens[Side.receive].amount;
            const taker = parsedOrder.taker !== '' ? parsedOrder.taker : constants.NULL_ADDRESS;
            const orderHash = Ox.getOrderHash(exchangeContractAddr, parsedOrder.maker,
                            taker, depositToken.address,
                            receiveToken.address, constants.FEE_RECIPIENT_ADDRESS,
                            depositAmount, receiveAmount, constants.MAKER_FEE,
                            constants.TAKER_FEE, parsedOrder.expiry);
            if (orderHash !== parsedOrder.signature.hash) {
                orderJSONErrMsg = 'Order hash does not match supplied plaintext values';
                parsedOrder = undefined;
            } else {
                // Update user supplied order cache so that it they navigate away from fill view
                // e.g to set a token allowance, when they come back, the fill order persists
                this.props.dispatcher.updateUserSuppliedOrderCache(parsedOrder);
            }
        } catch (err) {
            if (orderJSON !== '') {
                orderJSONErrMsg = 'Submitted order JSON is not valid JSON';
            }
        }

        if (orderJSONErrMsg !== '') {
            // Clear cache entry if user updates orderJSON to invalid entry
            this.props.dispatcher.updateUserSuppliedOrderCache(undefined);
        }

        this.setState({
            orderJSON,
            orderJSONErrMsg,
            parsedOrder,
        });
    }
    private async onFillOrderClickAsync(): Promise<boolean> {
        if (this.props.blockchainErr !== '') {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return false;
        }

        // TODO: add fillAmount < allowance check
        // TODO: get amount of order already filled, and don't let them try to fill more then whats left
        const depositToken = this.state.parsedOrder.assetTokens[Side.deposit];
        const receiveToken = this.state.parsedOrder.assetTokens[Side.receive];
        const specifiedTakerAddressIfExists = this.state.parsedOrder.taker;
        const fillAmount = this.props.orderFillAmount;
        const takerAddress = this.props.userAddress;
        const takerToken = this.props.tokenBySymbol[receiveToken.symbol];
        if (_.isUndefined(takerAddress)) {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return false;
        }
        const currentDate = new Date();
        const currentUnixTimestamp = currentDate.getTime() / 1000;
        let globalErrMsg = '';
        if (fillAmount > receiveToken.amount) {
            globalErrMsg = `Cannot fill more then order limit of ${receiveToken.amount} ${receiveToken.symbol}`;
        } else if (fillAmount < 0 || fillAmount > takerToken.balance || fillAmount > takerToken.allowance) {
            globalErrMsg = 'You must fix the above errors in order to fill this order';
        } else if (specifiedTakerAddressIfExists !== '' && specifiedTakerAddressIfExists !== takerAddress) {
            globalErrMsg = `This order can only be filled by ${specifiedTakerAddressIfExists}`;
        } else if (this.state.parsedOrder.expiry < currentUnixTimestamp) {
            globalErrMsg = `This order has expired`;
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
            await errorReporter.reportAsync(err);
            this.setState({
                globalErrMsg: 'Failed to fill order, please refresh and try again',
            });
            return false;
        }
    }
}
