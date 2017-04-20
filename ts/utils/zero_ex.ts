import * as _ from 'lodash';
import BN = require('bn.js');
import BigNumber = require('bignumber.js');
import ethUtil = require('ethereumjs-util');
import {constants} from 'ts/utils/constants';

export const zeroEx = {
    getOrderHash(exchangeContractAddr: string, makerAddr: string, takerAddr: string,
                 depositTokenAddr: string, receiveTokenAddr: string, feeRecipient: string,
                 depositAmt: BigNumber, receiveAmt: BigNumber, makerFee: string, takerFee: string,
                 expiration: number): string {
        takerAddr = takerAddr !== '' ? takerAddr : constants.NULL_ADDRESS;
        const orderParts = [
            exchangeContractAddr,
            makerAddr,
            takerAddr,
            depositTokenAddr,
            receiveTokenAddr,
            feeRecipient,
            depositAmt.toString(),
            receiveAmt.toString(),
            makerFee,
            takerFee,
            expiration,
        ];
        const buffHash = this.sha3(orderParts);
        const buffHashHex = ethUtil.bufferToHex(buffHash);
        return buffHashHex;
    },
    sha3(params: Array<(string | number | Buffer)>) {
        const messageBuffs = _.map(params, (param) => {
            if (!ethUtil.isHexString(param) && !isNaN(param as number)) {
                return this.numberToBuffer(param);
            }
            if (param === '0x0') {
                return ethUtil.setLength(ethUtil.toBuffer(param), 20);
            }
            return ethUtil.toBuffer(param);
        });
        const hash = ethUtil.sha3(Buffer.concat(messageBuffs));
        return hash;
    },
    numberToBuffer(n: number) {
        const size = 32;
        const endian = 'be';
        return new BN(n.toString()).toArrayLike(Buffer, endian, size);
    },
    // A unit amount is defined as the amount of a currency just above the decimal places.
    // E.g: If a currency has 18 decimal places, 1e18 or one quintillion of the currency is equivalent
    // to 1 unit.
    toUnitAmount(amount: BigNumber, decimals: number): BigNumber {
      const aUnit = new BigNumber(10).pow(decimals);
      const unit = amount.div(aUnit);
      return unit;
    },
    // A baseUnit is defined as the smallest denomination of a currency. An amount expressed in baseUnits
    // is the amount expressed in the smallest denomination.
    // E.g: 1 unit of a currency with 18 decimal places is expressed in baseUnits as 1000000000000000000
    toBaseUnitAmount(amount: number, decimals: number): BigNumber {
      const amountBn = new BigNumber(amount);
      const unit = new BigNumber(10).pow(decimals);
      const baseUnitAmount = amountBn.times(unit);
      return baseUnitAmount;
    },
    isValidOrderHash(orderHash: string): boolean {
        if (_.isString(orderHash) &&
            orderHash.length === 66 &&
            orderHash.substring(0, 2) === '0x') {
            return true;
        }
        return false;
    },
    isValidSignature(orderHash: string, v: number, r: string, s: string, makerAddress: string) {
        const orderHashBuf = ethUtil.toBuffer(orderHash);
        const personalMessageHash = ethUtil.hashPersonalMessage(orderHashBuf);
        try {
            const pubKey = ethUtil.ecrecover(personalMessageHash, v, ethUtil.toBuffer(r), ethUtil.toBuffer(s));
            const retrievedAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));
            console.log('retrievedAddress', retrievedAddress);
            console.log('makerAddress', makerAddress);
            return retrievedAddress === makerAddress;
        } catch (err) {
            return false;
        }
    },
};
