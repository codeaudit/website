import * as _ from 'lodash';
import * as React from 'react';

interface AppProps {}

export class App extends React.Component<AppProps, undefined> {
    constructor(props: AppProps) {
        super(props);
    }
    public render() {
        return (
            <div className="mx-auto max-width-4">
                Hello World
            </div>
        );
    }
}
