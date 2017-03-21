import * as _ from 'lodash';
import * as React from 'react';
import {Demo} from 'ts/containers/demo';

interface AppProps {}

export class App extends React.Component<AppProps, undefined> {
    public render() {
        return (
            <div className="mx-auto max-width-4">
                <div className="mx-auto center">
                    <Demo />
                </div>
            </div>
        );
    }
}
