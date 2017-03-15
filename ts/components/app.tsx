import * as _ from 'lodash';
import * as React from 'react';
import {Demo} from 'ts/components/demo';

interface AppProps {}

export class App extends React.Component<AppProps, undefined> {
    public render() {
        return (
            <div className="mx-auto max-width-4 pt4">
                <div className="mx-auto center" style={{maxWidth: 600}}>
                    <Demo />
                </div>
            </div>
        );
    }
}
