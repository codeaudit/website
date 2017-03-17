import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TextField, Paper, RaisedButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Step} from 'ts/components/step';
import {tokenBySymbol} from 'ts/tokenBySymbol';
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
        const hintOrderJSON = utils.generateOrderJSON(hintSideToAssetToken, hintOrderExpiryTimestamp, '');
        return (
            <Step
                title="Fill an order"
                actionButtonText="Fill order"
                hasActionButton={true}
                hasBackButton={false}
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
        // TODO: Validated submitted json
    }
}
