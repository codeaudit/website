import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TextField, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Step} from 'ts/components/ui/step';
import {CopyIcon} from 'ts/components/ui/copy_icon';
import {Direction, SideToAssetToken, AssetToken, SignatureData} from 'ts/types';

interface OrderJSONProps {
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
}

interface OrderJSONState {}

export class OrderJSON extends React.Component<OrderJSONProps, OrderJSONState> {
    public render() {
        const transactionDetails = utils.generateOrderJSON(this.props.sideToAssetToken,
            this.props.orderExpiryTimestamp, this.props.orderTakerAddress, this.props.orderSignatureData);
        // Hack: Need to remove carriage returns from the transactionDetails.
        // TODO: Find a safer way to do this
        const transactionDetailsString = JSON.stringify(transactionDetails).replace(/\\n|\\t|\\|"{|}"/g, '');
        const finalTransactionDetailsString = `{${transactionDetailsString}}`;
        return (
            <div>
                <div className="pb2 mx4 flex">
                    <div>Order JSON</div>
                    <CopyIcon data={finalTransactionDetailsString}/>
                </div>
                <Paper className="mx4 px1 center">
                    <TextField
                        id="orderJSON"
                        style={{width: 325}}
                        value={transactionDetails}
                        multiLine={true}
                        rows={2}
                        rowsMax={8}
                        underlineStyle={{display: 'none'}}
                    />
                </Paper>
                <div className="pt3 pb2 center">
                    <div>Share your signed order with someone willing to fill it ;)</div>
                    <div className="mx-auto pt2">
                        <i className="material-icons">email</i>
                    </div>
                </div>
            </div>
        );
    }
}
