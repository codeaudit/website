import * as _ from 'lodash';

export const localStorage = {
    doesExist() {
        return !!window.localStorage;
    },
    getItemIfExists(key: string): string {
        if (!this.doesExist) {
            return undefined;
        }
        const item = window.localStorage.getItem(key);
        if (_.isNull(item)) {
            return undefined;
        }
        return item;
    },
    setItem(key: string, value: string) {
        if (!this.doesExist) {
            return;
        }
        window.localStorage.setItem(key, value);
    },
};
