import {Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {
    Direction,
    Side,
    AssetToken,
    BlockchainErrs,
    Token,
    SignatureData,
    Fill,
    Order,
    ActionTypes,
} from 'ts/types';
import BigNumber = require('bignumber.js');

export class Dispatcher {
    private dispatch: Dispatch<State>;
    constructor(dispatch: Dispatch<State>) {
        this.dispatch = dispatch;
    }
    public swapAssetTokenSymbols() {
        this.dispatch({
            type: ActionTypes.SWAP_ASSET_TOKENS,
        });
    }
    public updateGenerateOrderStep(direction: Direction) {
        this.dispatch({
            data: direction,
            type: ActionTypes.UPDATE_GENERATE_ORDER_STEP,
        });
    }
    public updateUserSuppliedOrderCache(order: Order) {
        this.dispatch({
            data: order,
            type: ActionTypes.UPDATE_USER_SUPPLIED_ORDER_CACHE,
        });
    }
    public updateShouldBlockchainErrDialogBeOpen(shouldBeOpen: boolean) {
        this.dispatch({
            data: shouldBeOpen,
            type: ActionTypes.UPDATE_SHOULD_BLOCKCHAIN_ERR_DIALOG_BE_OPEN,
        });
    }
    public updateChosenAssetToken(side: Side, token: AssetToken) {
        this.dispatch({
            data: {
                side,
                token,
            },
            type: ActionTypes.UPDATE_CHOSEN_ASSET_TOKEN,
        });
    }
    public updateOrderTakerAddress(address: string) {
        this.dispatch({
            data: address,
            type: ActionTypes.UPDATE_ORDER_TAKER_ADDRESS,
        });
    }
    public updateUserAddress(address: string) {
        this.dispatch({
            data: address,
            type: ActionTypes.UPDATE_USER_ADDRESS,
        });
    }
    public updateOrderExpiry(unixTimestampSec: number) {
        this.dispatch({
            data: unixTimestampSec,
            type: ActionTypes.UPDATE_ORDER_EXPIRY,
        });
    }
    public encounteredBlockchainError(err: BlockchainErrs) {
        this.dispatch({
             data: err,
            type: ActionTypes.BLOCKCHAIN_ERR_ENCOUNTERED,
         });
    }
    public updateBlockchainIsLoaded(isLoaded: boolean) {
        this.dispatch({
             data: isLoaded,
            type: ActionTypes.UPDATE_BLOCKCHAIN_IS_LOADED,
         });
    }
    public addTokenToTokenBySymbol(token: Token) {
        this.dispatch({
             data: token,
            type: ActionTypes.ADD_TOKEN_TO_TOKEN_BY_SYMBOL,
         });
    }
    public updateTokenBySymbol(tokens: Token[]) {
        this.dispatch({
             data: tokens,
            type: ActionTypes.UPDATE_TOKEN_BY_SYMBOL,
         });
    }
    public updateSignatureData(signatureData: SignatureData) {
        this.dispatch({
             data: signatureData,
            type: ActionTypes.UPDATE_ORDER_SIGNATURE_DATA,
         });
    }
    public updateUserEtherBalance(balance: number) {
        this.dispatch({
             data: balance,
            type: ActionTypes.UPDATE_USER_ETHER_BALANCE,
         });
    }
    public updateNetworkId(networkId: number) {
        this.dispatch({
             data: networkId,
            type: ActionTypes.UPDATE_NETWORK_ID,
         });
    }
    public updateOrderFillAmount(amount: BigNumber) {
        this.dispatch({
            data: amount,
            type: ActionTypes.UPDATE_ORDER_FILL_AMOUNT,
        });
    }
}
