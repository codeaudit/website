import * as _ from 'lodash';
import * as React from 'react';
import {Dialog, GridList, GridTile} from 'material-ui';
import {colors} from 'material-ui/styles';
import {TokenBySymbol, Token, Side, AssetToken} from 'ts/types';

interface AssetPickerProps {
    isOpen: boolean;
    side: Side;
    currentAssetToken: AssetToken;
    onAssetChosen: (side: Side, chosenAssetToken: AssetToken) => void;
    tokenBySymbol: TokenBySymbol;
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

export class AssetPicker extends React.Component<AssetPickerProps, undefined> {
    public render() {
        return (
            <Dialog
                title="Choose asset"
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
                amount: 0.0,
            };
            return (
                <GridTile
                    key={symbol}
                    title={token.name}
                >
                    <div style={{cursor: 'pointer'}} onClick={this.chooseAssetAndClose.bind(this, assetToken)}>
                        <img style={{width: 100, position: 'absolute', left: '22%'}} src={token.iconUrl} />
                    </div>
                </GridTile>
            );
        });
    }
    private closeDialog() {
        this.props.onAssetChosen(this.props.side, this.props.currentAssetToken);
    }
    private chooseAssetAndClose(token: AssetToken) {
        this.props.onAssetChosen(this.props.side, token);
    }
}
