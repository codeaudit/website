import * as _ from 'lodash';
import Web3 = require('web3');
import * as BigNumber from 'bignumber.js';
import promisify = require('es6-promisify');
import {Dispatcher} from 'ts/redux/dispatcher';
import {utils} from 'ts/utils/utils';
import {configs} from 'ts/utils/configs';
import {constants} from 'ts/utils/constants';
import {Side, Environments} from 'ts/types';
import ProviderEngine = require('web3-provider-engine');
import FilterSubprovider = require('web3-provider-engine/subproviders/filters');
import RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

export class Web3Wrapper {
    private dispatcher: Dispatcher;
    private injectedWeb3: Web3;
    private publicWeb3: Web3;
    private networkId: number;
    private watchNetworkAndBalanceIntervalId: number;
    constructor(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;

        const rawWeb3 = (window as any).web3;
        const doesInjectectedWeb3InstanceExist = !_.isUndefined(rawWeb3);
        if (doesInjectectedWeb3InstanceExist) {
            this.injectedWeb3 = new Web3();
            this.injectedWeb3.setProvider(rawWeb3.currentProvider);
        }

        const publicProviderObj = this.getPublicNodeProvider();
        this.publicWeb3 = new Web3();
        this.publicWeb3.setProvider(publicProviderObj);

        this.startEmittingNetworkConnectionAndUserBalanceStateAsync();
    }
    public isAddress(address: string) {
        const doesPreferInjectedWeb3 = false;
        const web3 = this.getPreferredWeb3Instance(doesPreferInjectedWeb3);
        return web3.isAddress(address);
    }
    public getInjectedProviderObj() {
        return this.injectedWeb3.currentProvider;
    }
    public async getFirstAccountIfExistsAsync() {
        const doesPreferInjectedWeb3 = true;
        const web3 = this.getPreferredWeb3Instance(doesPreferInjectedWeb3);
        const addresses = await promisify(web3.eth.getAccounts)();
        if (_.isEmpty(addresses)) {
            return '';
        }
        return (addresses as string[])[0];
    }
    public async getNetworkIdIfExists() {
        try {
            const networkId = await this.getNetworkAsync();
            return Number(networkId);
        } catch (err) {
            return undefined;
        }
    }
    public async getBalanceInEthAsync(owner: string): Promise<BigNumber> {
        const doesPreferInjectedWeb3 = false;
        const web3 = this.getPreferredWeb3Instance(doesPreferInjectedWeb3);
        const balanceInWei = await promisify(web3.eth.getBalance)(owner);
        const balanceEth = web3.fromWei(balanceInWei, 'ether');
        return balanceEth;
    }
    public async doesContractExistAtAddressAsync(address: string): Promise<boolean> {
        const doesPreferInjectedWeb3 = false;
        const web3 = this.getPreferredWeb3Instance(doesPreferInjectedWeb3);
        const code = await promisify(web3.eth.getCode)(address);
        return code !== '0x0';
    }
    // Note: since `sign` is overloaded to be both a sync and async method, it doesn't play nice
    // with our callAsync method. We therefore handle it here as a special case.
    public async signTransactionAsync(address: string, message: string): Promise<string> {
        const doesPreferInjectedWeb3 = true;
        const web3 = this.getPreferredWeb3Instance(doesPreferInjectedWeb3);
        const signData = await promisify(web3.eth.sign)(address, message);
        return signData;
    }
    public async getBlockTimestampAsync(blockHash: string): Promise<number> {
        const doesPreferInjectedWeb3 = false;
        const web3 = this.getPreferredWeb3Instance(doesPreferInjectedWeb3);
        const blockObj = await promisify(web3.eth.getBlock)(blockHash);
        return blockObj.timestamp;
    }
    public destroy() {
        this.stopEmittingNetworkConnectionAndUserBalanceStateAsync();
    }
    public getPreferredProviderObj(doesPreferInjected: boolean) {
        const web3 = this.getPreferredWeb3Instance(doesPreferInjected);
        return web3.currentProvider;
    }
    private doesInjectedWeb3Exist() {
        return !_.isUndefined(this.injectedWeb3);
    }
    private getPreferredWeb3Instance(doesPreferInjected: boolean) {
        if (this.doesInjectedWeb3Exist()) {
            if (doesPreferInjected) {
                return this.injectedWeb3;
            } else {
                const publicWeb3Instance = this.getPublicWeb3();
                const hasPublicInstanceWithSameNetworkIdAsInjectedInstance = !_.isUndefined(publicWeb3Instance);
                if (!hasPublicInstanceWithSameNetworkIdAsInjectedInstance) {
                    return this.injectedWeb3;
                }
                return publicWeb3Instance;
            }
        } else {
            return this.publicWeb3;
        }
    }
    private getPublicWeb3() {
        switch (this.networkId) {
            case 42:
                return this.publicWeb3;

            default:
                return undefined;
        }
    }
    private async getNetworkAsync() {
        const web3 = this.doesInjectedWeb3Exist() ? this.injectedWeb3 : this.publicWeb3;
        const networkId = await promisify(web3.version.getNetwork)();
        return networkId;
    }
    private async startEmittingNetworkConnectionAndUserBalanceStateAsync() {
        if (!_.isUndefined(this.watchNetworkAndBalanceIntervalId)) {
            return; // we are already emitting the state
        }

        let prevUserEtherBalanceInWei = new BigNumber(0);
        let prevUserAddress: string;
        this.dispatcher.updateNetworkId(undefined);
        this.watchNetworkAndBalanceIntervalId = window.setInterval(async () => {
            // Check for network state changes
            const currentNetworkId = await this.getNetworkIdIfExists();
            if (currentNetworkId !== this.networkId) {
                this.networkId = currentNetworkId;
                this.dispatcher.updateNetworkId(currentNetworkId);
            }

            const userAddressIfExists = await this.getFirstAccountIfExistsAsync();
            // Update makerAddress on network change
            if (prevUserAddress !== userAddressIfExists) {
                prevUserAddress = userAddressIfExists;
                this.dispatcher.updateUserAddress(userAddressIfExists);
            }

            // Check for user ether balance changes
            if (userAddressIfExists !== '') {
                const balance = await this.getBalanceInEthAsync(userAddressIfExists);
                if (!balance.eq(prevUserEtherBalanceInWei)) {
                    prevUserEtherBalanceInWei = balance;
                    this.dispatcher.updateUserEtherBalance(balance);
                }
            }
        }, 1000);
    }
    private stopEmittingNetworkConnectionAndUserBalanceStateAsync() {
        clearInterval(this.watchNetworkAndBalanceIntervalId);
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
