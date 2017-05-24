import * as _ from 'lodash';
import BN = require('bn.js');
import * as BigNumber from 'bignumber.js';
import ethUtil = require('ethereumjs-util');
import ethABI = require('ethereumjs-abi');
import {constants} from 'ts/utils/constants';
import {SolidityTypes} from 'ts/types';

const MAX_DIGITS_IN_UNSIGNED_256_INT = 78;

export const zeroEx = {
    getOrderHash(exchangeContractAddr: string, makerAddr: string, takerAddr: string,
                 depositTokenAddr: string, receiveTokenAddr: string, feeRecipient: string,
                 depositAmt: BigNumber.BigNumber, receiveAmt: BigNumber.BigNumber,
                 makerFee: BigNumber.BigNumber, takerFee: BigNumber.BigNumber,
                 expiration: BigNumber.BigNumber, salt: BigNumber.BigNumber): string {
        takerAddr = takerAddr !== '' ? takerAddr : constants.NULL_ADDRESS;
        const orderParts = [
            exchangeContractAddr,
            makerAddr,
            takerAddr,
            depositTokenAddr,
            receiveTokenAddr,
            feeRecipient,
            depositAmt,
            receiveAmt,
            makerFee,
            takerFee,
            expiration,
            salt,
        ];
        const buffHash = this.solSHA3(orderParts);
        const buffHashHex = ethUtil.bufferToHex(buffHash);
        return buffHashHex;
    },
    /*
     * We convert types from JS to Solidity as follows:
     * BigNumber -> uint256
     * number -> uint8
     * string -> string
     * boolean -> bool
     * valid Ethereum address -> address
     */
    solSHA3(args: any[]): Buffer {
        const argTypes: string[] = [];
        _.each(args, (arg, i) => {
            const isNumber = _.isFinite(arg);
            if (isNumber) {
                argTypes.push(SolidityTypes.uint8);
            } else if (_.isObject(arg) && (arg as BigNumber.BigNumber).isBigNumber) {
                argTypes.push(SolidityTypes.uint256);
                args[i] = new BN(arg.toString(), 10);
            } else if (ethUtil.isValidAddress(arg)) {
                argTypes.push(SolidityTypes.address);
            } else if (_.isString(arg)) {
                argTypes.push(SolidityTypes.string);
            } else if  (_.isBoolean(arg)) {
                argTypes.push(SolidityTypes.bool);
            } else {
                throw new Error(`Unable to guess arg type: ${arg}`);
            }
        });
        const hash = ethABI.soliditySHA3(argTypes, args);
        return hash;
    },
    // A unit amount is defined as the amount of a currency just above the decimal places.
    // E.g: If a currency has 18 decimal places, 1e18 or one quintillion of the currency is equivalent
    // to 1 unit.
    toUnitAmount(amount: BigNumber.BigNumber, decimals: number): BigNumber.BigNumber {
      const aUnit = new BigNumber(10).pow(decimals);
      const unit = amount.div(aUnit);
      return unit;
    },
    // A baseUnit is defined as the smallest denomination of a currency. An amount expressed in baseUnits
    // is the amount expressed in the smallest denomination.
    // E.g: 1 unit of a currency with 18 decimal places is expressed in baseUnits as 1000000000000000000
    toBaseUnitAmount(amount: BigNumber.BigNumber, decimals: number): BigNumber.BigNumber {
      const unit = new BigNumber(10).pow(decimals);
      const baseUnitAmount = amount.times(unit);
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
        const msgHashBuff = ethUtil.hashPersonalMessage(orderHashBuf);
        try {
            const pubKey = ethUtil.ecrecover(msgHashBuff, v, ethUtil.toBuffer(r), ethUtil.toBuffer(s));
            const retrievedAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));
            return retrievedAddress === makerAddress;
        } catch (err) {
            return false;
        }
    },
    generateSalt(): BigNumber.BigNumber {
        // BigNumber.random returns a random number between 0 & 1 with a passed in number of decimal
        // places. Source: https://mikemcl.github.io/bignumber.js/#random
        const randomNumber = BigNumber.random(MAX_DIGITS_IN_UNSIGNED_256_INT);
        const factor = new BigNumber(10).pow(MAX_DIGITS_IN_UNSIGNED_256_INT - 1);
        const salt = randomNumber.times(factor).round();
        return salt;
    },
};
