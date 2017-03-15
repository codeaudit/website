import * as _ from 'lodash';

export const utils = {
    // Utility function to create a K:V from a list of strings
    // Adapted from: https://basarat.gitbooks.io/typescript/content/docs/types/literal-types.html
    strEnum(values: string[]): {[key: string]: string} {
        return _.reduce(values, (result, key) => {
            result[key] = key;
            return result;
        }, Object.create(null));
    },
    assert(condition: boolean, message: string) {
        if (!condition) {
            throw new Error(message);
        }
    },
};
