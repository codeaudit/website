import * as _ from 'lodash';
import Web3 = require('web3');
import * as BigNumber from 'bignumber.js';
import promisify = require('es6-promisify');
import {Dispatcher} from 'ts/redux/dispatcher';
import {Provider} from 'ts/provider';
import {utils} from 'ts/utils/utils';
import {Side} from 'ts/types';
import {tradeHistoryStorage} from 'ts/local_storage/trade_history_storage';

export class Web3Wrapper {
    private dispatcher: Dispatcher;
    private web3: Web3;
    private provider: Provider;
    private watchNetworkAndBalanceIntervalId: number;
    constructor(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
        // Once page loaded, we can instantiate provider
        this.provider = new Provider();
        this.web3 = new Web3();
        this.web3.setProvider(this.provider.getProviderObj());

        this.startEmittingNetworkConnectionAndUserBalanceStateAsync();
    }
    public doesExist() {
        return !_.isUndefined(this.web3);
    }
    public isAddress(address: string) {
        if (!this.doesExist()) {
            return false;
        }
        return this.web3.isAddress(address);
    }
    public getProviderObj() {
        return this.provider.getProviderObj();
    }
    public async getFirstAccountIfExistsAsync() {
        const addresses = await promisify(this.web3.eth.getAccounts)();
        if (_.isEmpty(addresses)) {
            return '';
        }
        return (addresses as string[])[0];
    }
    public async getNetworkIdIfExists() {
        if (!this.doesExist()) {
            return undefined;
        }

        try {
            const networkId = await this.getNetworkAsync();
            return Number(networkId);
        } catch (err) {
            return undefined;
        }
    }
    public async getBalanceInEthAsync(owner: string): Promise<BigNumber> {
        const balanceInWei = await promisify(this.web3.eth.getBalance)(owner);
        const balanceEth = this.web3.fromWei(balanceInWei, 'ether');
        return balanceEth;
    }
    public async doesContractExistAtAddressAsync(address: string): Promise<boolean> {
        const code = await promisify(this.web3.eth.getCode)(address);
        return code !== '0x0';
    }
    // Note: since `sign` is overloaded to be both a sync and async method, it doesn't play nice
    // with our callAsync method. We therefore handle it here as a special case.
    public async signTransactionAsync(address: string, message: string): Promise<string> {
        const signData = await promisify(this.web3.eth.sign)(address, message);
        return signData;
    }
    public async getBlockTimestampAsync(blockHash: string): Promise<number> {
        const blockObj = await promisify(this.web3.eth.getBlock)(blockHash);
        return blockObj.timestamp;
    }
    public destroy() {
        this.stopEmittingNetworkConnectionAndUserBalanceStateAsync();
    }
    private async getNetworkAsync() {
        const networkId = await promisify(this.web3.version.getNetwork)();
        return networkId;
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
}
