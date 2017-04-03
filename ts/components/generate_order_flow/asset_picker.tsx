import * as _ from 'lodash';
import * as React from 'react';
import {Dialog, GridList, GridTile} from 'material-ui';
import {Token, Side, AssetToken, TokenBySymbol} from 'ts/types';

interface AssetPickerProps {
    isOpen: boolean;
    side: Side;
    currentAssetToken: AssetToken;
    onAssetChosen: (side: Side, chosenAssetToken: AssetToken) => void;
    tokenBySymbol: TokenBySymbol;
}

interface AssetPickerState {
    hoveredSymbol: string | undefined;
}

const styles = {
    gridList: {
        overflowY: 'auto',
        width: 722,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
};

export class AssetPicker extends React.Component<AssetPickerProps, AssetPickerState> {
    constructor(props: AssetPickerProps) {
        super(props);
        this.state = {
            hoveredSymbol: undefined,
        };
    }
    public render() {
        return (
            <Dialog
                title="Choose a token"
                modal={false}
                open={this.props.isOpen}
                onRequestClose={this.closeDialog.bind(this)}
            >
                <GridList
                    cellHeight={150}
                    cols={4}
                    padding={8}
                    style={styles.gridList}
                >
                    {this.renderGridTiles()}
                </GridList>
            </Dialog>
        );
    }
    private renderGridTiles() {
        return _.map(this.props.tokenBySymbol, (token: Token, symbol: string) => {
            const assetToken: AssetToken = {
                symbol,
                amount: this.props.currentAssetToken.amount,
            };
            const isHovered = this.state.hoveredSymbol === symbol;
            const tileStyles = {
                cursor: 'pointer',
                opacity: isHovered ? 0.8 : 1,
            };
            return (
                <div
                    key={symbol}
                    style={tileStyles}
                    onTouchTap={this.chooseAssetAndClose.bind(this, assetToken)}
                    onMouseEnter={this.onToggleHover.bind(this, symbol, true)}
                    onMouseLeave={this.onToggleHover.bind(this, symbol, false)}
                >
                    <GridTile
                        style={{height: 160}}
                        title={token.name}
                    >
                        {/* Note: we keep this additional div here because GridTile applies additional */}
                        {/* transformations to img tag children that we do not want. */}
                        <div>
                            <img
                                style={{width: 100, height: 100, position: 'absolute', left: '22%'}}
                                src={token.iconUrl}
                            />
                        </div>
                    </GridTile>
                </div>
            );
        });
    }
    private onToggleHover(symbol: string, isHovered: boolean) {
        const hoveredSymbol = isHovered ? symbol : undefined;
        this.setState({
            hoveredSymbol,
        });
    }
    private closeDialog() {
        this.props.onAssetChosen(this.props.side, this.props.currentAssetToken);
    }
    private chooseAssetAndClose(token: AssetToken) {
        this.props.onAssetChosen(this.props.side, token);
    }
}
