import {ProviderTypes} from 'ts/types';

const BASE_URL = window.location.origin;

export const configs = {
    BASE_URL,
    ENVIRONMENT: BASE_URL === 'http://0xproject.dev:8080' ||
                 BASE_URL === 'http://localhost:8080' ?
                 'development' :
                 'production',
    PROVIDER_CONFIGS: {
        [ProviderTypes.publicNode]: {
            canSendTransactions: false,
        },
        [ProviderTypes.injectedWeb3]: {
            canSendTransactions: true,
        },
    },
    symbolsOfMintableTokens: ['MKR', 'MLN', 'WETH', 'GNT', 'DGD', 'REP', 'ZRX'],
};
