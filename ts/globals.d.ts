declare module 'jazzicon';
declare module 'react-tooltip';
declare module 'react-router-hash-link';
declare module 'es6-promisify';
declare module 'truffle-contract';
declare module 'ethereumjs-util';
declare module 'ethereumjs-abi';
declare module 'keccak';
declare module 'bn.js';
declare module 'web3-provider-engine';
declare module 'whatwg-fetch';
declare module 'react-html5video';
declare module 'web3-provider-engine/subproviders/filters';
declare module 'web3-provider-engine/subproviders/rpc';
declare module 'thenby';
declare module 'find-versions';
declare module 'compare-versions';

declare module '*.json' {
    const json: any;
    /* tslint:disable */
    export default json;
    /* tslint:enable */
}

// Web3 interface
// modules that you require must be in quotes, or they'll be considered as ambient global variables.
declare module 'web3' {

    // web3 uses bignumber.js, which is not on definitely typed
    import * as BigNumber from 'bignumber.js';

    class Web3 {
        // It's weird that the providers are in an instance, instead of in the librairy
        public static providers: typeof providers;

        public version: {
            getNetwork(): number;

            getNode(): string;
        };

        // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3eth
        public eth: {
            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcoinbase
            coinbase: string;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethdefaultaccount
            defaultAccount: string;

            compile: {
                // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcompilesolidity
                solidity(sourceString: string, cb?: (err: any, result: any) => void): object,
            }

            sign(address: string, message: string, callback: (err: Error, signData: string) => void): string;

            getBlock(blockHash: string, callback: (err: Error, blockObj: any) => void): BigNumber.BigNumber;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract
            contract(abi: IAbiDefinition[]): IContract;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetbalance
            getBalance(addressHexString: string,
                callback?: (err: any, result: BigNumber.BigNumber) => void): BigNumber.BigNumber;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetcode
            getCode(addressHexString: string,
                callback?: (err: any, code: string) => void): string;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
            filter(value: string|IFilterObject): IFilterResult;

            getAccounts(callback: (err: Error, value: any) => void): string[];

            sendTransaction(txData: any, callback: (err: Error, value: any) => void): void;
        };

        // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3setprovider
        public setProvider(provider: providers.IProvider): void;

        public currentProvider(): any;

        public fromWei(amount: BigNumber.BigNumber, unit: string): BigNumber.BigNumber;

        public isAddress(address: string): boolean;
    }

    // I usally start interface namesby an I but do as you want

    interface IAbiIOParameter {
        name: string;
        type: string;
    }

    interface IAbiDefinition {
        constants: boolean;
        inputs: IAbiIOParameter[];
        name: string;
        outputs: IAbiIOParameter[];
        type: string;
    }

    interface IContract {
        // TODO
    }

    // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
    interface IFilterObject {
        fromBlock: number|string;
        toBlock: number|string;
        address: string;
        topics: string[];
    }

    // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
    interface IFilterResult {
        get(callback: () => void): void;
        watch(callback: () => void): void;
        stopWatching(): void;
    }

    namespace providers {

        // Multiple providers will certainly have methods in common, this interface can be filled
        // with those methods and attributes
        interface IProvider {
        }

        // The implements clause is optional, a HttpProvider will be usable where a IProvider is expected.
        class HttpProvider implements IProvider {
            constructor(url?: string);
        }
    }

    namespace Web3 {} // Empty module so the class is expotable as a module

    export = Web3;
}
