import * as _ from 'lodash';
import BN = require('bn.js');
import ethUtil = require('ethereumjs-util');

export const Ox = {
    getOrderHash(exchangeContractAddr: string, makerAddr: string, takerAddr: string,
                 depositTokenAddr: string, receiveTokenAddr: string, depositAmt: number,
                 receiveAmt: number, expiration: number): Buffer {
        const orderParts = [
            exchangeContractAddr,
            makerAddr,
            takerAddr,
            depositTokenAddr,
            receiveTokenAddr,
            depositAmt,
            receiveAmt,
            expiration,
        ];
        const buffHash = this.sha3(orderParts);
        return buffHash;
    },
    getMessageHash(orderHash: Buffer, feeRecipientAddress: string, makerFee: number, takerFee: number) {
        const message = [
            orderHash,
            feeRecipientAddress,
            makerFee,
            takerFee,
        ];
        const messageHash = this.sha3(message);
        const personalMessageHash = ethUtil.hashPersonalMessage(messageHash);
        const personalMessageHashHex = ethUtil.bufferToHex(personalMessageHash);
        return personalMessageHashHex;
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
};
