import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TextField, Paper} from 'material-ui';
import {CopyIcon} from 'ts/components/ui/copy_icon';
import {SideToAssetToken, SignatureData} from 'ts/types';

interface OrderJSONProps {
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    orderTakerAddress: string;
    orderMakerAddress: string;
    sideToAssetToken: SideToAssetToken;
}

interface OrderJSONState {}

export class OrderJSON extends React.Component<OrderJSONProps, OrderJSONState> {
    public render() {
        const transactionDetails = utils.generateOrder(this.props.sideToAssetToken,
            this.props.orderExpiryTimestamp, this.props.orderTakerAddress,
            this.props.orderMakerAddress, this.props.orderSignatureData);
        const transactionDetailsString = JSON.stringify(transactionDetails);
        return (
            <div>
                <div className="pb2 mx4 flex">
                    <div>Order JSON</div>
                    <CopyIcon data={transactionDetailsString}/>
                </div>
                <Paper className="mx4 center">
                    <TextField
                        id="orderJSON"
                        style={{width: 325}}
                        value={JSON.stringify(transactionDetails, null, '\t')}
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
