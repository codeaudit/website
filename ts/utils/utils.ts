import * as _ from 'lodash';
import * as dateFormat from 'dateformat';
import {SideToAssetToken} from 'ts/types';

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
        const unixTimestampMili = unixTimestampSec * 1000;
        const d = new Date(unixTimestampMili);
        return d;
    },
    convertToReadableDateTimeFromUnixTimestamp(unixTimestampSec: number): string {
        const d = this.convertToDateTimeFromUnixTimestamp(unixTimestampSec);
        const formattedDate: string = dateFormat(d, 'h:MMtt mmmm dS yyyy');
        return formattedDate;
    },
    generateOrderJSON(sideToAssetToken: SideToAssetToken, orderExpiryTimestamp: number, orderTakerAddress: string) {
        const order = {
            assetTokens: sideToAssetToken,
            expiry: orderExpiryTimestamp,
            signedHash: 'TODO',
            taker: orderTakerAddress,
        };
        return JSON.stringify(order, null, '\t');
    },
};
