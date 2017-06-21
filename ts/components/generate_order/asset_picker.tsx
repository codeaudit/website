import * as _ from 'lodash';
import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import GridList from 'material-ui/GridList/GridList';
import GridTile from 'material-ui/GridList/GridTile';
import {Token, Side, AssetToken, TokenByAddress, Styles} from 'ts/types';

const TILE_DIMENSION = 146;

interface AssetPickerProps {
    isOpen: boolean;
    side: Side;
    currentAssetToken: AssetToken;
    onAssetChosen: (side: Side, chosenAssetToken: AssetToken) => void;
    onCustomAssetChosen?: () => void;
    tokenByAddress: TokenByAddress;
}

interface AssetPickerState {
    hoveredAddress: string | undefined;
}

export class AssetPicker extends React.Component<AssetPickerProps, AssetPickerState> {
    constructor(props: AssetPickerProps) {
        super(props);
        this.state = {
            hoveredAddress: undefined,
        };
    }
    public render() {
        return (
            <Dialog
                title="Select Token"
                titleStyle={{fontWeight: 100}}
                modal={false}
                open={this.props.isOpen}
                onRequestClose={this.onCloseDialog.bind(this)}
            >
                <div
                    className="clearfix flex flex-wrap"
                    style={{overflowY: 'auto', maxWidth: 720, maxHeight: 356, marginBottom: 10}}
                >
                    {this.renderGridTiles()}
                </div>
            </Dialog>
        );
    }
    private renderGridTiles() {
        const gridTiles = _.map(this.props.tokenByAddress, (token: Token, address: string) => {
            const assetToken: AssetToken = {
                address,
                amount: this.props.currentAssetToken.amount,
            };
            const isHovered = this.state.hoveredAddress === address;
            const tileStyles = {
                cursor: 'pointer',
                opacity: isHovered ? 0.6 : 1,
            };
            return (
                <div
                    key={address}
                    style={{width: TILE_DIMENSION, height: TILE_DIMENSION, ...tileStyles}}
                    className="p2 mx-auto"
                    onClick={this.onChooseAssetAndClose.bind(this, assetToken)}
                    onMouseEnter={this.onToggleHover.bind(this, address, true)}
                    onMouseLeave={this.onToggleHover.bind(this, address, false)}
                >
                    <div className="p1 center">
                        <img
                            style={{width: 100, height: 100}}
                            src={token.iconUrl}
                        />
                    </div>
                    <div className="center">{token.name}</div>
                </div>
            );
        });
        if (!_.isUndefined(this.props.onCustomAssetChosen)) {
            const otherTokenKey = 'otherToken';
            const isHovered = this.state.hoveredAddress === otherTokenKey;
            const tileStyles = {
                cursor: 'pointer',
                opacity: isHovered ? 0.6 : 1,
            };
            gridTiles.push((
                <div
                    key={otherTokenKey}
                    style={{width: TILE_DIMENSION, height: TILE_DIMENSION, ...tileStyles}}
                    className="p2 mx-auto"
                    onClick={this.props.onCustomAssetChosen.bind(this)}
                    onMouseEnter={this.onToggleHover.bind(this, otherTokenKey, true)}
                    onMouseLeave={this.onToggleHover.bind(this, otherTokenKey, false)}
                >
                    <div className="p1 center">
                        <i
                            style={{fontSize: 105, paddingLeft: 1, paddingRight: 1}}
                            className="zmdi zmdi-plus-circle"
                        />
                    </div>
                    <div className="center">Other ERC20 Token</div>
                </div>
            ));
        }
        return gridTiles;
    }
    private onToggleHover(address: string, isHovered: boolean) {
        const hoveredAddress = isHovered ? address : undefined;
        this.setState({
            hoveredAddress,
        });
    }
    private onCloseDialog() {
        this.props.onAssetChosen(this.props.side, this.props.currentAssetToken);
    }
    private onChooseAssetAndClose(token: AssetToken) {
        this.props.onAssetChosen(this.props.side, token);
    }
}
