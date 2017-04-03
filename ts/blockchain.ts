import * as _ from 'lodash';
import * as Web3 from 'web3';
import {Dispatcher} from 'ts/redux/dispatcher';
import contract = require('truffle-contract');
import BigNumber = require('bignumber.js');
import {Provider} from 'ts/provider';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {BlockchainErrs, Token, SignatureData} from 'ts/types';
import {Web3Wrapper} from 'ts/web3_wrapper';
import * as ProxyArtifacts from '../contracts/Proxy.json';
import * as ExchangeArtifacts from '../contracts/Exchange.json';
import * as TokenRegistryArtifacts from '../contracts/TokenRegistry.json';
import * as TokenArtifacts from '../contracts/Token.json';
import * as MintableArtifacts from '../contracts/Mintable.json';

const MINT_AMOUNT = 100;

export class Blockchain {
    public networkId: number;
    private dispatcher: Dispatcher;
    private web3Wrapper: Web3Wrapper;
    private provider: Provider;
    private exchange: any; // TODO: add type definition for Contract
    private proxy: any;
    private tokenRegistry: any;
    constructor(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
        this.onPageLoadInitFireAndForgetAsync();
    }
    public async networkIdUpdatedFireAndForgetAsync(newNetworkId: number) {
        const isConnected = !_.isUndefined(newNetworkId);
        if (!isConnected) {
            this.networkId = newNetworkId;
            this.dispatcher.encounteredBlockchainError(BlockchainErrs.DISCONNECTED_FROM_ETHEREUM_NODE);
        } else if (this.networkId !== newNetworkId) {
            this.networkId = newNetworkId;
            this.dispatcher.encounteredBlockchainError('');
            await this.instantiateContractsAsync();
        }
    }
    public async setExchangeAllowanceAsync(token: Token, amount: number) {
        if (!this.isValidAddress(token.address)) {
            throw new Error('tokenAddress is not a valid address');
        }
        const userAddressIfExists = await this.getFirstAccountIfExistsAsync();
        if (_.isUndefined(userAddressIfExists)) {
            throw new Error('Cannot set allowance if no user accounts accessible');
        }
        const tokenContract = await this.instantiateContractAsync(TokenArtifacts, token.address);
        await tokenContract.approve(this.proxy.address, amount, {
            from: userAddressIfExists,
        });
        token.allowance = amount;
        this.dispatcher.updateTokenBySymbol([token]);
    }
    public async fillOrderAsync(maker: string, taker: string, makerTokenAddress: string,
                                takerTokenAddress: string, makerTokenAmount: number,
                                takerTokenAmount: number, expirationUnixTimestampSec: number,
                                fillAmount: number, signatureData: SignatureData) {
        const userAddressIfExists = await this.getFirstAccountIfExistsAsync();
        if (_.isUndefined(userAddressIfExists)) {
            throw new Error('Cannot fill order if no user accounts accessible');
        }

        taker = taker === '' ? constants.NULL_ADDRESS : taker;
        const shouldCheckTransfer = false;
        const fill = {
            expiration: expirationUnixTimestampSec,
            feeRecipient: constants.FEE_RECIPIENT_ADDRESS,
            fees: [constants.MAKER_FEE, constants.TAKER_FEE],
            fillValueM: fillAmount.toString(),
            rs: [signatureData.r, signatureData.s],
            tokens: [makerTokenAddress, takerTokenAddress],
            traders: [maker, taker],
            shouldCheckTransfer,
            v: signatureData.v,
            values: [makerTokenAmount.toString(), takerTokenAmount.toString()],
        };
        await this.exchange.fill(fill.traders,
                                 fill.tokens,
                                 fill.feeRecipient,
                                 fill.shouldCheckTransfer,
                                 fill.values,
                                 fill.fees,
                                 fill.expiration,
                                 fill.fillValueM,
                                 fill.v,
                                 fill.rs, {
                                      from: userAddressIfExists,
                                  });
    }
    public getExchangeContractAddressIfExists() {
        return this.exchange ? this.exchange.address : undefined;
    }
    public async getFirstAccountIfExistsAsync() {
        const accountAddress = await this.web3Wrapper.getFirstAccountIfExistsAsync();
        return accountAddress;
    }
    public isValidAddress(address: string): boolean {
        const lowercaseAddress = address.toLowerCase();
        return this.web3Wrapper.call('isAddress', [lowercaseAddress]);
    }
    public async sendSignRequestAsync(msgHashHex: string): Promise<SignatureData> {
        const makerAddress = await this.getFirstAccountIfExistsAsync();
        // If makerAddress is undefined, this means they have a web3 instance injected into their browser
        // but no account addresses associated with it.
        if (_.isUndefined(makerAddress)) {
            throw new Error('Tried to send a sign request but user has no associated addresses');
        }
        const signature = await this.web3Wrapper.signTransactionAsync(makerAddress, msgHashHex);
        const signatureData = {
            hash: msgHashHex,
            r: `0x${signature.substring(2, 66)}`,
            s: `0x${signature.substring(66, 130)}`,
            v: _.parseInt(signature.substring(130, 132)) + 27,
        };
        this.dispatcher.updateSignatureData(signatureData);
        return signatureData;
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
        this.dispatcher.updateTokenBySymbol(tokens);
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
            this.dispatcher.updateTokenBySymbol(tokens);
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
        this.web3Wrapper = new Web3Wrapper(web3Instance, this.dispatcher);
    }
    private async instantiateContractsAsync() {
        utils.assert(!_.isUndefined(this.networkId),
                     'Cannot call instantiateContractsAsync if disconnected from Ethereum node');

        this.dispatcher.updateBlockchainIsLoaded(false);
        this.exchange = await this.instantiateContractAsync(ExchangeArtifacts);
        this.tokenRegistry = await this.instantiateContractAsync(TokenRegistryArtifacts);
        this.proxy = await this.instantiateContractAsync(ProxyArtifacts);
        await this.getTokenRegistryTokensAsync();
        this.dispatcher.updateBlockchainIsLoaded(true);
    }
    private async instantiateContractAsync(artifact: any, address?: string) {
        const c = await contract(artifact);
        c.setProvider(this.provider.getProviderObj());

        const contractAddress = !_.isUndefined(address) ? address : artifact.networks[this.networkId].address;
        if (!_.isUndefined(contractAddress)) {
            const doesContractExist = await this.web3Wrapper.doesContractExistAtAddressAsync(contractAddress);
            if (!doesContractExist) {
                this.dispatcher.encounteredBlockchainError(BlockchainErrs.A_CONTRACT_NOT_DEPLOYED_ON_NETWORK);
                this.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
                return;
            }
        }

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
            utils.consoleLog(`Notice: Error encountered: ${err}`);
            if (_.includes(errMsg, 'not been deployed to detected network')) {
                this.dispatcher.encounteredBlockchainError(BlockchainErrs.A_CONTRACT_NOT_DEPLOYED_ON_NETWORK);
                this.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            } else {
                // We show a generic message for other possible caught errors
                this.dispatcher.encounteredBlockchainError(BlockchainErrs.UNHANDLED_ERROR);
            }
        }
    }
    private async onPageLoadAsync() {
        return new Promise((resolve, reject) => {
            window.onload = resolve;
        });
    }
}
