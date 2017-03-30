import * as _ from 'lodash';
import * as dateFormat from 'dateformat';
import {SideToAssetToken, SignatureData} from 'ts/types';
import deepEqual = require('deep-equal');

export const utils = {
    // Utility function to create a K:V from a list of strings
    // Adapted from: https://basarat.gitbooks.io/typescript/content/docs/types/literal-types.html
    strEnum(values: string[]): {[key: string]: string} {
        return _.reduce(values, (result, key) => {
            result[key] = key;
            return result;
        }, Object.create(null));
    },
    assert(condition: boolean, message: string) {
        if (!condition) {
            throw new Error(message);
        }
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
    generateOrderJSON(sideToAssetToken: SideToAssetToken, orderExpiryTimestamp: number,
                      orderTakerAddress: string, orderMakerAddress: string,
                      signatureData: SignatureData) {
        const order = {
            assetTokens: sideToAssetToken,
            expiry: orderExpiryTimestamp,
            maker: orderMakerAddress,
            signature: signatureData,
            taker: orderTakerAddress,
        };
        return JSON.stringify(order, null, '\t');
    },
    convertByte32HexToString(byte32Hex: string) {
        const buf = new Buffer(byte32Hex.substring(2), 'hex');
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
