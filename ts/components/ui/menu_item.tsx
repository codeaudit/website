import * as _ from 'lodash';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {constants} from 'ts/utils/constants';
import {colors} from 'material-ui/styles';

interface MenuItemProps {
    to: string;
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
            <Link to={this.props.to} style={{textDecoration: 'none', color: 'white'}}>
                <div
                    className="mx-auto py2"
                    style={menuItemStyles}
                    onMouseEnter={this.onToggleHover.bind(this, true)}
                    onMouseLeave={this.onToggleHover.bind(this, false)}
                >
                    {this.props.children}
                </div>
            </Link>
        );
    }
    private onToggleHover(isHovering: boolean) {
        this.setState({
            isHovering,
        });
    }
}
