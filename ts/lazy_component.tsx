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
    public componentWillMount() {
        this.loadComponentFireAndForgetAsync(this.props);
    }
    public componentWillReceiveProps(nextProps: LazyComponentProps) {
        if (nextProps.componentPromise !== this.props.componentPromise) {
          this.loadComponentFireAndForgetAsync(nextProps);
        }
    }
    public render() {
        return _.isUndefined(this.state.component) ?
                null :
                React.createElement(this.state.component, this.props.componentProps);
    }
    private async loadComponentFireAndForgetAsync(props: LazyComponentProps) {
        this.setState({
            component: undefined,
        });
        const component = await props.componentPromise;
        this.setState({
            component,
        });
    }
}
