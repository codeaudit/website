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
};
