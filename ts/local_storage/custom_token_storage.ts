import * as _ from 'lodash';
import {Token} from 'ts/types';
import {localStorage} from 'ts/local_storage/local_storage';

const CUSTOM_TOKENS_KEY = 'customTokens';

export const customTokenStorage = {
    addCustomToken(token: Token) {
        const customTokens = this.getCustomTokens();
        customTokens.push(token);
        const customTokensJSONString = JSON.stringify(customTokens);
        localStorage.setItem(CUSTOM_TOKENS_KEY, customTokensJSONString);
    },
    getCustomTokens(): Token[] {
        const customTokensJSONString = localStorage.getItemIfExists(CUSTOM_TOKENS_KEY);
        if (_.isEmpty(customTokensJSONString)) {
            return [];
        }
        const customTokens = JSON.parse(customTokensJSONString);
        return customTokens;
    },
};
