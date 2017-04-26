import {ProviderTypes} from 'ts/types';

export const configs = {
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
