import {Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {actionTypes} from 'ts/redux/actions';
import {
    Direction,
    Side,
    AssetToken,
    BlockchainErrs,
    Token,
    SignatureData,
} from 'ts/types';

export class Dispatcher {
    private dispatch: Dispatch<State>;
    constructor(dispatch: Dispatch<State>) {
        this.dispatch = dispatch;
    }
    public swapAssetTokenSymbols() {
        this.dispatch({
            type: actionTypes.SWAP_ASSET_TOKENS,
        });
    }
    public updateGenerateOrderStep(direction: Direction) {
        this.dispatch({
            data: direction,
            type: actionTypes.UPDATE_GENERATE_ORDER_STEP,
        });
    }
    public updateShouldBlockchainErrDialogBeOpen(shouldBeOpen: boolean) {
        this.dispatch({
            data: shouldBeOpen,
            type: actionTypes.UPDATE_SHOULD_BLOCKCHAIN_ERR_DIALOG_BE_OPEN,
        });
    }
    public updateChosenAssetToken(side: Side, token: AssetToken) {
        this.dispatch({
            data: {
                side,
                token,
            },
            type: actionTypes.UPDATE_CHOSEN_ASSET_TOKEN,
        });
    }
    public updateOrderTakerAddress(address: string) {
        this.dispatch({
            data: address,
            type: actionTypes.UPDATE_ORDER_TAKER_ADDRESS,
        });
    }
    public updateUserAddress(address: string) {
        this.dispatch({
            data: address,
            type: actionTypes.UPDATE_USER_ADDRESS,
        });
    }
    public updateOrderExpiry(unixTimestampSec: number) {
        this.dispatch({
            data: unixTimestampSec,
            type: actionTypes.UPDATE_ORDER_EXPIRY,
        });
    }
    public encounteredBlockchainError(err: BlockchainErrs) {
        this.dispatch({
             data: err,
            type: actionTypes.BLOCKCHAIN_ERR_ENCOUNTERED,
         });
    }
    public updateBlockchainIsLoaded(isLoaded: boolean) {
        this.dispatch({
             data: isLoaded,
            type: actionTypes.UPDATE_BLOCKCHAIN_IS_LOADED,
         });
    }
    public addTokenToTokenBySymbol(token: Token) {
        this.dispatch({
             data: token,
            type: actionTypes.ADD_TOKEN_TO_TOKEN_BY_SYMBOL,
         });
    }
    public updateTokenBySymbol(tokens: Token[]) {
        this.dispatch({
             data: tokens,
            type: actionTypes.UPDATE_TOKEN_BY_SYMBOL,
         });
    }
    public updateSignatureData(signatureData: SignatureData) {
        this.dispatch({
             data: signatureData,
            type: actionTypes.UPDATE_ORDER_SIGNATURE_DATA,
         });
    }
    public updateUserEtherBalance(balance: number) {
        this.dispatch({
             data: balance,
            type: actionTypes.UPDATE_USER_ETHER_BALANCE,
         });
    }
    public updateNetworkId(networkId: number) {
        this.dispatch({
             data: networkId,
            type: actionTypes.UPDATE_NETWORK_ID,
         });
    }
    public updateOrderFillAmount(amount: number) {
        this.dispatch({
            data: amount,
            type: actionTypes.UPDATE_ORDER_FILL_AMOUNT,
        });
    }
}
