import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {configs} from 'ts/utils/configs';

// Suggested way to include Rollbar with Webpack
// https://github.com/rollbar/rollbar.js/tree/master/examples/webpack
const rollbarConfig = {
    accessToken: constants.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    itemsPerMinute: 10,
    maxItems: 500,
    payload: {
        environment: configs.ENVIRONMENT,
    },
    uncaughtErrorLevel: 'error',
};
import Rollbar = require('../../public/js/rollbar.umd.nojson.min.js');
const rollbar = Rollbar.init(rollbarConfig);

export const errorReporter = {
    reportAsync(err: Error): Promise<any> {
        if (configs.ENVIRONMENT === 'development') {
            return; // Let's not log development errors to rollbar
        }

        return new Promise((resolve, reject) => {
            rollbar.error(err, (rollbarErr: Error) => {
                if (rollbarErr) {
                    utils.consoleLog(`Error reporting to rollbar, ignoring: ${rollbarErr}`);
                    // We never want to reject and cause the app to throw because of rollbar
                    resolve();
                } else {
                    resolve();
                }
            });
        });
    },
};
