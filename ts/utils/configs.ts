import * as _ from 'lodash';
import {ProviderTypes} from 'ts/types';

const BASE_URL = window.location.origin;

const isDevelopment = _.includes(BASE_URL, 'http://0xproject.dev:8080') ||
                      _.includes(BASE_URL, 'http://localhost:8080') ||
                      _.includes(BASE_URL, 'http://127.0.0.1');

export const configs = {
    BASE_URL,
    ENVIRONMENT: isDevelopment ? 'development' : 'production',
    PROVIDER_CONFIGS: {
        [ProviderTypes.publicNode]: {
            canSendTransactions: false,
        },
        [ProviderTypes.injectedWeb3]: {
            canSendTransactions: true,
        },
    },
    symbolsOfMintableTokens: ['MKR', 'MLN', 'GNT', 'DGD', 'REP', 'ZRX'],
    mostPopularTradingPairSymbols: ['WETH', 'GNT'],
};
