import * as _ from 'lodash';
import * as React from 'react';
import {constants} from 'ts/utils/constants';
import {colors} from 'material-ui/styles';

interface MenuItemProps {
    onClickFn: () => void;
}

interface MenuItemState {
    isHovering: boolean;
}

export class MenuItem extends React.Component<MenuItemProps, MenuItemState> {
    public constructor(props: MenuItemProps) {
        super(props);
        this.state = {
            isHovering: false,
        };
    }
    public render() {
        const menuItemStyles = {
            cursor: 'pointer',
            opacity: this.state.isHovering ? 0.5 : 1,
        };
        return (
            <div
                className="mx-auto py2"
                style={menuItemStyles}
                onClick={this.props.onClickFn}
                onMouseEnter={this.onToggleHover.bind(this, true)}
                onMouseLeave={this.onToggleHover.bind(this, false)}
            >
                {this.props.children}
            </div>
        );
    }
    private onToggleHover(isHovering: boolean) {
        this.setState({
            isHovering,
        });
    }
}
