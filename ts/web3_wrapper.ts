import * as _ from 'lodash';
import Web3 = require('web3');
import {Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {utils} from 'ts/utils/utils';
import {updateNetworkId} from 'ts/redux/actions';

export class Web3Wrapper {
    private dispatch: Dispatch<State>;
    private syncMethods: string[];
    private callbackMethods: string[];
    private web3: Web3;
    private watchNetworkIntervalId: number;
    constructor(web3Instance: Web3, dispatch: Dispatch<State>) {
        this.dispatch = dispatch;
        this.syncMethods = [
            'isAddress',
            'toWei',
        ];
        this.callbackMethods = [
            'version.getNetwork',
            'eth.getAccounts',
        ];

        if (_.isUndefined(web3Instance) || _.isNull(web3Instance)) {
            this.web3 = null;
        } else {
            this.web3 = web3Instance;
        }

        this.watchNetworkIntervalId = null;
        this.startEmittingNetworkConnectionStateAsync();
    }
    public doesExist() {
        return !_.isNull(this.web3);
    }
    public async getFirstAccountIfExistsAsync() {
        const addresses = await this.callAsync('eth.getAccounts');
        if (_.isEmpty(addresses)) {
            return null;
        }
        return (addresses as string[])[0];
    }
    public async getNetworkIdIfExists() {
        if (!this.doesExist()) {
            return null;
        }

        try {
            const networkId = await this.callAsync('version.getNetwork');
            return Number(networkId);
        } catch (err) {
            return null;
        }
    }
    // Note: since `sign` is overloaded to be both a sync and async method, it doesn't play nice
    // with our callAsync method. We therefore handle it here as a special case.
    public async signTransactionAsync(address: string, message: string) {
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
        this.stopEmittingNetworkConnectionStateAsync();
    }
    private async startEmittingNetworkConnectionStateAsync() {
        if (!_.isNull(this.watchNetworkIntervalId)) {
            return; // we are already emitting the state
        }

        let prevNetworkId = await this.getNetworkIdIfExists();
        this.dispatch(updateNetworkId(prevNetworkId));
        this.watchNetworkIntervalId = window.setInterval(async () => {
            const currentNetworkId = await this.getNetworkIdIfExists();
            if (currentNetworkId !== prevNetworkId) {
                prevNetworkId = currentNetworkId;
                this.dispatch(updateNetworkId(currentNetworkId));
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
    private stopEmittingNetworkConnectionStateAsync() {
        clearInterval(this.watchNetworkIntervalId);
    }
}
