import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TextField, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Step} from 'ts/components/ui/step';
import {CopyIcon} from 'ts/components/ui/copy_icon';
import {Direction, SideToAssetToken, AssetToken, SignatureData} from 'ts/types';

interface CopyAndShareProps {
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    updateGenerateOrderStep(direction: Direction): void;
}

interface CopyAndShareState {}

export class CopyAndShare extends React.Component<CopyAndShareProps, CopyAndShareState> {
    public render() {
        const transactionDetails = utils.generateOrderJSON(this.props.sideToAssetToken,
            this.props.orderExpiryTimestamp, this.props.orderTakerAddress, this.props.orderSignatureData);
        // Hack: Need to remove carriage returns from the transactionDetails.
        // TODO: Find a safer way to do this
        const transactionDetailsString = JSON.stringify(transactionDetails).replace(/\\n|\\t|\\|"{|}"/g, '');
        const finalTransactionDetailsString = `{${transactionDetailsString}}`;
        return (
            <Step
                title="Order successfully created and signed!"
                hasActionButton={false}
                hasBackButton={true}
                onNavigateClick={this.props.updateGenerateOrderStep}
            >
                <div className="pb2 mx4 flex">
                    <div>Order JSON</div>
                    <CopyIcon data={finalTransactionDetailsString}/>
                </div>
                <Paper className="mx4 center">
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
            </Step>
        );
    }
}
