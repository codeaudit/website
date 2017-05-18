import * as _ from 'lodash';
import {ProviderTypes} from 'ts/types';

const BASE_URL = window.location.origin;

const isDevelopment = _.includes(BASE_URL, 'http://0xproject.dev:8080') ||
                      _.includes(BASE_URL, 'http://localhost:8080') ||
                      _.includes(BASE_URL, 'http://127.0.0.1');
const isStaging = _.includes(BASE_URL, 'staging-0xproject.s3-website-us-east-1.amazonaws.com');

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
    isOTCEnabled: true,
};
