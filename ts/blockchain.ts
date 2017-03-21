import * as _ from 'lodash';
import * as Web3 from 'web3';
import {Dispatch} from 'redux';
import contract = require('truffle-contract');
import {State} from 'ts/redux/reducer';
import {Provider} from 'ts/provider';
import {BlockchainErrs} from 'ts/types';
import {constants} from 'ts/utils/constants';
import {Web3Wrapper} from 'ts/web3_wrapper';
import {
    encounteredBlockchainError,
    updateBlockchainIsLoaded,
    updateSignatureData,
} from 'ts/redux/actions';
import * as ExchangeArtifacts from '../contracts/Exchange.json';

export class Blockchain {
    private dispatch: Dispatch<State>;
    private web3Wrapper: Web3Wrapper;
    private provider: Provider;
    private exchange: any; // TODO: add type definition for Contract
    private prevNetworkId: number;
    constructor(dispatch: Dispatch<State>) {
        this.dispatch = dispatch;
        this.web3Wrapper = null;
        this.provider = null;
        this.prevNetworkId = null;
        this.onPageLoadInitFireAndForgetAsync();
    }
    public async networkIdUpdatedFireAndForgetAsync(networkId: number) {
        const isConnected = !_.isNull(networkId);
        if (!isConnected) {
            this.prevNetworkId = networkId;
            this.dispatch(encounteredBlockchainError(BlockchainErrs.DISCONNECTED_FROM_ETHEREUM_NODE));
        } else if (this.prevNetworkId !== networkId) {
            this.prevNetworkId = networkId;
            this.dispatch(encounteredBlockchainError(''));
            await this.instantiateContractAsync();
        }
    }
    public getExchangeContractAddress() {
        return this.exchange.address;
    }
    public async getFirstAccountIfExistsAsync() {
        const accountAddress = await this.web3Wrapper.getFirstAccountIfExistsAsync();
        return accountAddress;
    }
    public isValidAddress(address: string) {
        const lowercaseAddress = address.toLowerCase();
        return this.web3Wrapper.call('isAddress', [lowercaseAddress]);
    }
    public async sendSignRequestFireAndForgetAsync(msgHashHex: string) {
        const makerAddress = await this.web3Wrapper.getFirstAccountIfExistsAsync();
        // If marketAddress is null, this means they have a web3 instance injected into their browser
        // but no account addresses associated with it.
        if (_.isNull(makerAddress)) {
            throw new Error('Tried to send a sign request but user has no associated addresses');
        }
        const signData = await this.web3Wrapper.signTransactionAsync(makerAddress, msgHashHex);
        const signature: string = signData as string;
        const signatureData = {
            hash: msgHashHex,
            r: signature.substring(0, 64),
            s: signature.substring(64, 128),
            v: _.parseInt(signature.substring(128, 130)) + 27,
        };
        this.dispatch(updateSignatureData(signatureData));
    }
    private async onPageLoadInitFireAndForgetAsync() {
        await this.onPageLoadAsync(); // wait for page to load

        // Once page loaded, we can instantiate provider
        this.provider = new Provider();

        const web3Instance = new Web3();
        web3Instance.setProvider(this.provider.getProviderObj());
        this.web3Wrapper = new Web3Wrapper(web3Instance, this.dispatch);
    }
    private async instantiateContractAsync() {
        this.dispatch(updateBlockchainIsLoaded(false));
        const doesNetworkExist = !_.isNull(this.prevNetworkId);
        if (doesNetworkExist) {
            const exchange = await contract(ExchangeArtifacts);
            exchange.setProvider(this.provider.getProviderObj());
            try {
                this.exchange = await exchange.deployed();
            } catch (err) {
                const errMsg = `${err}`;
                if (_.includes(errMsg, 'not been deployed to detected network')) {
                    this.dispatch(encounteredBlockchainError(BlockchainErrs.CONTRACT_NOT_DEPLOYED_ON_NETWORK));
                } else {
                    // We show a generic message for other possible caught errors
                    /* tslint:disable */
                    console.log('Notice: Unhandled error encountered: ', err);
                    /* tslint:enable */
                    this.dispatch(encounteredBlockchainError(BlockchainErrs.UNHANDLED_ERROR));
                }
            }
        } else {
            /* tslint:disable */
            console.log('Notice: web3.version.getNetwork returned null');
            /* tslint:enable */
            this.dispatch(encounteredBlockchainError(BlockchainErrs.DISCONNECTED_FROM_ETHEREUM_NODE));
        }
        this.dispatch(updateBlockchainIsLoaded(true));
    }
    private async onPageLoadAsync() {
        return new Promise((resolve, reject) => {
            window.onload = resolve;
        });
    }
}
