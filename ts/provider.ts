import * as _ from 'lodash';
import Web3 = require('web3');
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {configs} from 'ts/utils/configs';
import ProviderEngine = require('web3-provider-engine');
import FilterSubprovider = require('web3-provider-engine/subproviders/filters');
import RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

export class Provider {
    private providerObj: any; // TODO: add a ProviderEngine interface declaration
    constructor() {
        const rawWeb3 = (window as any).web3;
        // TODO: make this existence check more robust
        const doesWeb3InstanceExist = !_.isUndefined(rawWeb3);
        if (doesWeb3InstanceExist) {
            this.providerObj = rawWeb3.currentProvider;
        } else {
            this.providerObj = this.getPublicNodeProvider();
        }
    }
    public getProviderObj() {
        return this.providerObj;
    }
    // Defaults to our Kovan node
    private getPublicNodeProvider() {
        const providerObj = this.getClientSideFilteringProvider(constants.HOSTED_TESTNET_URL);
        return providerObj;
    }
    private getClientSideFilteringProvider(rpcUrl: string) {
        const engine = new ProviderEngine();
        engine.addProvider(new FilterSubprovider());
        engine.addProvider(new RpcSubprovider({
            rpcUrl,
        }));
        engine.start();
        return engine;
    }
}
