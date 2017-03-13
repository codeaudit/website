import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from 'ts/components/app';
import {colors, getMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import 'basscss/css/basscss.css';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: colors.grey900,
        primary2Color: colors.grey900,
        textColor: colors.grey800,
    },
});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <App />
    </MuiThemeProvider>,
    document.getElementById('app'),
);
