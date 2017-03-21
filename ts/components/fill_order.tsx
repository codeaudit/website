import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TextField, Paper, RaisedButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Step} from 'ts/components/ui/step';
import {tokenBySymbol} from 'ts/token_by_symbol';
import {Side, SideToAssetToken, AssetToken} from 'ts/types';

interface FillOrderProps {}

interface FillOrderState {
    orderJSON: string;
}

export class FillOrder extends React.Component<FillOrderProps, FillOrderState> {
    constructor(props: FillOrderProps) {
        super(props);
        this.state = {
            orderJSON: '',
        };
    }
    public render() {
        const symbols = _.keys(tokenBySymbol);
        const hintSideToAssetToken = {
            [Side.deposit]: {
                amount: 35,
                symbol: symbols[0],
            },
            [Side.receive]: {
                amount: 89,
                symbol: symbols[1],
            },
        };
        const hintOrderExpiryTimestamp = utils.initialOrderExpiryUnixTimestampSec();
        const hintSignatureData = {
            hash: '0xf965a9978a0381ab58f5a2408ad967c28d7b10b336da9fafea21401d060a25a0',
            r: '0xf01103f759e2289a28593eaf22e5820032e699740069944d8f8d7ce341f3d7',
            s: '937862111edcba395f8a9e0cc1b2c5e12320ac992a73f232999907b5d71297aa',
            v: 27,
        };
        const hintOrderJSON = utils.generateOrderJSON(hintSideToAssetToken, hintOrderExpiryTimestamp,
                                                      '', hintSignatureData);
        return (
            <Step
                title="Fill an order"
                actionButtonText="Fill order"
                hasActionButton={true}
                hasBackButton={false}
                onNavigateClick={this.onFillOrderClick.bind(this)}
            >
                <div className="pt3">
                    <div className="pb2 px4">Order JSON</div>
                    <Paper className="mx4 center">
                        <TextField
                            id="orderJSON"
                            style={{width: 325}}
                            value={this.state.orderJSON}
                            onChange={this.onFillOrderChanged.bind(this)}
                            hintText={hintOrderJSON}
                            multiLine={true}
                            rows={4}
                            rowsMax={8}
                            underlineStyle={{display: 'none'}}
                        />
                    </Paper>
                </div>
            </Step>
        );
    }
    private onFillOrderChanged(e: any) {
        const orderJSON = e.target.value;
        this.setState({
            orderJSON,
        });
    }
    private onFillOrderClick() {
        // TODO: Validate submitted json
    }
}
