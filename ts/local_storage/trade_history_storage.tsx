import * as _ from 'lodash';
import {Fill} from 'ts/types';
import {localStorage} from 'ts/local_storage/local_storage';
import ethUtil = require('ethereumjs-util');

const FILLS_KEY = 'fills';
const FILLS_LATEST_BLOCK = 'fillsLatestBlock';

export const tradeHistoryStorage = {
    addFillToUser(userAddress: string, fill: Fill) {
        const fillsByHash = this.getUserFillsByHash(userAddress);
        const fillHash = this._getFillHash(fill);
        const doesFillExist = !_.isUndefined(fillsByHash[fillHash]);
        if (doesFillExist) {
            return;
        }
        fillsByHash[fillHash] = fill;
        const userFillsJSONString = JSON.stringify(fillsByHash);
        const userFillsKey = `${FILLS_KEY}-${userAddress}`;
        localStorage.setItem(userFillsKey, userFillsJSONString);
    },
    getUserFillsByHash(userAddress: string): {[fillHash: string]: Fill} {
        const userFillsKey = `${FILLS_KEY}-${userAddress}`;
        const userFillsJSONString = localStorage.getItemIfExists(userFillsKey);
        if (_.isEmpty(userFillsJSONString)) {
            return {};
        }
        const userFillsByHash = JSON.parse(userFillsJSONString);
        return userFillsByHash;
    },
    clearUserFillsByHash(userAddress: string) {
        const userFillsKey = `${FILLS_KEY}-${userAddress}`;
        localStorage.removeItem(userFillsKey);
    },
    getFillsLatestBlock(userAddress: string): number {
        const userFillsLatestBlockKey = `${FILLS_LATEST_BLOCK}-${userAddress}`;
        const blockNumberStr = localStorage.getItemIfExists(userFillsLatestBlockKey);
        if (_.isEmpty(blockNumberStr)) {
            return 0; // Start with the genesis block
        }
        const blockNumber = _.parseInt(blockNumberStr);
        return blockNumber;
    },
    setFillsLatestBlock(userAddress: string, blockNumber: number) {
        const userFillsLatestBlockKey = `${FILLS_LATEST_BLOCK}-${userAddress}`;
        localStorage.setItem(userFillsLatestBlockKey, `${blockNumber}`);
    },
    clearFillsLatestBlock(userAddress: string) {
        const userFillsLatestBlockKey = `${FILLS_LATEST_BLOCK}-${userAddress}`;
        localStorage.removeItem(userFillsLatestBlockKey);
    },
    _getFillHash(fill: Fill): string {
        const fillJSON = JSON.stringify(fill);
        const fillHash = ethUtil.sha256(fillJSON);
        return fillHash.toString('hex');
    },
};
