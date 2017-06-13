import * as _ from 'lodash';
import {ZeroEx} from '@0xproject/0x.js';
import promisify = require('es6-promisify');
import findVersions = require('find-versions');
import compareVersions = require('compare-versions');
import {Dispatcher} from 'ts/redux/dispatcher';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {configs} from 'ts/utils/configs';
import {
    BlockchainErrs,
    Token,
    SignatureData,
    Side,
    ContractResponse,
    BlockchainCallErrs,
    ContractInstance,
} from 'ts/types';
import {Web3Wrapper} from 'ts/web3_wrapper';
import {errorReporter} from 'ts/utils/error_reporter';
import {tradeHistoryStorage} from 'ts/local_storage/trade_history_storage';
import {customTokenStorage} from 'ts/local_storage/custom_token_storage';
import * as ProxyArtifacts from '../contracts/Proxy.json';
import * as ExchangeArtifacts from '../contracts/Exchange.json';
import * as TokenRegistryArtifacts from '../contracts/TokenRegistry.json';
import * as TokenArtifacts from '../contracts/Token.json';
import * as MintableArtifacts from '../contracts/Mintable.json';
import * as EtherTokenArtifacts from '../contracts/EtherToken.json';
import contract = require('truffle-contract');
import * as BigNumber from 'bignumber.js';
import ethUtil = require('ethereumjs-util');

const ALLOWANCE_TO_ZERO_GAS_AMOUNT = 45730;

export class Blockchain {
    public networkId: number;
    public nodeVersion: string;
    public zeroEx: ZeroEx;
    private dispatcher: Dispatcher;
    private web3Wrapper: Web3Wrapper;
    private exchange: ContractInstance;
    private exchangeLogFillEvents: any[];
    private proxy: ContractInstance;
    private tokenRegistry: ContractInstance;
    private userAddress: string;
    constructor(dispatcher: Dispatcher) {
        this.dispatcher = dispatcher;
        this.userAddress = '';
        this.exchangeLogFillEvents = [];
        this.onPageLoadInitFireAndForgetAsync();
    }
    public async networkIdUpdatedFireAndForgetAsync(newNetworkId: number) {
        const isConnected = !_.isUndefined(newNetworkId);
        if (!isConnected) {
            this.networkId = newNetworkId;
            this.dispatcher.encounteredBlockchainError(BlockchainErrs.DISCONNECTED_FROM_ETHEREUM_NODE);
            this.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
        } else if (this.networkId !== newNetworkId) {
            this.networkId = newNetworkId;
            this.dispatcher.encounteredBlockchainError('');
            await this.instantiateContractsAsync();
            await this.rehydrateStoreWithContractEvents();
        }
    }
    public async userAddressUpdatedFireAndForgetAsync(newUserAddress: string) {
        if (this.userAddress !== newUserAddress) {
            this.userAddress = newUserAddress;
            await this.rehydrateStoreWithContractEvents();
        }
    }
    public async nodeVersionUpdatedFireAndForgetAsync(nodeVersion: string) {
        if (this.nodeVersion !== nodeVersion) {
            this.nodeVersion = nodeVersion;
        }
    }
    public async setExchangeAllowanceAsync(token: Token, amountInBaseUnits: BigNumber.BigNumber) {
        utils.assert(this.isValidAddress(token.address), BlockchainCallErrs.TOKEN_ADDRESS_IS_INVALID);
        utils.assert(this.doesUserAddressExist(), BlockchainCallErrs.USER_HAS_NO_ASSOCIATED_ADDRESSES);

        const tokenContract = await this.instantiateContractIfExistsAsync(TokenArtifacts, token.address);
        // Hack: for some reason default estimated gas amount causes `base fee exceeds gas limit` exception
        // on testrpc. Probably related to https://github.com/ethereumjs/testrpc/issues/294
        // TODO: Debug issue in testrpc and submit a PR, then remove this hack
        const gas = this.networkId === constants.TESTRPC_NETWORK_ID ? ALLOWANCE_TO_ZERO_GAS_AMOUNT : undefined;
        await tokenContract.approve(this.proxy.address, amountInBaseUnits, {
            from: this.userAddress,
            gas,
        });
        const allowance = amountInBaseUnits;
        this.dispatcher.replaceTokenAllowanceByAddress(token.address, allowance);
    }
    public async isValidSignatureAsync(maker: string, signatureData: SignatureData) {
        utils.assert(this.doesUserAddressExist(), BlockchainCallErrs.USER_HAS_NO_ASSOCIATED_ADDRESSES);

        const isValidSignature = await this.exchange.isValidSignature.call(
            maker,
            signatureData.hash,
            signatureData.v,
            signatureData.r,
            signatureData.s,
            {
                from: this.userAddress,
            },
        );
        return isValidSignature;
    }
    public async fillOrderAsync(maker: string, taker: string, makerTokenAddress: string,
                                takerTokenAddress: string, makerTokenAmount: BigNumber.BigNumber,
                                takerTokenAmount: BigNumber.BigNumber, makerFee: BigNumber.BigNumber,
                                takerFee: BigNumber.BigNumber, expirationUnixTimestampSec: BigNumber.BigNumber,
                                feeRecipient: string, fillAmount: BigNumber.BigNumber,
                                signatureData: SignatureData, salt: BigNumber.BigNumber) {
        utils.assert(this.doesUserAddressExist(), BlockchainCallErrs.USER_HAS_NO_ASSOCIATED_ADDRESSES);

        taker = taker === '' ? ZeroEx.NULL_ADDRESS : taker;
        const shouldCheckTransfer = true;
        const orderAddresses = [
            maker,
            taker,
            makerTokenAddress,
            takerTokenAddress,
            feeRecipient,
        ];
        const orderValues = [
            makerTokenAmount,
            takerTokenAmount,
            makerFee,
            takerFee,
            expirationUnixTimestampSec,
            salt.toString(),
        ];
        const fillAmountT = fillAmount.toString();
        const response: ContractResponse = await this.exchange.fill(
                                 orderAddresses,
                                 orderValues,
                                 fillAmountT,
                                 shouldCheckTransfer,
                                 signatureData.v,
                                 signatureData.r,
                                 signatureData.s, {
                                      from: this.userAddress,
                                  });
        const errEvent = _.find(response.logs, {event: 'LogError'});
        if (!_.isUndefined(errEvent)) {
            const errCode = errEvent.args.errorId.toNumber();
            const humanReadableErrMessage = constants.exchangeContractErrToMsg[errCode];
            throw new Error(humanReadableErrMessage);
        }
        return response;
    }
    public async getFillAmountAsync(orderHash: string): Promise<BigNumber.BigNumber> {
        utils.assert(ZeroEx.isValidOrderHash(orderHash), 'Must be valid orderHash');
        const fillAmount = await this.exchange.getUnavailableValueT.call(orderHash);
        return fillAmount;
    }
    public getExchangeContractAddressIfExists() {
        return this.exchange ? this.exchange.address : undefined;
    }
    public isValidAddress(address: string): boolean {
        const lowercaseAddress = address.toLowerCase();
        return this.web3Wrapper.isAddress(lowercaseAddress);
    }
    public async sendSignRequestAsync(orderHashHex: string): Promise<SignatureData> {
        let msgHashHex;
        const isParityNode = _.includes(this.nodeVersion, 'Parity');
        if (isParityNode) {
            // Parity node adds the personalMessage prefix itself
            msgHashHex = orderHashHex;
        } else {
            const orderHashBuff = ethUtil.toBuffer(orderHashHex);
            const msgHashBuff = ethUtil.hashPersonalMessage(orderHashBuff);
            msgHashHex = ethUtil.bufferToHex(msgHashBuff);
        }

        const makerAddress = this.userAddress;
        // If makerAddress is undefined, this means they have a web3 instance injected into their browser
        // but no account addresses associated with it.
        if (_.isUndefined(makerAddress)) {
            throw new Error('Tried to send a sign request but user has no associated addresses');
        }
        const signature = await this.web3Wrapper.signTransactionAsync(makerAddress, msgHashHex);

        let signatureData;
        const [nodeVersionNumber] = findVersions(this.nodeVersion);
        // Parity v1.6.6 and earlier returns the signatureData as vrs instead of rsv as Geth does
        // Since this version they have updated it to rsv but for the time being we still want to
        // support version < 1.6.6
        // Date: May 23rd 2017
        const latestParityVersionWithVRS = '1.6.6';
        const isVersionBeforeParityFix = compareVersions(nodeVersionNumber, latestParityVersionWithVRS) <= 0;
        if (isParityNode && isVersionBeforeParityFix) {
            const signatureBuffer = ethUtil.toBuffer(signature);
            let v = signatureBuffer[0];
            if (v < 27) {
                v += 27;
            }
            signatureData = {
                v: signatureBuffer[0],
                r: signatureBuffer.slice(1, 33),
                s: signatureBuffer.slice(33, 65),
            };
        } else {
            signatureData = ethUtil.fromRpcSig(signature);
        }

        const {v, r, s} = signatureData;
        signatureData.hash = orderHashHex;
        signatureData.r = ethUtil.bufferToHex(signatureData.r);
        signatureData.s = ethUtil.bufferToHex(signatureData.s);
        const isValidSignature = ZeroEx.isValidSignature(orderHashHex, signatureData, makerAddress);
        if (!isValidSignature) {
            throw new Error(BlockchainCallErrs.INVALID_SIGNATURE);
        }
        this.dispatcher.updateSignatureData(signatureData);
        return signatureData;
    }
    public async mintTestTokensAsync(token: Token) {
        utils.assert(this.doesUserAddressExist(), BlockchainCallErrs.USER_HAS_NO_ASSOCIATED_ADDRESSES);

        const mintableContract = await this.instantiateContractIfExistsAsync(MintableArtifacts, token.address);
        await mintableContract.mint(constants.MINT_AMOUNT, {
            from: this.userAddress,
        });
        const balanceDelta = constants.MINT_AMOUNT;
        this.dispatcher.updateTokenBalanceByAddress(token.address, balanceDelta);
    }
    public async convertEthToWrappedEthTokensAsync(amount: BigNumber.BigNumber) {
        utils.assert(this.doesUserAddressExist(), BlockchainCallErrs.USER_HAS_NO_ASSOCIATED_ADDRESSES);

        const wethContract = await this.instantiateContractIfExistsAsync(EtherTokenArtifacts);
        await wethContract.deposit({
            from: this.userAddress,
            value: amount,
        });
    }
    public async convertWrappedEthTokensToEthAsync(amount: BigNumber.BigNumber) {
        utils.assert(this.doesUserAddressExist(), BlockchainCallErrs.USER_HAS_NO_ASSOCIATED_ADDRESSES);

        const wethContract = await this.instantiateContractIfExistsAsync(EtherTokenArtifacts);
        await wethContract.withdraw(amount, {
            from: this.userAddress,
        });
    }
    public async doesContractExistAtAddressAsync(address: string) {
        return await this.web3Wrapper.doesContractExistAtAddressAsync(address);
    }
    public async getCurrentUserTokenBalanceAndAllowanceAsync(tokenAddress: string): Promise<BigNumber.BigNumber[]> {
      return await this.getTokenBalanceAndAllowanceAsync(this.userAddress, tokenAddress);
    }
    public async getTokenBalanceAndAllowanceAsync(ownerAddress: string, tokenAddress: string):
                    Promise<BigNumber.BigNumber[]> {
        const tokenContract = await this.instantiateContractIfExistsAsync(TokenArtifacts, tokenAddress);
        let balance;
        let allowance;
        if (this.doesUserAddressExist()) {
            balance = await tokenContract.balanceOf.call(ownerAddress);
            allowance = await tokenContract.allowance.call(ownerAddress, this.proxy.address);
        }
        // We rewrap BigNumbers from web3 into our BigNumber because the version that they're using is too old
        balance = new BigNumber(balance);
        allowance = new BigNumber(allowance);
        return [balance, allowance];
    }
    public async updateTokenBalancesAndAllowancesAsync(tokens: Token[]) {
        const updatedTokens = [];
        for (const token of tokens) {
            if (_.isUndefined(token.address)) {
                continue; // Cannot retrieve balance for tokens without an address
            }
            const [balance, allowance] = await this.getTokenBalanceAndAllowanceAsync(this.userAddress, token.address);
            updatedTokens.push(_.assign({}, token, {
                balance,
                allowance,
            }));
        }
        this.dispatcher.updateTokenByAddress(updatedTokens);
    }
    private doesUserAddressExist(): boolean {
        return this.userAddress !== '';
    }
    private async rehydrateStoreWithContractEvents() {
        // Ensure we are only ever listening to one set of events
        await this.stopWatchingExchangeLogFillEventsAsync();

        if (!this.doesUserAddressExist()) {
            return; // short-circuit
        }

        if (!_.isUndefined(this.exchange)) {
            // Since we do not have an index on the `taker` address and want to show
            // transactions where an account is either the `maker` or `taker`, we loop
            // through all fill events, and filter/cache them client-side.
            const filterIndexObj = {};
            this.startListeningForExchangeLogFillEvents(filterIndexObj);
        }
    }
    private startListeningForExchangeLogFillEvents(filterIndexObj: object) {
        utils.assert(!_.isUndefined(this.exchange), 'Exchange contract must be instantiated.');
        utils.assert(this.doesUserAddressExist(), BlockchainCallErrs.USER_HAS_NO_ASSOCIATED_ADDRESSES);

        const fromBlock = tradeHistoryStorage.getFillsLatestBlock(this.userAddress, this.networkId);
        const exchangeLogFillEvent = this.exchange.LogFill(filterIndexObj, {
            fromBlock,
            toBlock: 'latest',
        });
        exchangeLogFillEvent.watch(async (err: Error, result: any) => {
            if (err) {
                // Note: it's not entirely clear from the documentation which
                // errors will be thrown by `watch`. For now, let's log the error
                // to rollbar and stop watching when one occurs
                errorReporter.reportAsync(err); // fire and forget
                this.stopWatchingExchangeLogFillEventsAsync(); // fire and forget
                return;
            } else {
                const args = result.args;
                const isBlockPending = _.isNull(args.blockNumber);
                if (!isBlockPending) {
                    // Hack: I've observed the behavior where a client won't register certain fill events
                    // and lowering the cache blockNumber fixes the issue. As a quick fix for now, simply
                    // set the cached blockNumber 50 below the one returned. This way, upon refreshing, a user
                    // would still attempt to re-fetch events from the previous 50 blocks, but won't need to
                    // re-fetch all events in all blocks.
                    // TODO: Debug if this is a race condition, and apply a more precise fix
                    const blockNumberToSet = result.blockNumber - 50 < 0 ? 0 : result.blockNumber - 50;
                    tradeHistoryStorage.setFillsLatestBlock(this.userAddress, this.networkId, blockNumberToSet);
                }
                const isUserMakerOrTaker = args.maker === this.userAddress ||
                                           args.taker === this.userAddress;
                if (!isUserMakerOrTaker) {
                    return; // We aren't interested in the fill event
                }
                const blockTimestamp = await this.web3Wrapper.getBlockTimestampAsync(result.blockHash);
                const fill = {
                    filledValueT: args.filledValueT,
                    filledValueM: args.filledValueM,
                    logIndex: result.logIndex,
                    maker: args.maker,
                    orderHash: args.orderHash,
                    taker: args.taker,
                    tokenM: args.tokenM,
                    tokenT: args.tokenT,
                    feeMPaid: args.feeMPaid,
                    feeTPaid: args.feeTPaid,
                    transactionHash: result.transactionHash,
                    blockTimestamp,
                };
                tradeHistoryStorage.addFillToUser(this.userAddress, this.networkId, fill);
            }
        });
        this.exchangeLogFillEvents.push(exchangeLogFillEvent);
    }
    private async stopWatchingExchangeLogFillEventsAsync() {
        if (!_.isEmpty(this.exchangeLogFillEvents)) {
            for (const logFillEvent of this.exchangeLogFillEvents) {
                await promisify(logFillEvent.stopWatching, logFillEvent)();
            }
            this.exchangeLogFillEvents = [];
        }
    }
    private async getTokenRegistryTokensAsync(): Promise<Token[]> {
        if (this.tokenRegistry) {
            const addresses = await this.tokenRegistry.getTokenAddresses.call();
            const tokenPromises: Array<Promise<Token>> = _.map(
                addresses,
                (address: string) => (this.getTokenRegistryTokenAsync(address)),
            );
            const tokensPromise: Promise<Token[]> = Promise.all(tokenPromises);
            return tokensPromise;
        } else {
            return [];
        }
    }
    private async getTokenRegistryTokenAsync(address: string): Promise<Token> {
        const tokenDataPromises = [
            this.getTokenBalanceAndAllowanceAsync(this.userAddress, address),
            this.tokenRegistry.getTokenMetaData.call(address),
        ];
        const tokenData = await Promise.all(tokenDataPromises);
        const [
            balance,
            allowance,
        ] = tokenData[0];
        const [
            tokenAddress,
            name,
            symbol,
            url,
            decimals,
        ] = tokenData[1];
        // HACK: For now we have a hard-coded list of iconUrls for the dummyTokens
        // TODO: Refactor this out and pull the iconUrl directly from the TokenRegistry
        const iconUrl = constants.iconUrlBySymbol[symbol];
        const token: Token = {
            iconUrl: !_.isUndefined(iconUrl) ? iconUrl : constants.DEFAULT_TOKEN_ICON_URL,
            address,
            allowance,
            balance,
            name,
            symbol,
            decimals: decimals.toNumber(),
        };
        return token;
    }
    private async getCustomTokensAsync() {
        const customTokens = customTokenStorage.getCustomTokens(this.networkId);
        for (const customToken of customTokens) {
            const [
              balance,
              allowance,
            ] = await this.getTokenBalanceAndAllowanceAsync(this.userAddress, customToken.address);
            customToken.balance = balance;
            customToken.allowance = allowance;
        }
        return customTokens;
    }
    private async onPageLoadInitFireAndForgetAsync() {
        await this.onPageLoadAsync(); // wait for page to load

        const injectedWeb3 = (window as any).web3;
        // Hack: We need to know the networkId the injectedWeb3 is connected to (if it is defined) in
        // order to properly instantiate the web3Wrapper. Since we must use the async call, we cannot
        // retrieve it from within the web3Wrapper constructor. This is and should remain the only
        // call to a web3 instance outside of web3Wrapper in the entire dapp.
        const networkId = !_.isUndefined(injectedWeb3) ? await promisify(injectedWeb3.version.getNetwork)() :
                                                             undefined;
        this.web3Wrapper = new Web3Wrapper(this.dispatcher, networkId);
        this.zeroEx = new ZeroEx(this.web3Wrapper.getInternalWeb3Instance());
    }
    private async instantiateContractsAsync() {
        utils.assert(!_.isUndefined(this.networkId),
                     'Cannot call instantiateContractsAsync if disconnected from Ethereum node');

        this.dispatcher.updateBlockchainIsLoaded(false);
        try {
            const contractsPromises = _.map(
                [ExchangeArtifacts, TokenRegistryArtifacts, ProxyArtifacts],
                (artifacts: any) => this.instantiateContractIfExistsAsync(artifacts),
            );
            const contracts = await Promise.all(contractsPromises);
            this.exchange = contracts[0];
            this.tokenRegistry = contracts[1];
            this.proxy = contracts[2];
        } catch (err) {
            const errMsg = err + '';
            if (_.includes(errMsg, BlockchainCallErrs.CONTRACT_DOES_NOT_EXIST)) {
                this.dispatcher.encounteredBlockchainError(BlockchainErrs.A_CONTRACT_NOT_DEPLOYED_ON_NETWORK);
                this.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
                return;
            } else {
                // We show a generic message for other possible caught errors
                this.dispatcher.encounteredBlockchainError(BlockchainErrs.UNHANDLED_ERROR);
                return;
            }
        }
        this.dispatcher.clearTokenByAddress();
        const tokenArrays = await Promise.all([
                this.getTokenRegistryTokensAsync(),
                this.getCustomTokensAsync(),
        ]);
        const tokens = _.flatten(tokenArrays);
        this.dispatcher.updateTokenByAddress(tokens);
        const mostPopularTradingPairTokens: Token[] = [
            _.find(tokens, {symbol: configs.mostPopularTradingPairSymbols[0]}),
            _.find(tokens, {symbol: configs.mostPopularTradingPairSymbols[1]}),
        ];
        this.dispatcher.updateChosenAssetTokenAddress(Side.deposit, mostPopularTradingPairTokens[0].address);
        this.dispatcher.updateChosenAssetTokenAddress(Side.receive, mostPopularTradingPairTokens[1].address);
        this.dispatcher.updateBlockchainIsLoaded(true);
    }
    private async instantiateContractIfExistsAsync(artifact: any, address?: string): Promise<ContractInstance> {
        const c = await contract(artifact);
        const providerObj = this.web3Wrapper.getProviderObj();
        c.setProvider(providerObj);

        const artifactNetworkConfigs = artifact.networks[this.networkId];
        let contractAddress;
        if (!_.isUndefined(address)) {
            contractAddress = address;
        } else if (!_.isUndefined(artifactNetworkConfigs)) {
            contractAddress = artifactNetworkConfigs.address;
        }

        if (!_.isUndefined(contractAddress)) {
            const doesContractExist = await this.doesContractExistAtAddressAsync(contractAddress);
            if (!doesContractExist) {
                throw new Error(BlockchainCallErrs.CONTRACT_DOES_NOT_EXIST);
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
            utils.consoleLog(`Notice: Error encountered: ${err} ${err.stack}`);
            if (_.includes(errMsg, 'not been deployed to detected network')) {
                throw new Error(BlockchainCallErrs.CONTRACT_DOES_NOT_EXIST);
            } else {
                await errorReporter.reportAsync(err);
                throw new Error(BlockchainCallErrs.UNHANDLED_ERROR);
            }
        }
    }
    private async onPageLoadAsync() {
        if (document.readyState === 'complete') {
            return; // Already loaded
        }
        return new Promise((resolve, reject) => {
            window.onload = resolve;
        });
    }
}
