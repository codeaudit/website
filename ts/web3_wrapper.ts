import * as _ from 'lodash';
import Web3 = require('web3');
import {Dispatcher} from 'ts/redux/dispatcher';
import {utils} from 'ts/utils/utils';
import {Side} from 'ts/types';
import BigNumber = require('bignumber.js');
import {tradeHistoryStorage} from 'ts/local_storage/trade_history_storage';

export class Web3Wrapper {
    private dispatcher: Dispatcher;
    private syncMethods: string[];
    private callbackMethods: string[];
    private web3: Web3;
    private watchNetworkAndBalanceIntervalId: number;
    constructor(web3Instance: Web3, dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
        this.syncMethods = [
            'isAddress',
            'toWei',
            'eth.getBalance',
            'fromWei',
        ];
        this.callbackMethods = [
            'version.getNetwork',
            'eth.getAccounts',
        ];

        if (!_.isUndefined(web3Instance) && !_.isNull(web3Instance)) {
            this.web3 = web3Instance;
        }

        this.startEmittingNetworkConnectionAndUserBalanceStateAsync();
    }
    public doesExist() {
        return !_.isUndefined(this.web3);
    }
    public async getFirstAccountIfExistsAsync() {
        const addresses = await this.callAsync('eth.getAccounts');
        if (_.isEmpty(addresses)) {
            return undefined;
        }
        return (addresses as string[])[0];
    }
    public async getNetworkIdIfExists() {
        if (!this.doesExist()) {
            return undefined;
        }

        try {
            const networkId = await this.callAsync('version.getNetwork');
            return Number(networkId);
        } catch (err) {
            return undefined;
        }
    }
    public getBalanceInEthAsync(owner: string): Promise<BigNumber> {
        return new Promise((resolve, reject) => {
            this.web3.eth.getBalance(owner, (err: Error, balanceInWei: any) => {
                if (err) {
                    reject(err);
                } else {
                    const balanceEth = this.call('fromWei', [(balanceInWei as BigNumber), 'ether']);
                    resolve(balanceEth);
                }
            });
        });
    }
    public doesContractExistAtAddressAsync(address: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.web3.eth.getCode(address, (err: Error, code: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(code !== '0x0');
                }
            });
        });
    }
    // Note: since `sign` is overloaded to be both a sync and async method, it doesn't play nice
    // with our callAsync method. We therefore handle it here as a special case.
    public signTransactionAsync(address: string, message: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.web3.eth.sign(address, message, (err: Error, signData: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(signData);
                }
            });
        });
    }
    public getBlockTimestampAsync(blockHash: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.web3.eth.getBlock(blockHash, (err: Error, blockObject: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(blockObject.timestamp);
                }
            });
        });
    }
    public get(propertyPath: string) {
        const propPathSegments = propertyPath.split('.');
        let web3SubObj = this.web3 as any;
        _.each(propPathSegments, (prop) => {
            web3SubObj = web3SubObj[prop];
        });
        return web3SubObj;
    }
    public call(methodPath: string, args?: any[]) {
        utils.assert(this.doesExist(), 'Called web3Wrapper.call without valid web3 instance.');
        const isAllowedSyncMethod = _.indexOf(this.syncMethods, methodPath) !== -1;
        utils.assert(isAllowedSyncMethod, 'methodPath must \
        be a string and must be included in web3\'s syncMethods array.');

        args = _.isUndefined(args) ? [] : args;
        const {methodInstance, web3SubObj} = this.getWeb3SubObjAndMethodInstanceFromMethodPath(methodPath);

        const result = methodInstance.call(web3SubObj, ...args);
        return result;
    }
    public async callAsync(methodPath: string, args?: any[]) {
        utils.assert(this.doesExist(), 'Called web3Wrapper.callAsync without valid web3 instance.');
        const isAllowedAsyncMethod = _.indexOf(this.callbackMethods, methodPath) !== -1;
        utils.assert(isAllowedAsyncMethod, 'methodPath must \
        be a string and must be included in web3Wrapper\'s callbackMethods array.');

        args = _.isUndefined(args) ? [] : args;
        const {methodInstance, web3SubObj} = this.getWeb3SubObjAndMethodInstanceFromMethodPath(methodPath);

        return new Promise((resolve, reject) => {
            methodInstance.call(web3SubObj, ...args, (err: Error, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    public destroy() {
        this.stopEmittingNetworkConnectionAndUserBalanceStateAsync();
    }
    private async startEmittingNetworkConnectionAndUserBalanceStateAsync() {
        if (!_.isUndefined(this.watchNetworkAndBalanceIntervalId)) {
            return; // we are already emitting the state
        }

        let prevNetworkId: number;
        let prevUserEtherBalanceInWei = new BigNumber(0);
        let prevUserAddress: string;
        this.dispatcher.updateNetworkId(prevNetworkId);
        this.watchNetworkAndBalanceIntervalId = window.setInterval(async () => {
            // Check for network state changes
            const currentNetworkId = await this.getNetworkIdIfExists();
            if (currentNetworkId !== prevNetworkId) {
                prevNetworkId = currentNetworkId;
                if (!_.isUndefined(prevUserAddress)) {
                    tradeHistoryStorage.clearUserFillsByHash(prevUserAddress);
                    tradeHistoryStorage.clearFillsLatestBlock(prevUserAddress);
                }
                this.dispatcher.updateNetworkId(currentNetworkId);
            }

            const userAddressIfExists = await this.getFirstAccountIfExistsAsync();
            // Update makerAddress on network change
            if (prevUserAddress !== userAddressIfExists) {
                prevUserAddress = userAddressIfExists;
                this.dispatcher.updateUserAddress(userAddressIfExists);
            }

            // Check for user ether balance changes
            if (!_.isUndefined(userAddressIfExists)) {
                const balance = await this.getBalanceInEthAsync(userAddressIfExists);
                if (!balance.eq(prevUserEtherBalanceInWei)) {
                    prevUserEtherBalanceInWei = balance;
                    this.dispatcher.updateUserEtherBalance(balance);
                }
            }
        }, 1000);
    }
    private getWeb3SubObjAndMethodInstanceFromMethodPath(methodPath: string) {
        const methodPathSegments = methodPath.split('.');
        const methodName = methodPathSegments[methodPathSegments.length - 1];
        const intermediaryObjs = methodPathSegments.slice(0, methodPathSegments.length - 1);
        let web3SubObj = this.web3 as any;
        _.each(intermediaryObjs, (objName: string) => {
            web3SubObj = web3SubObj[objName];
        });
        const methodInstance = web3SubObj[methodName];
        return {methodInstance, web3SubObj};
    }
    private stopEmittingNetworkConnectionAndUserBalanceStateAsync() {
        clearInterval(this.watchNetworkAndBalanceIntervalId);
    }
}
