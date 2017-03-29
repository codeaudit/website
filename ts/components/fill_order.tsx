import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TextField, Paper} from 'material-ui';
import {Step} from 'ts/components/ui/step';
import {Side, TokenBySymbol} from 'ts/types';
import {ErrorAlert} from 'ts/components/ui/error_alert';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';

interface FillOrderProps {
    tokenBySymbol: TokenBySymbol;
}

interface FillOrderState {
    errMsg: string;
    orderJSON: string;
}

export class FillOrder extends React.Component<FillOrderProps, FillOrderState> {
    private validator: Validator;
    constructor(props: FillOrderProps) {
        super(props);
        this.validator = new Validator();
        this.state = {
            errMsg: '',
            orderJSON: '',
        };
    }
    public render() {
        const symbols = _.keys(this.props.tokenBySymbol);
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
            hash: '0xf965a9978a0381ab58f5a2408ad967c...',
            r: '0xf01103f759e2289a28593eaf22e5820032...',
            s: '937862111edcba395f8a9e0cc1b2c5e12320...',
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
                            style={{width: 745}}
                            value={this.state.orderJSON}
                            onChange={this.onFillOrderChanged.bind(this)}
                            hintText={hintOrderJSON}
                            multiLine={true}
                            rows={4}
                            rowsMax={8}
                            underlineStyle={{display: 'none'}}
                        />
                        {this.state.errMsg !== '' &&
                            <ErrorAlert message={this.state.errMsg} />
                        }
                    </Paper>
                </div>
            </Step>
        );
    }
    private onFillOrderChanged(e: any) {
        const orderJSON = e.target.value;
        let errMsg = '';
        try {
            const order = JSON.parse(orderJSON);
            const validationResult = this.validator.validate(order, orderSchema);
            if (validationResult.errors.length > 0) {
                errMsg = 'Submitted order JSON is not a valid order';
            }
        } catch (err) {
            if (orderJSON !== '') {
                errMsg = 'Submitted order JSON is not valid JSON';
            }
        }
        this.setState({
            orderJSON,
            errMsg,
        });
    }
    private onFillOrderClick() {
        // TODO: Validate submitted json
    }
}
