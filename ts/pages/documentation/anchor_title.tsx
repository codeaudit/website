import * as _ from 'lodash';
import * as React from 'react';
import {Styles} from 'ts/types';
import {utils} from 'ts/utils/utils';

interface AnchorTitleProps {
    title: string;
    id: string;
    shouldShowAnchor: boolean;
}

interface AnchorTitleState {
    isHovering: boolean;
}

const styles: Styles = {
    anchor: {
        fontSize: 20,
        transform: 'rotate(45deg)',
        cursor: 'pointer',
    },
};

export class AnchorTitle extends React.Component<AnchorTitleProps, AnchorTitleState> {
    constructor(props: AnchorTitleProps) {
        super(props);
        this.state = {
            isHovering: false,
        };
    }
    public render() {
        return (
            <h3 className="relative">
                <i
                    className="absolute zmdi zmdi-link"
                    onClick={utils.navigateToAnchorId.bind(this, this.props.id)}
                    style={{...styles.anchor, opacity: this.state.isHovering ? 0.6 : 1,
                            display: this.props.shouldShowAnchor ? 'block' : 'none'}}
                    onMouseOver={this.setHoverState.bind(this, true)}
                    onMouseOut={this.setHoverState.bind(this, false)}
                />
                {' '}
                <div
                    className="inline-block"
                    style={{paddingLeft: 22}}
                >
                    {this.props.title}
                </div>
            </h3>
        );
    }
    private setHoverState(isHovering: boolean) {
        this.setState({
            isHovering,
        });
    }
}
