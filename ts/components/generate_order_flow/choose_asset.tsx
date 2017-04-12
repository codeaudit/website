import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';
import {Dispatcher} from 'ts/redux/dispatcher';
import {Step} from 'ts/components/ui/step';
import {ErrorAlert} from 'ts/components/ui/error_alert';
import {AmountInput} from 'ts/components/inputs/amount_input';
import {
    AssetToken,
    Side,
    SideToAssetToken,
    Direction,
    TokenBySymbol,
    MenuItemValue,
} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order/asset_picker';

interface ChooseAssetProps {
    sideToAssetToken: SideToAssetToken;
    dispatcher: Dispatcher;
    tokenBySymbol: TokenBySymbol;
    triggerMenuClick: (menuItemValue: MenuItemValue) => void;
}

interface ChooseAssetState {
    hovers: {[identifier: string]: boolean};
    isPickerOpen: boolean;
    pickerSide: Side;
    shouldShowIncompleteErrs: boolean;
    globalErrMsg: string;
}

export class ChooseAsset extends React.Component<ChooseAssetProps, ChooseAssetState> {
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
            shouldShowIncompleteErrs: false,
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
                                    className="zmdi zmdi-swap"
                                />
                            </div>
                        </div>
                        <div className="col-5 center">
                            {this.renderAsset(Side.receive, this.props.sideToAssetToken[Side.receive])}
                        </div>
                    </div>
                    {this.state.globalErrMsg && <ErrorAlert message={this.state.globalErrMsg} />}
                </Step>
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
        const token = this.props.tokenBySymbol[assetToken.symbol];
        const iconHoverId = `${side}Icon`;
        const iconStyles = {
            cursor: 'pointer',
            opacity: this.state.hovers[iconHoverId] ? 0.8 : 1,
        };
        const title = side === Side.deposit ? 'I have' : 'I want';
        const dispatcher = this.props.dispatcher;
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
                    shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}
                    side={side}
                    token={token}
                    updateChosenAssetToken={dispatcher.updateChosenAssetToken.bind(dispatcher)}
                    triggerMenuClick={this.props.triggerMenuClick}
                />
                </div>
            </div>
        );
    }
    private swapTokens() {
        this.props.dispatcher.swapAssetTokenSymbols();
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
            if (_.isUndefined(assetToken.amount)) {
                globalErrMsg = 'Please fix the above amounts in order to proceed';
            }
        });
        if (globalErrMsg !== '') {
            this.setState({
                globalErrMsg,
                shouldShowIncompleteErrs: true,
            });
        } else {
            this.props.dispatcher.updateGenerateOrderStep(direction);
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
        this.props.dispatcher.updateChosenAssetToken(side, assetToken);
    }
}
