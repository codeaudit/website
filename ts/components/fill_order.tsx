import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {zeroEx} from 'ts/utils/zero_ex';
import {TextField, Paper, Divider} from 'material-ui';
import {
    Side,
    TokenByAddress,
    Order,
    MenuItemValue,
    AssetToken,
    BlockchainErrs,
    OrderToken,
    Token,
} from 'ts/types';
import {ErrorAlert} from 'ts/components/ui/error_alert';
import {AmountInput} from 'ts/components/inputs/amount_input';
import {VisualOrder} from 'ts/components/visual_order';
import {LifeCycleRaisedButton} from 'ts/components/ui/lifecycle_raised_button';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';
import {Dispatcher} from 'ts/redux/dispatcher';
import {Blockchain} from 'ts/blockchain';
import {errorReporter} from 'ts/utils/error_reporter';
import {customTokenStorage} from 'ts/local_storage/custom_token_storage';
import BigNumber = require('bignumber.js');

interface FillOrderProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    orderFillAmount: BigNumber;
    userAddress: string;
    tokenByAddress: TokenByAddress;
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
        const addresses = _.keys(this.props.tokenByAddress);
        const hintSideToAssetToken = {
            [Side.deposit]: {
                amount: new BigNumber(35),
                address: addresses[0],
            },
            [Side.receive]: {
                amount: new BigNumber(89),
                address: addresses[1],
            },
        };
        const hintOrderExpiryTimestamp = utils.initialOrderExpiryUnixTimestampSec();
        const hintSignatureData = {
            hash: '0xf965a9978a0381ab58f5a2408ad967c...',
            r: '0xf01103f759e2289a28593eaf22e5820032...',
            s: '937862111edcba395f8a9e0cc1b2c5e12320...',
            v: 27,
        };
        const hintSalt = zeroEx.generateSalt();
        const hintOrder = utils.generateOrder(hintSideToAssetToken, hintOrderExpiryTimestamp,
                              '', '', hintSignatureData, this.props.tokenByAddress, hintSalt);
        const hintOrderJSON = `${JSON.stringify(hintOrder, null, '\t').substring(0, 500)}...`;
        return (
            <div className="clearfix px4" style={{minHeight: 600}}>
                <h3>Fill an order</h3>
                <Divider />
                <div className="pt2 pb2">
                    Paste an order JSON snippet below to begin
                </div>
                <div className="pb2">Order JSON</div>
                <Paper className="p1" style={{height: 164}}>
                    <TextField
                        id="orderJSON"
                        hintStyle={{bottom: 0, top: 0}}
                        fullWidth={true}
                        value={this.state.orderJSON}
                        onChange={this.onFillOrderChanged.bind(this)}
                        hintText={hintOrderJSON}
                        multiLine={true}
                        rows={6}
                        rowsMax={6}
                        underlineStyle={{display: 'none'}}
                        textareaStyle={{marginTop: 0}}
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
        const takerTokenAddress = this.state.parsedOrder.taker.token.address;
        const takerToken = this.props.tokenByAddress[takerTokenAddress];
        const takerAssetToken = {
            amount: new BigNumber(this.state.parsedOrder.taker.amount),
            symbol: takerToken.symbol,
        };
        const fillToken = this.props.tokenByAddress[takerToken.address];
        const makerTokenAddress = this.state.parsedOrder.maker.token.address;
        const makerToken = this.props.tokenByAddress[makerTokenAddress];
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
        const parsedOrderExpiration = new BigNumber(this.state.parsedOrder.expiration);
        const expiryDate = utils.convertToReadableDateTimeFromUnixTimestamp(parsedOrderExpiration);
        return (
            <div className="pt3 pb1">
                <span>Order details</span>
                <div className="px4">
                    <div className="px4 pt1">
                        <VisualOrder
                            orderTakerAddress={orderTaker}
                            orderMakerAddress={this.state.parsedOrder.maker.address}
                            makerAssetToken={makerAssetToken}
                            takerAssetToken={takerAssetToken}
                            makerToken={makerToken}
                            takerToken={takerToken}
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
            const expiration = new BigNumber(parsedOrder.expiration);
            const salt = new BigNumber(parsedOrder.salt);
            const orderHash = zeroEx.getOrderHash(exchangeContractAddr, parsedOrder.maker.address,
                            parsedOrder.taker.address, parsedOrder.maker.token.address,
                            parsedOrder.taker.token.address, constants.FEE_RECIPIENT_ADDRESS,
                            makerAmount, takerAmount, constants.MAKER_FEE, constants.TAKER_FEE,
                            expiration, salt);

            const signature = parsedOrder.signature;
            const isValidSignature = zeroEx.isValidSignature(signature.hash, signature.v,
                                                       signature.r, signature.s,
                                                       parsedOrder.maker.address);
            if (orderHash !== parsedOrder.signature.hash) {
                orderJSONErrMsg = 'Order hash does not match supplied plaintext values';
                parsedOrder = undefined;
            } else if (!isValidSignature) {
                orderJSONErrMsg = 'Order signature is invalid';
                parsedOrder = undefined;
            } else {
                // Update user supplied order cache so that if they navigate away from fill view
                // e.g to set a token allowance, when they come back, the fill order persists
                this.props.dispatcher.updateUserSuppliedOrderCache(parsedOrder);
                this.addTokenToCustomTokensIfUnseen(parsedOrder.maker.token);
                this.addTokenToCustomTokensIfUnseen(parsedOrder.taker.token);
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
        const makerTokenAddress = parsedOrder.maker.token.address;
        const takerTokenAddress = parsedOrder.taker.token.address;
        const depositAssetToken = {
            address: makerTokenAddress,
            amount: new BigNumber(parsedOrder.maker.amount),
        };
        const receiveAssetToken = {
            address: takerTokenAddress,
            amount: new BigNumber(parsedOrder.taker.amount),
        };
        const parsedOrderExpiration = new BigNumber(this.state.parsedOrder.expiration);
        const orderHash = parsedOrder.signature.hash;
        const amountAlreadyFilled = await this.props.blockchain.getFillAmountAsync(orderHash);
        const amountLeftToFill = receiveAssetToken.amount.minus(amountAlreadyFilled);
        const specifiedTakerAddressIfExists = parsedOrder.taker.address.toLowerCase();
        const fillAmount = this.props.orderFillAmount;
        const takerAddress = this.props.userAddress;
        const takerToken = this.props.tokenByAddress[takerTokenAddress];
        let isValidSignature = false;
        if (this.props.userAddress === '') {
            const signatureData = parsedOrder.signature;
            isValidSignature = zeroEx.isValidSignature(signatureData.hash, signatureData.v,
                                                   signatureData.r, signatureData.s,
                                                   parsedOrder.maker.address);
        } else {
            isValidSignature = await this.props.blockchain.isValidSignatureAsync(parsedOrder.maker.address,
                                                              parsedOrder.signature);
        }

        if (_.isUndefined(takerAddress)) {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return false;
        }

        const [
          makerBalance,
          makerAllowance,
        ] = await this.props.blockchain.getTokenBalanceAndAllowanceAsync(parsedOrder.maker.address,
                                                                         parsedOrder.maker.token.address);
        const currentDate = new Date();
        const currentUnixTimestamp = currentDate.getTime() / 1000;
        let globalErrMsg = '';
        if (_.isUndefined(fillAmount)) {
            globalErrMsg = 'You must specify a fill amount';
        } else if (fillAmount.lte(0) || fillAmount.gt(takerToken.balance) ||
            fillAmount.gt(takerToken.allowance)) {
            globalErrMsg = 'You must fix the above errors in order to fill this order';
        } else if (specifiedTakerAddressIfExists !== '' && specifiedTakerAddressIfExists !== takerAddress) {
            globalErrMsg = `This order can only be filled by ${specifiedTakerAddressIfExists}`;
        } else if (parsedOrderExpiration.lt(currentUnixTimestamp)) {
            globalErrMsg = `This order has expired`;
        } else if (amountLeftToFill.eq(0)) {
            globalErrMsg = 'This order has already been completely filled';
        } else if (fillAmount.gt(amountLeftToFill)) {
            const amountLeftToFillInUnits = zeroEx.toUnitAmount(amountLeftToFill, parsedOrder.taker.token.decimals);
            globalErrMsg = `Cannot fill more then remaining ${amountLeftToFillInUnits}${takerToken.symbol}`;
        } else if (makerBalance.lt(fillAmount)) {
            globalErrMsg = 'Maker no longer has a sufficient balance to complete this order';
        } else if (makerAllowance.lt(fillAmount)) {
            globalErrMsg = 'Maker does not have a high enough allowance set to complete this order';
        } else if (!isValidSignature) {
            globalErrMsg = 'Order signature is not valid';
        }
        if (globalErrMsg !== '') {
            this.setState({
                globalErrMsg,
            });
            return false;
        }

        const parsedOrderSalt = new BigNumber(parsedOrder.salt);
        try {
            await this.props.blockchain.fillOrderAsync(parsedOrder.maker.address,
                                                       parsedOrder.taker.address,
                                                       this.props.tokenByAddress[makerTokenAddress].address,
                                                       this.props.tokenByAddress[takerTokenAddress].address,
                                                       depositAssetToken.amount,
                                                       receiveAssetToken.amount,
                                                       parsedOrderExpiration,
                                                       this.props.orderFillAmount,
                                                       parsedOrder.signature,
                                                       parsedOrderSalt,
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
    private addTokenToCustomTokensIfUnseen(token: OrderToken) {
        const existingToken = this.props.tokenByAddress[token.address];

        // If a token with the address already exists, we trust the tokens retrieved from the
        // tokenRegistry or supplied by the current user over ones from an orderJSON. Thus, we
        // do not add a customToken and will defer to the rest of the details associated to the existing
        // token with this address for the rest of it's metadata.
        const doesTokenWithAddressExist = !_.isUndefined(existingToken);
        if (doesTokenWithAddressExist) {
            return;
        }

        // Let's make sure this token (with a unique address), also have a unique name/symbol, otherwise
        // we append something to make it visibly clear to the end user that this is a different underlying
        // token then the identically named one they already had locally.
        const existingTokens = _.values(this.props.tokenByAddress);
        const isUniqueName = _.isUndefined(_.find(existingTokens, {name: token.name}));
        if (!isUniqueName) {
            token.name = `${token.name} [Imported]`;
        }

        const isUniqueSymbol = _.isUndefined(_.find(existingTokens, {symbol: token.symbol}));
        if (!isUniqueSymbol) {
            token.symbol = `*${token.symbol}*`;
        }

        // Add default token icon url
        (token as Token).iconUrl = constants.DEFAULT_TOKEN_ICON_URL;

        // Add the custom token to local storage and to the redux store
        customTokenStorage.addCustomToken(this.props.blockchain.networkId, token);
        this.props.dispatcher.addTokenToTokenByAddress(token);
    }
}
