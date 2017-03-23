import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';
import {RequiredLabel} from 'ts/components/ui/required_label';
import {FakeTextField} from 'ts/components/ui/fake_text_field';
import {AssetToken, Side, TokenBySymbol} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order_flow/asset_picker';

interface TokenInputProps {
    label: string;
    side: Side;
    assetToken: AssetToken;
    updateChosenAssetToken: (side: Side, token: AssetToken) => void;
    tokenBySymbol: TokenBySymbol;
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
        const token = this.props.tokenBySymbol[this.props.assetToken.symbol];
        const label = <RequiredLabel label={this.props.label} />;
        return (
            <div>
                <FakeTextField label={label}>
                    <div
                        className="pt1"
                        style={{cursor: 'pointer'}}
                        onClick={this.onInputClick.bind(this)}
                    >
                        <div className="flex" style={{width: '100%'}}>
                            <div className="pr1">
                                <img src={token.iconUrl} style={{width: 20, height: 20}} />
                            </div>
                            <div style={{lineHeight: 1.4}}>{token.name}</div>
                        </div>
                    </div>
                </FakeTextField>
                <AssetPicker
                    isOpen={this.state.isPickerOpen}
                    currentAssetToken={this.props.assetToken}
                    onAssetChosen={this.onAssetChosen.bind(this)}
                    side={this.props.side}
                    tokenBySymbol={this.props.tokenBySymbol}
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
