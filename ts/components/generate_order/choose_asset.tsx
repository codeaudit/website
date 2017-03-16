import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {TokenBySymbol, AssetToken, Side, SideToAssetToken, Direction} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order/asset_picker';

interface ChooseAssetProps {
    sideToAssetToken: SideToAssetToken;
    tokenBySymbol: TokenBySymbol;
    updateGenerateOrderStep(direction: Direction): void;
    updateChosenAssetToken(side: Side, token: AssetToken): void;
    swapAssetTokenSymbols(): void;
}

interface ChooseAssetsState {
    pickerSide: Side;
    isPickerOpen: boolean;
    sideToAssetTokenState: {[side: string]: {amount: number, errMsg: string}};
}

export class ChooseAsset extends React.Component<ChooseAssetProps, ChooseAssetsState> {
    public constructor(props: ChooseAssetProps) {
        super(props);
        this.state = {
            isPickerOpen: false,
            pickerSide: 'deposit',
            sideToAssetTokenState: {
                [Side.deposit]: {
                    amount: props.sideToAssetToken[Side.deposit].amount,
                    errMsg: '',
                },
                [Side.receive]: {
                    amount: props.sideToAssetToken[Side.receive].amount,
                    errMsg: '',
                },
            },
        };
    }
    public render() {
        return (
            <div>
                <h3 className="center">Choose the assets you want to trade</h3>
                <div className="flex pt2 pb3 px4">
                    <div className="col-5 center">
                        {this.renderAsset(Side.deposit, this.props.sideToAssetToken[Side.deposit])}
                    </div>
                    <div className="col-2 center relative">
                        <div
                            className="absolute"
                            style={{top: 55, left: 15, cursor: 'pointer'}}
                            onClick={this.swapTokens.bind(this)}
                        >
                            <i
                                style={{color: colors.amber600, fontSize: 50}}
                                className="material-icons"
                            >
                                swap_horiz
                            </i>
                        </div>
                    </div>
                    <div className="col-5 center">
                        {this.renderAsset(Side.receive, this.props.sideToAssetToken[Side.receive])}
                    </div>
                </div>
                <div className="flex">
                    <RaisedButton
                        label="Continue"
                        onClick={this.props.updateGenerateOrderStep.bind(this, Direction.forward)}
                        style={{margin: 12, width: '100%'}}
                    />
                </div>
                <AssetPicker
                    isOpen={this.state.isPickerOpen}
                    currentAssetToken={this.props.sideToAssetToken[this.state.pickerSide]}
                    onAssetChosen={this.onAssetChosen.bind(this)}
                    side={this.state.pickerSide}
                    tokenBySymbol={this.props.tokenBySymbol}
                />
            </div>
        );
    }
    private renderAsset(side: Side, assetToken: AssetToken) {
        const amount = this.state.sideToAssetTokenState[side].amount;
        const errMsg = this.state.sideToAssetTokenState[side].errMsg;
        const token = this.props.tokenBySymbol[assetToken.symbol];
        return (
            <div>
                <div className="pb2" style={{color: colors.grey500, textTransform: 'capitalize'}}>
                    {side}
                </div>
                <div
                    style={{cursor: 'pointer'}}
                    onClick={this.onAssetClicked.bind(this, side)}
                >
                    <img
                        style={{width: 100, height: 100}}
                        src={token.iconUrl}
                    />
                </div>
                <div className="pt2" style={{color: colors.grey500}}>
                    {token.name}
                </div>
                <div className="pt3">
                <TextField
                    style={{width: 115}}
                    errorText={errMsg}
                    value={amount === 0 ? '' : amount}
                    inputStyle={{textAlign: 'center'}}
                    hintText="Deposit amount"
                    onChange={this.onUpdatedAssetAmount.bind(this, side, assetToken)}
                />
                </div>
            </div>
        );
    }
    private swapTokens() {
        const newSideToAssetTokenState = {
            [Side.deposit]: this.state.sideToAssetTokenState[Side.receive],
            [Side.receive]: this.state.sideToAssetTokenState[Side.deposit],
        };
        this.setState({
            sideToAssetTokenState: newSideToAssetTokenState,
        });
        this.props.swapAssetTokenSymbols();
    }
    private isNumeric(n: string) {
        return !isNaN(parseFloat(n)) && isFinite(Number(n));
    }
    private onUpdatedAssetAmount(side: Side, assetToken: AssetToken, e: any) {
        const amount: string = e.target.value;
        const isAmountNumeric = this.isNumeric(amount);
        const newSideToAssetTokenAmount = _.assign({}, this.state.sideToAssetTokenState, {
            [side]: {
                amount,
                errMsg: isAmountNumeric || amount === '' ? '' : 'Must be a number',
            },
        });
        this.setState({
            sideToAssetTokenState: newSideToAssetTokenAmount,
        });
        if (isAmountNumeric) {
            assetToken.amount = Number(amount);
        }
        this.props.updateChosenAssetToken(side, assetToken);
    }
    private onAssetClicked(side: Side) {
        this.setState({
            isPickerOpen: true,
            pickerSide: side,
        });
    }
    private onAssetChosen(side: Side, assetToken: AssetToken) {
        this.setState({
            isPickerOpen: false,
        });
        this.props.updateChosenAssetToken(side, assetToken);
    }
}
