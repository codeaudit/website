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

declare module '*.json' {
    const json: any;
    /* tslint:disable */
    export default json;
    /* tslint:enable */
}

// Bignumber.js interface
declare module 'bignumber.js' {

    class BigNumber {
        // Those static attributes could have been in the module, a few lines beneath
        public static ROUND_DOWN: any;
        public isBigNumber: boolean;
        public static config(arg: any): void;
        public static random(numDecimals: number): BigNumber;

        constructor(value: number|string);
        public toNumber(): number;
        public toString(base?: number): string;
        public toFixed(dp?: number, rm?: number): string;
        public div(value: BigNumber): BigNumber;
        public pow(exponent: BigNumber|number): BigNumber;
        public times(value: BigNumber|number): BigNumber;
        public plus(value: BigNumber|number): BigNumber;
        public lt(value: BigNumber|number): BigNumber;
        public lte(value: BigNumber|number): BigNumber;
        public gte(value: BigNumber|number): BigNumber;
        public gt(value: BigNumber|number): BigNumber;
        public eq(value: BigNumber|number): BigNumber;
        public minus(value: BigNumber): BigNumber;
        public round(numDecimals?: BigNumber|number): BigNumber;
    }

    // A standalone class is not exportable, so there is an empty module
    namespace BigNumber { }

    // The exported values is the merge of the BigNumber class and the BigNumber module
    export = BigNumber;
}

// Web3 interface
// modules that you require must be in quotes, or they'll be considered as ambient global variables.
declare module 'web3' {

    // web3 uses bignumber.js, which is not on definitely typed
    import * as BigNumber from 'bignumber.js';

    class Web3 {
        // It's weird that the providers are in an instance, instead of in the librairy
        public static providers: typeof providers;

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

            getBlock(blockHash: string, callback: (err: Error, blockObj: any) => void): BigNumber;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract
            contract(abi: IAbiDefinition[]): IContract;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetbalance
            getBalance(addressHexString: string,
                callback?: (err: any, result: BigNumber) => void): BigNumber;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetcode
            getCode(addressHexString: string,
                callback?: (err: any, code: string) => void): string;

            // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
            filter(value: string|IFilterObject): IFilterResult;
        };

        // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3setprovider
        public setProvider(provider: providers.IProvider): void;

        public fromWei(amount: BigNumber, unit: string): BigNumber;
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

declare module 'thenby';
