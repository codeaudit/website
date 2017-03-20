import {ProviderTypes} from 'ts/types';

export const configs = {
    INFURA_TESTNET_URL: 'https://ropsten.infura.io/T5WSC8cautR4KXyYgsRs',
    PROVIDER_CONFIGS: {
        [ProviderTypes.publicNode]: {
            canSendTransactions: false,
        },
        [ProviderTypes.injectedWeb3]: {
            canSendTransactions: true,
        },
    },
};
