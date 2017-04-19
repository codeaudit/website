import * as _ from 'lodash';
import {Token, CustomTokensByNetworkId} from 'ts/types';
import {localStorage} from 'ts/local_storage/local_storage';

const CUSTOM_TOKENS_KEY = 'customTokens';

export const customTokenStorage = {
    addCustomToken(networkId: number, token: Token) {
        const customTokensByNetworkId = this.getCustomTokensByNetworkId();
        const customTokens = !_.isUndefined(customTokensByNetworkId[networkId]) ?
                             customTokensByNetworkId[networkId] : [];
        customTokens.push(token);
        customTokensByNetworkId[networkId] = customTokens;
        const customTokensByNetworkIdJSONString = JSON.stringify(customTokensByNetworkId);
        localStorage.setItem(CUSTOM_TOKENS_KEY, customTokensByNetworkIdJSONString);
    },
    getCustomTokensByNetworkId(): CustomTokensByNetworkId {
        const customTokensJSONString = localStorage.getItemIfExists(CUSTOM_TOKENS_KEY);
        if (_.isEmpty(customTokensJSONString)) {
            return {};
        }
        const customTokensByNetworkId = JSON.parse(customTokensJSONString);
        return customTokensByNetworkId;
    },
    getCustomTokens(networkId: number): Token[] {
        const customTokensJSONString = localStorage.getItemIfExists(CUSTOM_TOKENS_KEY);
        if (_.isEmpty(customTokensJSONString)) {
            return [];
        }
        const customTokensByNetworkId = JSON.parse(customTokensJSONString);
        const customTokens = customTokensByNetworkId[networkId];
        if (_.isUndefined(customTokens)) {
            return [];
        }
        return customTokens;
    },
};
