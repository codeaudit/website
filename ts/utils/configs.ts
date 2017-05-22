import * as _ from 'lodash';
import {Environments} from 'ts/types';

const BASE_URL = window.location.origin;

const isDevelopment = _.includes(BASE_URL, 'http://0xproject.dev:8080') ||
                      _.includes(BASE_URL, 'http://localhost:8080') ||
                      _.includes(BASE_URL, 'http://127.0.0.1');

export const configs = {
    BASE_URL,
    ENVIRONMENT: isDevelopment ? Environments.DEVELOPMENT : Environments.PRODUCTION,
    symbolsOfMintableTokens: ['MKR', 'MLN', 'GNT', 'DGD', 'REP', 'ZRX'],
    mostPopularTradingPairSymbols: ['WETH', 'GNT'],
};
