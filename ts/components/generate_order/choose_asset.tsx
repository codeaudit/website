import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {generateOrderSteps} from 'ts/enums';

interface ChooseAssetProps {
    onContinueClick(step: generateOrderSteps): void;
}

interface Token {
    iconUrl: string;
    name: string;
};
interface TokenBySymbol {
    [symbol: string]: Token;
};

type Side = 'deposit' | 'receive';

const tokenBySymbol: TokenBySymbol = {
    DGX: {
        iconUrl: '/images/token_icons/digixdao.png',
        name: 'DigixDao',
    },
    ETH: {
        iconUrl: '/images/token_icons/ether.png',
        name: 'Ether',
    },
};

export class ChooseAsset extends React.Component<ChooseAssetProps, undefined> {
    public render() {
        return (
            <div>
                <h3 className="center">Choose the assets you want to trade</h3>
                <div className="flex pt2 pb3 px4">
                    <div className="col-5 center">
                        {this.renderAsset('deposit', 'ETH')}
                    </div>
                    <div className="col-2 center relative">
                        <div className="absolute" style={{top: 55, left: 15}}>
                            <img style={{width: 50}} src="/images/swap.png" />
                        </div>
                    </div>
                    <div className="col-5 center">
                        {this.renderAsset('receive', 'DGX')}
                    </div>
                </div>
                <div className="flex">
                    <RaisedButton
                        label="Continue"
                        onClick={this.props.onContinueClick.bind(this, generateOrderSteps.grantAllowance)}
                        style={{margin: 12, width: '100%'}}
                    />
                </div>
            </div>
        );
    }
    private renderAsset(side: Side, symbol: string) {
        const token = tokenBySymbol[symbol];
        return (
            <div>
                <div className="pb2" style={{color: colors.grey500}}>
                    {side === 'receive' ? 'Receive' : 'Deposit'}
                </div>
                <div>
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
                    inputStyle={{textAlign: 'center'}}
                    hintText="Deposit amount"
                />
                </div>
            </div>
        );
    }
}
