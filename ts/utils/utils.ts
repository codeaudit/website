import * as _ from 'lodash';
import * as dateFormat from 'dateformat';
import {
    SideToAssetToken,
    SignatureData,
    Order,
    Side,
    TokenByAddress,
    OrderParty,
    ScreenWidths,
} from 'ts/types';
import deepEqual = require('deep-equal');
import ethUtil = require('ethereumjs-util');
import BigNumber = require('bignumber.js');

const LG_MIN_EM = 64;
const MD_MIN_EM = 52;

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
    initialOrderExpiryUnixTimestampSec(): BigNumber {
        const d = new Date('2050');
        return new BigNumber(d.getTime() / 1000);
    },
    convertToUnixTimestampSeconds(dateDate: Date, dateTime: Date): BigNumber {
        const finalDate = !_.isUndefined(dateDate) ? dateDate : new Date();
        if (!_.isUndefined(dateTime)) {
            const hrs = dateTime.getHours();
            const mins = dateTime.getMinutes();
            finalDate.setHours(dateTime.getHours());
            finalDate.setMinutes(dateTime.getMinutes());
        }
        return new BigNumber(finalDate.getTime() / 1000);
    },
    convertToDateTimeFromUnixTimestamp(unixTimestampSec: BigNumber) {
        const unixTimestampMs = unixTimestampSec.times(1000);
        const d = new Date(unixTimestampMs.toNumber());
        return d;
    },
    convertToReadableDateTimeFromUnixTimestamp(unixTimestampSec: BigNumber): string {
        const d = this.convertToDateTimeFromUnixTimestamp(unixTimestampSec);
        const formattedDate: string = dateFormat(d, 'h:MMtt mmmm dS yyyy');
        return formattedDate;
    },
    generateOrder(sideToAssetToken: SideToAssetToken, orderExpiryTimestamp: BigNumber,
                  orderTakerAddress: string, orderMakerAddress: string,
                  signatureData: SignatureData, tokenByAddress: TokenByAddress, orderSalt: BigNumber): Order {
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
                amount: sideToAssetToken[Side.deposit].amount.toString(10),
            },
            taker: {
                address: orderTakerAddress,
                token: {
                    name: takerToken.name,
                    symbol: takerToken.symbol,
                    decimals: takerToken.decimals,
                    address: takerToken.address,
                },
                amount: sideToAssetToken[Side.receive].amount.toString(10),
            },
            expiration: orderExpiryTimestamp.toString(10),
            salt: orderSalt.toString(10),
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
    getColSize(items: number) {
        const bassCssGridSize = 12; // Source: http://basscss.com/#basscss-grid
        const colSize = 12 / items;
        if (!_.isInteger(colSize)) {
            throw new Error('Number of cols must be divisible by 12');
        }
        return colSize;
    },
    getScreenWidth() {
        const documentEl = document.documentElement;
        const body = document.getElementsByTagName('body')[0];
        const widthInPx = window.innerWidth || documentEl.clientWidth || body.clientWidth;
        const bodyStyles: any = window.getComputedStyle(document.querySelector('body'));
        const widthInEm = widthInPx / parseFloat(bodyStyles['font-size']);

        // This logic mirrors the CSS media queries in BassCSS for the `lg-`, `md-` and `sm-` CSS
        // class prefixes. Do not edit these.
        if (widthInEm > LG_MIN_EM) {
            return ScreenWidths.LG;
        } else if (widthInEm > MD_MIN_EM) {
            return ScreenWidths.MD;
        } else {
            return ScreenWidths.SM;
        }
    },
};
