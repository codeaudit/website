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
declare module 'react-highlight';

declare module '*.json' {
    const json: any;
    /* tslint:disable */
    export default json;
    /* tslint:enable */
}

// This will be defined by default in TS 2.4
// Source: https://github.com/Microsoft/TypeScript/issues/12364
interface System {
  import<T>(module: string): Promise<T>;
}
declare var System: System;

