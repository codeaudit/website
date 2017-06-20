import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, Store as ReduxStore} from 'redux';
import * as BigNumber from 'bignumber.js';
import {configs} from 'ts/utils/configs';
import {utils} from 'ts/utils/utils';
import {Home} from 'ts/pages/home/home';
import {FAQ} from 'ts/pages/faq';
import {NotFound} from 'ts/pages/not_found';
import {LazyComponent} from 'ts/lazy_component';
import {State, reducer} from 'ts/redux/reducer';
import {colors, getMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import {Switch, BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {tradeHistoryStorage} from 'ts/local_storage/trade_history_storage';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// By default BigNumber's `toString` method converts to exponential notation if the value has
// more then 20 digits. We want to avoid this behavior, so we set EXPONENTIAL_AT to a high number
BigNumber.config({
    EXPONENTIAL_AT: 1000,
});

// Check if we've introduced an update that requires us to clear the tradeHistory local storage entries
tradeHistoryStorage.clearIfRequired();

const CUSTOM_GREY = 'rgb(39, 39, 39)';
const CUSTOM_GREEN = 'rgb(102, 222, 117)';
const CUSTOM_DARKER_GREEN = 'rgb(77, 197, 92)';

import 'basscss/css/basscss.css';
import 'less/all.less';

const muiTheme = getMuiTheme({
    appBar: {
        height: 45,
        color: 'white',
        textColor: 'black',
    },
    palette: {
        pickerHeaderColor: colors.cyanA400,
        primary1Color: colors.cyanA400,
        primary2Color: colors.cyanA400,
        textColor: colors.grey700,
    },
    datePicker: {
        color: colors.grey700,
        textColor: 'white',
        calendarTextColor: 'white',
        selectColor: CUSTOM_GREY,
        selectTextColor: 'white',
    },
    timePicker: {
        color: colors.grey700,
        textColor: 'white',
        accentColor: 'white',
        headerColor: CUSTOM_GREY,
        selectColor: CUSTOM_GREY,
        selectTextColor: CUSTOM_GREY,
    },
    toggle: {
        thumbOnColor: CUSTOM_GREEN,
        trackOnColor: CUSTOM_DARKER_GREEN,
    },
});

const createLazyComponent = (componentName: string, lazyImport: () => Promise<any>) => {
    return (props: any) => {
        const componentPromise = utils.asyncMap(mod => mod[componentName], lazyImport());
        return (
            <LazyComponent
                componentPromise={componentPromise}
                componentProps={props}
            />
        );
    };
};

// We pass modulePromise returning lambda instead of module promise,
// cause we only want to import the module when the user navigates to the page.
// At the same time webpack statically parses for System.import() to determine chunks split points.
const LazyOTC = createLazyComponent('OTC', () => System.import<any>('ts/containers/otc'));
const LazyZeroExJSDocumentation = createLazyComponent(
    'ZeroExJSDocumentation',
    () => System.import<any>('ts/pages/documentation/zero_ex_js_documentation'),
);

const store: ReduxStore<State> = createStore(reducer);
render(
    <Router>
        <div>
            <MuiThemeProvider muiTheme={muiTheme}>
                <Provider store={store}>
                    <div>
                        <Switch>
                            <Route exact={true} path="/" component={Home as any} />
                            <Route path="/otc" component={LazyOTC}/>
                            <Route path="/faq" component={FAQ as any} />
                            <Route path="/docs/0xjs" component={LazyZeroExJSDocumentation}/>
                            <Route component={NotFound as any} />
                        </Switch>
                    </div>
                </Provider>
            </MuiThemeProvider>
        </div>
  </Router>,
    document.getElementById('app'),
);
