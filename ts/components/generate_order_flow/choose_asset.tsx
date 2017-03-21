import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {tokenBySymbol} from 'ts/tokenBySymbol';
import {Step} from 'ts/components/ui/step';
import {AmountInput} from 'ts/components/inputs/amount_input';
import {utils} from 'ts/utils/utils';
import {TokenBySymbol, AssetToken, Side, SideToAssetToken, Direction} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order_flow/asset_picker';

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
    sideToHasErrMsg: {[side: string]: boolean};
    globalErrMsg: string;
}

export class ChooseAsset extends React.Component<ChooseAssetProps, ChooseAssetsState> {
    public constructor(props: ChooseAssetProps) {
        super(props);
        this.state = {
            globalErrMsg: '',
            hovers: {
                depositIcon: false,
                receiveIcon: false,
                swapIcon: false,
            },
            isPickerOpen: false,
            pickerSide: Side.deposit,
            sideToHasErrMsg: {
                [Side.deposit]: false,
                [Side.receive]: false,
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
                    onNavigateClick={this.onAssetsChosen.bind(this)}
                >
                    <div className="flex pt2 pb2">
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
                    {this.state.globalErrMsg && this.renderGlobalErrMsg()}
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
    private renderGlobalErrMsg() {
        const errMsgStyles = {
            background: colors.red200,
            color: 'white',
            marginTop: 10,
            padding: 4,
            paddingLeft: 8,
        };
        return (
            <div className="rounded" style={errMsgStyles}>
                {this.state.globalErrMsg}
            </div>
        );
    }
    private renderAsset(side: Side, assetToken: AssetToken) {
        const token = tokenBySymbol[assetToken.symbol];
        const iconHoverId = `${side}Icon`;
        const iconStyles = {
            cursor: 'pointer',
            opacity: this.state.hovers[iconHoverId] ? 0.8 : 1,
        };
        const title = side === Side.deposit ? 'I have' : 'I want';
        return (
            <div>
                <div className="pb2" style={{color: colors.grey500, textTransform: 'capitalize'}}>
                    {title}
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
                <AmountInput
                    style={{width: 120}}
                    hintStyle={{left: 32}}
                    inputStyle={{textAlign: 'center'}}
                    assetToken={assetToken}
                    onToggleHasErrMsg={this.onToggleHasErrMsg.bind(this, side)}
                    side={side}
                    updateChosenAssetToken={this.props.updateChosenAssetToken}
                />
                </div>
            </div>
        );
    }
    private onToggleHasErrMsg(side: Side, hasErrMsg: boolean) {
        const sideToHasErrMsg = this.state.sideToHasErrMsg;
        sideToHasErrMsg[side] = hasErrMsg;
        this.setState({
            sideToHasErrMsg,
        });
    }
    private swapTokens() {
        this.props.swapAssetTokenSymbols();
    }
    private onAssetsChosen(direction: Direction) {
        let globalErrMsg = '';
        const sideToAssetToken = this.props.sideToAssetToken;
        if (sideToAssetToken[Side.deposit].symbol === sideToAssetToken[Side.receive].symbol) {
            globalErrMsg = 'Cannot trade a token for itself';
        }
        _.each(sideToAssetToken, (assetToken, side) => {
            if (assetToken.amount === 0) {
                globalErrMsg = 'Amounts are required';
            }
        });
        const sideToHasErrMsg = this.state.sideToHasErrMsg;
        _.each(sideToHasErrMsg, (hasErrMsg, side) => {
            if (hasErrMsg) {
                globalErrMsg = 'Please fix the above amounts in order to proceed';
            }
        });
        if (globalErrMsg !== '') {
            this.setState({
                globalErrMsg,
            });
        } else {
            this.props.updateGenerateOrderStep(direction);
        }
    }
    private onToggleHover(identifier: string, isHovered: boolean) {
        const hovers = _.assign({}, this.state.hovers, {
            [identifier]: isHovered,
        });
        this.setState({
            hovers,
        });
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
