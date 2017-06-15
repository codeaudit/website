import * as React from 'react';
import {Styles} from 'ts/types';
import {utils} from 'ts/utils/utils';
import {
    Link as ScrollLink,
} from 'react-scroll';

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
        let opacity = 0;
        if (this.props.shouldShowAnchor) {
            if (this.state.isHovering) {
                opacity = 0.6;
            } else {
                opacity = 1;
            }
        }
        return (
            <h3 className="relative flex">
                <div
                    className="inline-block"
                    style={{paddingRight: 4}}
                >
                    {this.props.title}
                </div>
                <ScrollLink
                    to={this.props.id}
                    offset={-30}
                    duration={0}
                >
                    <i
                        className="zmdi zmdi-link"
                        onClick={utils.navigateToAnchorId.bind(utils, this.props.id)}
                        style={{...styles.anchor, opacity}}
                        onMouseOver={this.setHoverState.bind(this, true)}
                        onMouseOut={this.setHoverState.bind(this, false)}
                    />
                </ScrollLink>
            </h3>
        );
    }
    private setHoverState(isHovering: boolean) {
        this.setState({
            isHovering,
        });
    }
}
