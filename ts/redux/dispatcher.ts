import {Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {
    Direction,
    Side,
    AssetToken,
    BlockchainErrs,
    Token,
    SignatureData,
} from 'ts/types';
import {
    swapAssetTokenSymbols,
    updateGenerateOrderStep,
    updateChosenAssetToken,
    updateOrderExpiry,
    updateOrderAddress,
    encounteredBlockchainError,
    updateBlockchainIsLoaded,
    updateTokenBySymbol,
    updateSignatureData,
    updateUserEtherBalance,
    updateNetworkId,
    updateOrderFillAmount,
} from 'ts/redux/actions';

export class Dispatcher {
    private dispatch: Dispatch<State>;
    constructor(dispatch: Dispatch<State>) {
        this.dispatch = dispatch;
    }
    public swapAssetTokenSymbols() {
        this.dispatch(swapAssetTokenSymbols());
    }
    public updateGenerateOrderStep(direction: Direction) {
        this.dispatch(updateGenerateOrderStep(direction));
    }
    public updateChosenAssetToken(side: Side, token: AssetToken) {
        this.dispatch(updateChosenAssetToken(side, token));
    }
    public updateOrderAddress(side: Side, address: string) {
        this.dispatch(updateOrderAddress(side, address));
    }
    public updateOrderExpiry(unixTimestampSec: number) {
        this.dispatch(updateOrderExpiry(unixTimestampSec));
    }
    public encounteredBlockchainError(err: BlockchainErrs) {
        this.dispatch(encounteredBlockchainError(err));
    }
    public updateBlockchainIsLoaded(isLoaded: boolean) {
        this.dispatch(updateBlockchainIsLoaded(isLoaded));
    }
    public updateTokenBySymbol(tokens: Token[]) {
        this.dispatch(updateTokenBySymbol(tokens));
    }
    public updateSignatureData(signatureData: SignatureData) {
        this.dispatch(updateSignatureData(signatureData));
    }
    public updateUserEtherBalance(balance: number) {
        this.dispatch(updateUserEtherBalance(balance));
    }
    public updateNetworkId(networkId: number) {
        this.dispatch(updateNetworkId(networkId));
    }
    public updateOrderFillAmount(amount: number) {
        this.dispatch(updateOrderFillAmount(amount));
    }
}
