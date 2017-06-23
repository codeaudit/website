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
declare module 'react-highlight';

declare module '*.json' {
    const json: any;
    /* tslint:disable */
    export default json;
    /* tslint:enable */
}

// find-version declarations
declare function findVersions(version: string): string[];
declare module 'find-versions' {
    export = findVersions;
}

// compare-version declarations
declare function compareVersions(firstVersion: string, secondVersion: string): number;
declare module 'compare-versions' {
    export = compareVersions;
}

// semver-sort declarations
declare module 'semver-sort' {
    const desc: (versions: string[]) => string[];
}

// xml-js declarations
declare interface XML2JSONOpts {
    compact?: boolean;
    spaces?: number;
}
declare module 'xml-js' {
    const xml2json: (xml: string, opts: XML2JSONOpts) => string;
}

// This will be defined by default in TS 2.4
// Source: https://github.com/Microsoft/TypeScript/issues/12364
interface System {
    import<T>(module: string): Promise<T>;
}
declare var System: System;
