import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {generateOrderSteps, TokenBySymbol, AssetToken, Side, SideToAssetToken} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order/asset_picker';

interface ChooseAssetProps {
    sideToAssetToken: SideToAssetToken;
    tokenBySymbol: TokenBySymbol;
    updateGenerateOrderStep(step: generateOrderSteps): void;
    updateChosenAssetTokenSymbol(token: AssetToken): void;
    swapAssetTokenSymbols(): void;
}

interface ChooseAssetsState {
    pickerSide: Side;
    isPickerOpen: boolean;
    sideToAssetTokenAmount: {[side: string]: number};
}

export class ChooseAsset extends React.Component<ChooseAssetProps, ChooseAssetsState> {
    public constructor(props: ChooseAssetProps) {
        super(props);
        this.state = {
            isPickerOpen: false,
            pickerSide: 'deposit',
            sideToAssetTokenAmount: {
                [Side.deposit]: props.sideToAssetToken[Side.deposit].amount,
                [Side.receive]: props.sideToAssetToken[Side.receive].amount,
            },
        };
    }
    public render() {
        return (
            <div>
                <h3 className="center">Choose the assets you want to trade</h3>
                <div className="flex pt2 pb3 px4">
                    <div className="col-5 center">
                        {this.renderAsset(this.props.sideToAssetToken[Side.deposit])}
                    </div>
                    <div className="col-2 center relative">
                        <div
                            className="absolute"
                            style={{top: 55, left: 15, cursor: 'pointer'}}
                            onClick={this.props.swapAssetTokenSymbols}
                        >
                            <img style={{width: 50}} src="/images/swap.png" />
                        </div>
                    </div>
                    <div className="col-5 center">
                        {this.renderAsset(this.props.sideToAssetToken[Side.receive])}
                    </div>
                </div>
                <div className="flex">
                    <RaisedButton
                        label="Continue"
                        onClick={this.props.updateGenerateOrderStep.bind(this, generateOrderSteps.grantAllowance)}
                        style={{margin: 12, width: '100%'}}
                    />
                </div>
                <AssetPicker
                    isOpen={this.state.isPickerOpen}
                    currentAssetToken={this.props.sideToAssetToken[this.state.pickerSide]}
                    onAssetChosen={this.onAssetChosen.bind(this)}
                    tokenBySymbol={this.props.tokenBySymbol}
                />
            </div>
        );
    }
    private renderAsset(assetToken: AssetToken) {
        const amount = this.state.sideToAssetTokenAmount[assetToken.side];
        const token = this.props.tokenBySymbol[assetToken.symbol];
        return (
            <div>
                <div className="pb2" style={{color: colors.grey500, textTransform: 'capitalize'}}>
                    {assetToken.side}
                </div>
                <div
                    style={{cursor: 'pointer'}}
                    onClick={this.onAssetClicked.bind(this, assetToken.side)}
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
                    value={amount}
                    inputStyle={{textAlign: 'center'}}
                    hintText="Deposit amount"
                    onChange={this.onUpdatedAssetAmount.bind(this, assetToken)}
                />
                </div>
            </div>
        );
    }
    private onUpdatedAssetAmount(assetToken: AssetToken, e: any) {
        const amount: number = e.target.value;
        const newSideToAssetTokenAmount = _.assign({}, this.state.sideToAssetTokenAmount, {
            [assetToken.side]: amount,
        });
        this.setState({
            sideToAssetTokenAmount: newSideToAssetTokenAmount,
        });
        this.props.updateChosenAssetTokenSymbol(assetToken);
    }
    private onAssetClicked(side: Side) {
        this.setState({
            isPickerOpen: true,
            pickerSide: side,
        });
    }
    private onAssetChosen(assetToken: AssetToken) {
        this.setState({
            isPickerOpen: false,
        });
        this.props.updateChosenAssetTokenSymbol(assetToken);
    }
}
