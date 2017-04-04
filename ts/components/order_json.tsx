import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {TextField, Paper} from 'material-ui';
import {CopyIcon} from 'ts/components/ui/copy_icon';
import {SideToAssetToken, SignatureData, Order} from 'ts/types';

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
        const order = utils.generateOrder(this.props.sideToAssetToken,
            this.props.orderExpiryTimestamp, this.props.orderTakerAddress,
            this.props.orderMakerAddress, this.props.orderSignatureData);
        const orderJSON = JSON.stringify(order);
        return (
            <div>
                <div className="pb2 mx4 flex">
                    <div>Order JSON</div>
                    <CopyIcon data={orderJSON}/>
                </div>
                <Paper className="mx4 center">
                    <TextField
                        id="orderJSON"
                        style={{width: 325}}
                        value={JSON.stringify(order, null, '\t')}
                        multiLine={true}
                        rows={2}
                        rowsMax={8}
                        underlineStyle={{display: 'none'}}
                    />
                </Paper>
                <div className="pt3 pb2 center">
                    <div>Share your signed order with someone willing to fill it ;)</div>
                    <div className="mx-auto pt2 flex" style={{width: 91}}>
                        <div>
                            <i
                                style={{cursor: 'pointer', fontSize: 29}}
                                onClick={this.shareViaFacebook.bind(this)}
                                className="zmdi zmdi-facebook-box"
                            />
                        </div>
                        <div className="pl1" style={{position: 'relative', width: 28}}>
                            <i
                                style={{cursor: 'pointer', fontSize: 32, position: 'absolute', top: -2, left: 8}}
                                onClick={this.shareViaEmailAsync.bind(this)}
                                className="zmdi zmdi-email"
                            />
                        </div>
                        <div className="pl1">
                            <i
                                style={{cursor: 'pointer', fontSize: 29}}
                                onClick={this.shareViaTwitterAsync.bind(this)}
                                className="zmdi zmdi-twitter-box"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private async shareViaTwitterAsync() {
        const shareLink = await this.generateShareLinkAsync();
        const tweetText = encodeURIComponent(`Fill my order using the 0x protocol: ${shareLink}`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, 'Share your order', 'width=500,height=400');
    }
    private async shareViaFacebook() {
        const shareLink = this.getOrderUrl();
        (window as any).FB.ui({
            display: 'popup',
            href: shareLink,
            method: 'share',
        }, _.noop);
    }
    private async shareViaEmailAsync() {
        const shareLink = await this.generateShareLinkAsync();
        const encodedSubject = encodeURIComponent('Let\'s trade using the 0x protocol');
        const encodedBody = encodeURIComponent(`I generated an order with the 0x protocol.
You can see and fill it here: ${shareLink}`);
        const mailToLink = `mailto:mail@example.org?subject=${encodedSubject}&body=${encodedBody}`;
        window.location.href = mailToLink;
    }
    private async generateShareLinkAsync(): Promise<string> {
        const longUrl = encodeURIComponent(this.getOrderUrl());
        const bitlyRequestUrl = constants.BITLY_ENDPOINT + '/v3/shorten?' +
                                     'access_token=' + constants.BITLY_ACCESS_TOKEN +
                                     '&longUrl=' + longUrl;
        const response = await fetch(bitlyRequestUrl);
        const responseBody = await response.text();
        if (response.status !== 200) {
            // TODO: Show error message in UI
            utils.consoleLog(`Unexpected status code: ${response.status} -> ${responseBody}`);
            return '';
        }
        const bodyObj = JSON.parse(responseBody);
        return (bodyObj as any).data.url;
    }
    private getOrderUrl() {
        const order = utils.generateOrder(this.props.sideToAssetToken,
            this.props.orderExpiryTimestamp, this.props.orderTakerAddress,
            this.props.orderMakerAddress, this.props.orderSignatureData);
        const orderJSONString = JSON.stringify(order);
        const orderUrl = `${constants.BASE_URL}/?order=${orderJSONString}`;
        return orderUrl;
    }
}
