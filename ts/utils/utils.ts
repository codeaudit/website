import * as _ from 'lodash';
import {
    SideToAssetToken,
    SignatureData,
    Order,
    Side,
    TokenByAddress,
    OrderParty,
    ScreenWidths,
    EtherscanLinkSuffixes,
} from 'ts/types';
import * as moment from 'moment';
import deepEqual = require('deep-equal');
import ethUtil = require('ethereumjs-util');
import BigNumber = require('bignumber.js');
import {constants} from 'ts/utils/constants';

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
        const m = moment('2050-01-01');
        return new BigNumber(m.unix());
    },
    convertToUnixTimestampSeconds(date: moment.Moment, time?: moment.Moment): BigNumber {
        const finalMoment = date;
        if (!_.isUndefined(time)) {
            finalMoment.hours(time.hours());
            finalMoment.minutes(time.minutes());
        }
        return new BigNumber(finalMoment.unix());
    },
    convertToMomentFromUnixTimestamp(unixTimestampSec: BigNumber): moment.Moment {
        return moment.unix(unixTimestampSec.toNumber());
    },
    convertToReadableDateTimeFromUnixTimestamp(unixTimestampSec: BigNumber): string {
        const m = this.convertToMomentFromUnixTimestamp(unixTimestampSec);
        const formattedDate: string = m.format('h:MMa MMMM D YYYY');
        return formattedDate;
    },
    generateOrder(networkId: number, exchangeContract: string, sideToAssetToken: SideToAssetToken,
                  orderExpiryTimestamp: BigNumber, orderTakerAddress: string, orderMakerAddress: string,
                  makerFee: BigNumber, takerFee: BigNumber, feeRecipient: string, signatureData: SignatureData,
                  tokenByAddress: TokenByAddress, orderSalt: BigNumber): Order {
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
                feeAmount: makerFee.toString(10),
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
                feeAmount: takerFee.toString(10),
            },
            expiration: orderExpiryTimestamp.toString(10),
            feeRecipient,
            salt: orderSalt.toString(10),
            signature: signatureData,
            exchangeContract,
            networkId,
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
    isUserOnMobile() {
        let check = false;
        const w = window as any;
        // Source: http://detectmobilebrowsers.com/
        /* tslint:disable */
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||w.opera);
        /* tslint:enable */
        return check;
    },
    getEtherScanLinkIfExists(address: string, networkId: number, suffix: EtherscanLinkSuffixes): string {
        const networkName = constants.networkNameById[networkId];
        if (_.isUndefined(networkName)) {
            return undefined;
        }
        const etherScanPrefix = networkName === 'Frontier' ? '' : `${networkName.toLowerCase()}.`;
        return `https://${etherScanPrefix}etherscan.io/${suffix}/${address}`;
    },
};
