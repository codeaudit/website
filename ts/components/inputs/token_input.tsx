import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {utils} from 'ts/utils/utils';
import {tokenBySymbol} from 'ts/tokenBySymbol';
import {AssetToken, Side} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order_flow/asset_picker';

interface TokenInputProps {
    label: string;
    side: Side;
    assetToken: AssetToken;
    updateChosenAssetToken: (side: Side, token: AssetToken) => void;
}

interface TokenInputState {
    isPickerOpen: boolean;
}

export class TokenInput extends React.Component<TokenInputProps, TokenInputState> {
    constructor(props: TokenInputProps) {
        super(props);
        this.state = {
            isPickerOpen: false,
        };
    }
    public render() {
        const hrStyles = {
            borderBottom: '1px solid rgb(224, 224, 224)',
            borderLeft: 'none rgb(224, 224, 224)',
            borderRight: 'none rgb(224, 224, 224)',
            borderTop: 'none rgb(224, 224, 224)',
            bottom: 6,
            boxSizing: 'content-box',
            margin: 0,
            position: 'absolute',
            width: 257,
        };
        const labelStyles = {
            color: colors.grey500,
            marginTop: -15,
            pointerEvents: 'none',
            position: 'absolute',
            top: 32,
            transform: 'scale(0.75) translate(0px, -28px)',
            transformOrigin: 'left top 0px',
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            userSelect: 'none',
            zIndex: 1,
        };
        const token = tokenBySymbol[this.props.assetToken.symbol];
        return (
            <div className="relative">
                <label style={labelStyles}>{this.props.label}</label>
                <div
                    className="py2 pr2"
                    style={{cursor: 'pointer'}}
                    onClick={this.onInputClick.bind(this)}
                >
                    <div className="flex" style={{width: '100%'}}>
                        <div className="pr1">
                            <img src={token.iconUrl} style={{width: 20, height: 20}} />
                        </div>
                        <div style={{lineHeight: 1.4}}>{token.name}</div>
                    </div>
                    <hr style={hrStyles} />
                </div>
                <AssetPicker
                    isOpen={this.state.isPickerOpen}
                    currentAssetToken={this.props.assetToken}
                    onAssetChosen={this.onAssetChosen.bind(this)}
                    side={this.props.side}
                />
            </div>
        );
    }
    private onInputClick() {
        this.setState({
            isPickerOpen: true,
        });
    }
    private onAssetChosen(side: Side, assetToken: AssetToken) {
        this.setState({
            isPickerOpen: false,
        });
        this.props.updateChosenAssetToken(side, assetToken);
    }
}
