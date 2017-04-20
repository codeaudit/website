import * as _ from 'lodash';
import * as dateFormat from 'dateformat';
import {SideToAssetToken, SignatureData, Order, Side, TokenByAddress, OrderParty} from 'ts/types';
import deepEqual = require('deep-equal');
import ethUtil = require('ethereumjs-util');

export const utils = {
    assert(condition: boolean, message: string) {
        if (!condition) {
            throw new Error(message);
        }
    },
    spawnSwitchErr(name: string, value: any) {
        return new Error(`Unexpected switch value: ${value} encountered for ${name}`);
    },
    isNumeric(n: string) {
        return !isNaN(parseFloat(n)) && isFinite(Number(n));
    },
    // This default unix timestamp is used for orders where the user does not specify an expiry date.
    // It is a fixed constant so that both the redux store's INITIAL_STATE and components can check for
    // whether a user has set an expiry date or not. It is set unrealistically high so as not to collide
    // with actual values a user would select.
    initialOrderExpiryUnixTimestampSec() {
        const d = new Date('2050');
        return d.getTime() / 1000;
    },
    convertToUnixTimestampSeconds(dateDate: Date, dateTime: Date) {
        const finalDate = !_.isUndefined(dateDate) ? dateDate : new Date();
        if (!_.isUndefined(dateTime)) {
            const hrs = dateTime.getHours();
            const mins = dateTime.getMinutes();
            finalDate.setHours(dateTime.getHours());
            finalDate.setMinutes(dateTime.getMinutes());
        }
        return finalDate.getTime() / 1000;
    },
    convertToDateTimeFromUnixTimestamp(unixTimestampSec: number) {
        const unixTimestampMs = unixTimestampSec * 1000;
        const d = new Date(unixTimestampMs);
        return d;
    },
    convertToReadableDateTimeFromUnixTimestamp(unixTimestampSec: number): string {
        const d = this.convertToDateTimeFromUnixTimestamp(unixTimestampSec);
        const formattedDate: string = dateFormat(d, 'h:MMtt mmmm dS yyyy');
        return formattedDate;
    },
    generateOrder(sideToAssetToken: SideToAssetToken, orderExpiryTimestamp: number,
                  orderTakerAddress: string, orderMakerAddress: string,
                  signatureData: SignatureData, tokenByAddress: TokenByAddress): Order {
        const makerToken = tokenByAddress[sideToAssetToken[Side.deposit].address];
        const takerToken = tokenByAddress[sideToAssetToken[Side.receive].address];
        const order = {
            maker: {
                address: orderMakerAddress,
                token: {
                    name: makerToken.name,
                    symbol: makerToken.symbol,
                    decimals: makerToken.decimals,
                    address: makerToken.address,
                },
                amount: sideToAssetToken[Side.deposit].amount.toString(),
            },
            taker: {
                address: orderTakerAddress,
                token: {
                    name: takerToken.name,
                    symbol: takerToken.symbol,
                    decimals: takerToken.decimals,
                    address: takerToken.address,
                },
                amount: sideToAssetToken[Side.receive].amount.toString(),
            },
            expiration: orderExpiryTimestamp,
            signature: signatureData,
        };
        return order;
    },
    convertByte32HexToString(byte32Hex: string) {
        const buf = ethUtil.toBuffer(byte32Hex);
        return buf.toString().replace(/\0/g, '');
    },
    consoleLog(message: string) {
        /* tslint:disable */
        console.log(message);
        /* tslint:enable */
    },
    sleepAsync(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    deepEqual(actual: any, expected: any, opts?: {strict: boolean}) {
        return deepEqual(actual, expected, opts);
    },
};
