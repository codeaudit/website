import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TextField, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Step} from 'ts/components/step';
import {Direction, SideToAssetToken, AssetToken} from 'ts/types';

interface CopyAndShareProps {
    orderExpiryTimestamp: number;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    updateGenerateOrderStep(direction: Direction): void;
}

interface CopyAndShareState {}

export class CopyAndShare extends React.Component<CopyAndShareProps, CopyAndShareState> {
    public render() {
        const transactionDetails = utils.generateOrderJSON(this.props.sideToAssetToken,
            this.props.orderExpiryTimestamp, this.props.orderTakerAddress);
        return (
            <Step
                title="Order successfully generated!"
                hasActionButton={false}
                hasBackButton={true}
                updateGenerateOrderStep={this.props.updateGenerateOrderStep}
            >
                <div className="pb2 mx4 flex">
                    <div>Order JSON</div>
                    <div
                        className="pl1"
                        style={{cursor: 'pointer'}}
                        onClick={this.onOrderJSONCopy.bind(this)}
                    >
                        <i
                            style={{fontSize: 15}}
                            className="material-icons"
                        >
                            content_copy
                        </i>
                    </div>
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
    private onOrderJSONCopy() {
        // TODO: Implement copy!
    }
}
