import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {tokenBySymbol} from 'ts/tokenBySymbol';
import {Step} from 'ts/components/step';
import {TokenBySymbol, AssetToken, Side, SideToAssetToken, Direction} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order/asset_picker';

interface ChooseAssetProps {
    sideToAssetToken: SideToAssetToken;
    updateGenerateOrderStep(direction: Direction): void;
    updateChosenAssetToken(side: Side, token: AssetToken): void;
    swapAssetTokenSymbols(): void;
}

interface ChooseAssetsState {
    hovers: {[identifier: string]: boolean};
    isPickerOpen: boolean;
    pickerSide: Side;
    sideToAssetTokenState: {[side: string]: {amount: number, errMsg: string}};
}

export class ChooseAsset extends React.Component<ChooseAssetProps, ChooseAssetsState> {
    public constructor(props: ChooseAssetProps) {
        super(props);
        this.state = {
            hovers: {
                depositIcon: false,
                receiveIcon: false,
                swapIcon: false,
            },
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
        const swapHoverId = 'swapIcon';
        const swapStyles = {
            color: this.state.hovers.swapIcon ? colors.amber600 : colors.amber800,
            fontSize: 50,
        };
        return (
            <div>
                <Step
                    title="Choose which tokens to trade"
                    actionButtonText="Continue"
                    hasActionButton={true}
                    hasBackButton={false}
                    onNavigateClick={this.props.updateGenerateOrderStep}
                >
                    <div className="flex pt2">
                        <div className="col-5 center">
                            {this.renderAsset(Side.deposit, this.props.sideToAssetToken[Side.deposit])}
                        </div>
                        <div className="col-2 center relative">
                            <div
                                className="absolute"
                                style={{top: 55, left: 15, cursor: 'pointer'}}
                                onClick={this.swapTokens.bind(this)}
                                onMouseEnter={this.onToggleHover.bind(this, swapHoverId, true)}
                                onMouseLeave={this.onToggleHover.bind(this, swapHoverId, false)}
                            >
                                <i
                                    style={swapStyles}
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
                </Step>
                <AssetPicker
                    isOpen={this.state.isPickerOpen}
                    currentAssetToken={this.props.sideToAssetToken[this.state.pickerSide]}
                    onAssetChosen={this.onAssetChosen.bind(this)}
                    side={this.state.pickerSide}
                />
            </div>
        );
    }
    private renderAsset(side: Side, assetToken: AssetToken) {
        const amount = this.state.sideToAssetTokenState[side].amount;
        const errMsg = this.state.sideToAssetTokenState[side].errMsg;
        const token = tokenBySymbol[assetToken.symbol];
        const iconHoverId = `${side}Icon`;
        const iconStyles = {
            cursor: 'pointer',
            opacity: this.state.hovers[iconHoverId] ? 0.8 : 1,
        };
        return (
            <div>
                <div className="pb2" style={{color: colors.grey500, textTransform: 'capitalize'}}>
                    {side}
                </div>
                <img
                    style={{width: 100, height: 100, ...iconStyles}}
                    onMouseEnter={this.onToggleHover.bind(this, iconHoverId, true)}
                    onMouseLeave={this.onToggleHover.bind(this, iconHoverId, false)}
                    onClick={this.onAssetClicked.bind(this, side)}
                    src={token.iconUrl}
                />
                <div className="pt2" style={{color: colors.grey500}}>
                    {token.name}
                </div>
                <div className="pt2">
                <TextField
                    style={{width: 112}}
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
    private onToggleHover(identifier: string, isHovered: boolean) {
        const hovers = _.assign({}, this.state.hovers, {
            [identifier]: isHovered,
        });
        this.setState({
            hovers,
        });
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
