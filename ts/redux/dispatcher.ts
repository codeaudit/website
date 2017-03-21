import {Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {
    Direction,
    Side,
    AssetToken,
} from 'ts/types';
import {
    swapAssetTokenSymbols,
    updateGenerateOrderStep,
    updateChosenAssetToken,
    updateOrderExpiry,
    updateOrderAddress,
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
}
