import * as _ from 'lodash';
import * as React from 'react';
import {Dialog, GridList, GridTile} from 'material-ui';
import {Token, Side, AssetToken, TokenByAddress, Styles} from 'ts/types';

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

const styles: Styles = {
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
            hoveredAddress: undefined,
        };
    }
    public render() {
        return (
            <Dialog
                title="Choose a token"
                titleStyle={{fontWeight: 100}}
                modal={false}
                open={this.props.isOpen}
                onRequestClose={this.onCloseDialog.bind(this)}
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
        const gridTiles = _.map(this.props.tokenByAddress, (token: Token, address: string) => {
            const assetToken: AssetToken = {
                address,
                amount: this.props.currentAssetToken.amount,
            };
            const isHovered = this.state.hoveredAddress === address;
            const tileStyles = {
                cursor: 'pointer',
                opacity: isHovered ? 0.8 : 1,
            };
            return (
                <div
                    key={address}
                    style={tileStyles}
                    onClick={this.onChooseAssetAndClose.bind(this, assetToken)}
                    onMouseEnter={this.onToggleHover.bind(this, address, true)}
                    onMouseLeave={this.onToggleHover.bind(this, address, false)}
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
        if (!_.isUndefined(this.props.onCustomAssetChosen)) {
            gridTiles.push((
                <div
                    key="otherToken"
                    style={{cursor: 'pointer'}}
                    onClick={this.props.onCustomAssetChosen.bind(this)}
                >
                    <GridTile
                        style={{height: 160}}
                        title="Another ERC20"
                    >
                        <div style={{position: 'absolute', left: 42}}>
                            <i
                                style={{fontSize: 105, paddingLeft: 1, paddingRight: 1}}
                                className="zmdi zmdi-plus-circle"
                            />
                        </div>
                    </GridTile>
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
