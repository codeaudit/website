import * as React from 'react';
import * as _ from 'lodash';

interface LazyComponentProps {
    componentPromise: Promise<React.ComponentClass<any>>;
    componentProps: any;
}

interface LazyComponentState {
    component?: React.ComponentClass<any>;
}

export class LazyComponent extends React.Component<LazyComponentProps, LazyComponentState> {
    constructor(props: LazyComponentProps) {
        super(props);
        this.state = {
            component: undefined,
        };
    }
    public async componentWillMount() {
        await this.loadComponentAsync(this.props);
    }
    public async componentWillReceiveProps(nextProps: LazyComponentProps) {
        if (nextProps.componentPromise !== this.props.componentPromise) {
          await this.loadComponentAsync(nextProps);
        }
    }
    public render() {
        return _.isUndefined(this.state.component) ?
                null :
                React.createElement(this.state.component, this.props.componentProps);
    }
    private async loadComponentAsync(props: LazyComponentProps) {
        this.setState({
            component: undefined,
        });
        const component = await props.componentPromise;
        this.setState({
            component,
        });
    }
}
