import * as _ from 'lodash';
import Web3 = require('web3');
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {configs} from 'ts/utils/configs';
import {ProviderTypes} from 'ts/types';
import ProviderEngine = require('web3-provider-engine');
import FilterSubprovider = require('web3-provider-engine/subproviders/filters');
import RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

export class Provider {
    private providerType: ProviderTypes;
    private providerTypesToNames: {[providerType: string]: string};
    private providerObj: any; // TODO: add a ProviderEngine interface declaration
    private unusedLocalWebProviderObj: any;
    constructor() {
        this.providerTypesToNames = {
            [ProviderTypes.publicNode]: 'Infura.io',
            [ProviderTypes.injectedWeb3]: '',
        };
        // When a user switches from a local provider to the public node, we keep a copy of the unused
        // local provider in case they want to switch back to it later.
        // Note: This is only set when they switch away from using the local provider and is otherwise undefined

        const rawWeb3 = (window as any).web3;
        // TODO: make this existence check more robust
        const doesWeb3InstanceExist = !_.isUndefined(rawWeb3);
        if (doesWeb3InstanceExist) {
            this.providerObj = rawWeb3.currentProvider;
            this.providerType = ProviderTypes.injectedWeb3;
            this.providerTypesToNames[this.providerType] = this.discoverLocalWeb3ProviderName();
        } else {
            // TODO: remove throw here once we've deployed to the public TESTNET
            throw new Error('Accessing dapp without web3 injected into the browser');
            // this.providerObj = this.getPublicNodeProvider();
            // this.providerType = ProviderTypes.publicNode;
        }
    }
    public getProviderObj() {
        return this.providerObj;
    }
    public getProviderType() {
        return this.providerType;
    }
    public getProviderNameForType(providerType: ProviderTypes) {
        this.assertProviderType(providerType);
        return this.providerTypesToNames[providerType];
    }
    public canSendTransactions() {
        return configs.PROVIDER_CONFIGS[this.providerType].canSendTransactions;
    }
    public updateProvider(newProviderType: ProviderTypes) {
        this.assertProviderType(newProviderType);

        if (this.providerObj.stop) {
            this.providerObj.stop();
        }
        // If current provider is injectedWeb3, we need to save the provider instance so we could switch
        // back to it later
        const currentProviderType = this.providerType;
        if (currentProviderType === ProviderTypes.injectedWeb3) {
            this.unusedLocalWebProviderObj = this.providerObj;
        }

        switch (newProviderType) {
            case ProviderTypes.publicNode:
                this.providerObj = this.getPublicNodeProvider();
                break;
            case ProviderTypes.injectedWeb3:
                this.providerObj = this.unusedLocalWebProviderObj;
                this.unusedLocalWebProviderObj = undefined;
                break;
            default: {
                throw utils.spawnSwitchErr('providerType', newProviderType);
            }
        }
        this.providerType = newProviderType;
    }
    private assertProviderType(providerType: ProviderTypes) {
        utils.assert(!_.isUndefined(ProviderTypes[providerType]),
            'Can only set provider to a valid provider type listed in ProviderTypes');
    }
    // Defaults to Infura.io Testnet
    private getPublicNodeProvider() {
        const providerObj = this.getClientSideFilteringProvider(constants.INFURA_TESTNET_URL);
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
    private discoverLocalWeb3ProviderName() {
        if (this.providerObj.isMetaMask) {
            return 'Metamask';
        } else {
            // Default to showing the provider classname
            return this.providerObj.constructor.name;
        }
    }
}
