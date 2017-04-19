import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {Ox} from 'ts/utils/Ox';
import {TextField, Paper, Divider} from 'material-ui';
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
import BigNumber = require('bignumber.js');

interface FillOrderProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    orderFillAmount: BigNumber;
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
                amount: new BigNumber(35),
                symbol: symbols[0],
            },
            [Side.receive]: {
                amount: new BigNumber(89),
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
                <Paper className="mx-auto p1" style={{width: 640}}>
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
        const takerToken = this.state.parsedOrder.taker.token;
        const takerAssetToken = {
            amount: new BigNumber(this.state.parsedOrder.taker.amount),
            symbol: takerToken.symbol,
        };
        const fillToken = this.props.tokenBySymbol[takerToken.symbol];
        const makerToken = this.state.parsedOrder.maker.token;
        const makerAssetToken = {
            amount: new BigNumber(this.state.parsedOrder.maker.amount),
            symbol: makerToken.symbol,
        };
        const fillAssetToken = {
            amount: this.props.orderFillAmount,
            symbol: takerToken.symbol,
        };
        const orderTaker = this.state.parsedOrder.taker.address !== '' ? this.state.parsedOrder.taker.address :
                           this.props.userAddress;
        const expiryDate = utils.convertToReadableDateTimeFromUnixTimestamp(this.state.parsedOrder.expiration);
        return (
            <div className="pt2 pb1">
                <div className="px4">
                    <div className="px4 pt3">
                        <VisualOrder
                            orderTakerAddress={orderTaker}
                            orderMakerAddress={this.state.parsedOrder.maker.address}
                            makerAssetToken={makerAssetToken}
                            takerAssetToken={takerAssetToken}
                            makerTokenDecimals={makerToken.decimals}
                            takerTokenDecimals={takerToken.decimals}
                        />
                        <div className="center pt3 pb2">
                            Expires: {expiryDate} UTC
                        </div>
                    </div>
                </div>
                <div className="mx-auto" style={{width: 238, height: 108}}>
                    <AmountInput
                        label="Fill amount"
                        side={Side.receive}
                        assetToken={fillAssetToken}
                        shouldCheckBalanceAndAllowance={true}
                        shouldShowIncompleteErrs={false} // TODO
                        token={fillToken}
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
        let parsedOrder: Order;
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
            const makerAmount = new BigNumber(parsedOrder.maker.amount);
            const takerAmount = new BigNumber(parsedOrder.taker.amount);
            const orderHash = Ox.getOrderHash(exchangeContractAddr, parsedOrder.maker.address,
                            parsedOrder.taker.address, parsedOrder.maker.token.address,
                            parsedOrder.taker.token.address, constants.FEE_RECIPIENT_ADDRESS,
                            makerAmount, takerAmount, constants.MAKER_FEE,
                            constants.TAKER_FEE, parsedOrder.expiration);
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
        if (this.props.blockchainErr !== '' || this.props.userAddress === '') {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return false;
        }

        const parsedOrder = this.state.parsedOrder;
        const makerTokenSymbol = parsedOrder.maker.token.symbol;
        const takerTokenSymbol = parsedOrder.taker.token.symbol;
        const depositAssetToken = {
            symbol: makerTokenSymbol,
            amount: new BigNumber(parsedOrder.maker.amount),
        };
        const receiveAssetToken = {
            symbol: takerTokenSymbol,
            amount: new BigNumber(parsedOrder.taker.amount),
        };
        const orderHash = parsedOrder.signature.hash;
        const amountAlreadyFilled = await this.props.blockchain.getFillAmountAsync(orderHash);
        const amountLeftToFill = receiveAssetToken.amount.minus(amountAlreadyFilled);
        const specifiedTakerAddressIfExists = parsedOrder.taker.address;
        const fillAmount = this.props.orderFillAmount;
        const takerAddress = this.props.userAddress;
        const takerToken = this.props.tokenBySymbol[takerTokenSymbol];
        const isValidSignature = await this.props.blockchain.isValidSignatureAsync(parsedOrder.maker.address,
                                                                                   parsedOrder.signature);
        if (_.isUndefined(takerAddress)) {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return false;
        }
        const currentDate = new Date();
        const currentUnixTimestamp = currentDate.getTime() / 1000;
        let globalErrMsg = '';
        if (fillAmount.lt(0) || fillAmount.gt(takerToken.balance) || fillAmount.gt(takerToken.allowance)) {
            globalErrMsg = 'You must fix the above errors in order to fill this order';
        } else if (specifiedTakerAddressIfExists !== '' && specifiedTakerAddressIfExists !== takerAddress) {
            globalErrMsg = `This order can only be filled by ${specifiedTakerAddressIfExists}`;
        } else if (this.state.parsedOrder.expiration < currentUnixTimestamp) {
            globalErrMsg = `This order has expired`;
        } else if (amountLeftToFill.eq(0)) {
            globalErrMsg = 'This order has already been completely filled';
        } else if (fillAmount.gt(amountLeftToFill)) {
            const amountLeftToFillInUnits = Ox.toUnitAmount(amountLeftToFill, parsedOrder.taker.token.decimals);
            globalErrMsg = `Cannot fill more then remaining ${amountLeftToFillInUnits}${receiveAssetToken.symbol}`;
        } else if (!isValidSignature) {
            globalErrMsg = 'Order signature is not valid';
        }
        if (globalErrMsg !== '') {
            this.setState({
                globalErrMsg,
            });
            return false;
        }

        try {
            await this.props.blockchain.fillOrderAsync(parsedOrder.maker.address,
                                                       parsedOrder.taker.address,
                                                       this.props.tokenBySymbol[makerTokenSymbol].address,
                                                       this.props.tokenBySymbol[takerTokenSymbol].address,
                                                       depositAssetToken.amount,
                                                       receiveAssetToken.amount,
                                                       parsedOrder.expiration,
                                                       this.props.orderFillAmount,
                                                       parsedOrder.signature,
                                                   );
            return true;
        } catch (err) {
            const errMsg = `${err}`;
            if (_.includes(errMsg, 'User denied transaction signature')) {
                return false;
            }
            utils.consoleLog(`${err}`);
            await errorReporter.reportAsync(err);
            this.setState({
                globalErrMsg: 'Failed to fill order, please refresh and try again',
            });
            return false;
        }
    }
}
