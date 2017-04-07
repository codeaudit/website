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
    symbolsOfMintableTokens: ['TA', 'TB', 'WETH'],
};
