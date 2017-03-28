import * as _ from 'lodash';
import * as Web3 from 'web3';
import {Dispatch} from 'redux';
import contract = require('truffle-contract');
import {State} from 'ts/redux/reducer';
import {Provider} from 'ts/provider';
import {utils} from 'ts/utils/utils';
import {BlockchainErrs, Token} from 'ts/types';
import {Web3Wrapper} from 'ts/web3_wrapper';
import {
    encounteredBlockchainError,
    updateBlockchainIsLoaded,
    updateSignatureData,
    updateTokenBySymbol,
} from 'ts/redux/actions';
import * as ProxyArtifacts from '../contracts/Proxy.json';
import * as ExchangeArtifacts from '../contracts/Exchange.json';
import * as TokenRegistryArtifacts from '../contracts/TokenRegistry.json';
import * as TokenArtifacts from '../contracts/Token.json';
import * as MintableArtifacts from '../contracts/Mintable.json';

const MINT_AMOUNT = 100;

export class Blockchain {
    private dispatch: Dispatch<State>;
    private web3Wrapper: Web3Wrapper;
    private provider: Provider;
    private exchange: any; // TODO: add type definition for Contract
    private proxy: any;
    private tokenRegistry: any;
    private prevNetworkId: number;
    constructor(dispatch: Dispatch<State>) {
        this.dispatch = dispatch;
        this.onPageLoadInitFireAndForgetAsync();
    }
    public async networkIdUpdatedFireAndForgetAsync(networkId: number) {
        const isConnected = !_.isUndefined(networkId);
        if (!isConnected) {
            this.prevNetworkId = networkId;
            this.dispatch(encounteredBlockchainError(BlockchainErrs.DISCONNECTED_FROM_ETHEREUM_NODE));
        } else if (this.prevNetworkId !== networkId) {
            this.prevNetworkId = networkId;
            this.dispatch(encounteredBlockchainError(''));
            await this.instantiateContractsAsync();
        }
    }
    public getExchangeContractAddressIfExists() {
        return this.exchange ? this.exchange.address : undefined;
    }
    public async getFirstAccountIfExistsAsync() {
        const accountAddress = await this.web3Wrapper.getFirstAccountIfExistsAsync();
        return accountAddress;
    }
    public isValidAddress(address: string) {
        const lowercaseAddress = address.toLowerCase();
        return this.web3Wrapper.call('isAddress', [lowercaseAddress]);
    }
    public async sendSignRequestAsync(msgHashHex: string) {
        const makerAddress = await this.web3Wrapper.getFirstAccountIfExistsAsync();
        // If marketAddress is undefined, this means they have a web3 instance injected into their browser
        // but no account addresses associated with it.
        if (_.isUndefined(makerAddress)) {
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
    public async mintTestTokensAsync(token: Token) {
        const userAddress = await this.getFirstAccountIfExistsAsync();
        if (_.isUndefined(userAddress)) {
            throw new Error('User has no associated addresses');
        }
        const mintableContract = await this.instantiateContractAsync(MintableArtifacts, token.address);
        await mintableContract.mint(MINT_AMOUNT, {
            from: userAddress,
        });
        const tokens = [_.assign({}, token, {
            balance: token.balance + MINT_AMOUNT,
        })];
        this.dispatch(updateTokenBySymbol(tokens));
    }
    private async getTokenRegistryTokensAsync() {
        if (this.tokenRegistry) {
            const userAddress = await this.getFirstAccountIfExistsAsync();
            const [addresses, symbols, names] = await this.tokenRegistry.getTokens.call();
            const tokens = [];
            for (let i = 0; i < addresses.length; i++) {
                const address = addresses[i];
                const token = await this.instantiateContractAsync(TokenArtifacts, address);
                let balance;
                let allowance;
                if (!_.isUndefined(userAddress)) {
                    balance = await token.balanceOf.call(userAddress);
                    allowance = await token.allowance.call(userAddress, this.proxy.address);
                }
                tokens.push({
                    address,
                    allowance: _.isUndefined(allowance) ? 0 : allowance.toNumber(),
                    balance: _.isUndefined(balance) ? 0 : balance.toNumber(),
                    name: utils.convertByte32HexToString(names[i]),
                    symbol: utils.convertByte32HexToString(symbols[i]),
                });
            }
            this.dispatch(updateTokenBySymbol(tokens));
        } else {
            return [];
        }
    }
    private async onPageLoadInitFireAndForgetAsync() {
        await this.onPageLoadAsync(); // wait for page to load

        // Once page loaded, we can instantiate provider
        this.provider = new Provider();

        const web3Instance = new Web3();
        web3Instance.setProvider(this.provider.getProviderObj());
        this.web3Wrapper = new Web3Wrapper(web3Instance, this.dispatch);
    }
    private async instantiateContractsAsync() {
        this.dispatch(updateBlockchainIsLoaded(false));
        const doesNetworkExist = !_.isUndefined(this.prevNetworkId);
        if (doesNetworkExist) {
            this.exchange = await this.instantiateContractAsync(ExchangeArtifacts);
            this.tokenRegistry = await this.instantiateContractAsync(TokenRegistryArtifacts);
            this.proxy = await this.instantiateContractAsync(ProxyArtifacts);
            await this.getTokenRegistryTokensAsync();
        } else {
            /* tslint:disable */
            console.log('Notice: web3.version.getNetwork returned undefined');
            /* tslint:enable */
            this.dispatch(encounteredBlockchainError(BlockchainErrs.DISCONNECTED_FROM_ETHEREUM_NODE));
        }
        this.dispatch(updateBlockchainIsLoaded(true));
    }
    private async instantiateContractAsync(artifact: object, address?: string) {
        const c = await contract(artifact);
        c.setProvider(this.provider.getProviderObj());
        try {
            let contractInstance;
            if (_.isUndefined(address)) {
                contractInstance = await c.deployed();
            } else {
                contractInstance = await c.at(address);
            }
            return contractInstance;
        } catch (err) {
            const errMsg = `${err}`;
            /* tslint:disable */
            console.log('Notice: Error encountered: ', err);
            /* tslint:enable */
            if (_.includes(errMsg, 'not been deployed to detected network')) {
                this.dispatch(encounteredBlockchainError(BlockchainErrs.A_CONTRACT_NOT_DEPLOYED_ON_NETWORK));
            } else {
                // We show a generic message for other possible caught errors
                this.dispatch(encounteredBlockchainError(BlockchainErrs.UNHANDLED_ERROR));
            }
        }
    }
    private async onPageLoadAsync() {
        return new Promise((resolve, reject) => {
            window.onload = resolve;
        });
    }
}
