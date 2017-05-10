import * as _ from 'lodash';
import * as React from 'react';
import {Styles} from 'ts/types';
import {MenuItem} from 'ts/components/ui/menu_item';
import {Link} from 'react-router-dom';

const styles: Styles = {
    menuIcon: {
        fontSize: 20,
    },
};

export interface DemoMenuProps {
    menuItemStyle: React.CSSProperties;
    onClick?: () => void;
}

interface DemoMenuState {}

export class DemoMenu extends React.Component<DemoMenuProps, DemoMenuState> {
    public render() {
        return (
            <div>
                <MenuItem
                    style={this.props.menuItemStyle}
                    to="/demo"
                    onClick={this.props.onClick ? this.props.onClick.bind(this) : _.noop}
                >
                    {this.renderMenuItemWithIcon('Generate order', 'zmdi-code')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    to="/demo/fill"
                    onClick={this.props.onClick ? this.props.onClick.bind(this) : _.noop}
                >
                    {this.renderMenuItemWithIcon('Fill order', 'zmdi-mail-send')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    to="/demo/balances"
                    onClick={this.props.onClick ? this.props.onClick.bind(this) : _.noop}
                >
                    {this.renderMenuItemWithIcon('Balances', 'zmdi-balance-wallet')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    to="/demo/trades"
                    onClick={this.props.onClick ? this.props.onClick.bind(this) : _.noop}
                >
                    {this.renderMenuItemWithIcon('Trade history', 'zmdi-book')}
                </MenuItem>
            </div>
        );
    }
    private renderMenuItemWithIcon(title: string, iconName: string) {
        return (
            <div className="flex" style={{fontWeight: 100}}>
                <div className="pr1 pl2">
                    <i style={styles.menuIcon} className={`zmdi ${iconName}`} />
                </div>
                <div className="pl1">
                    {title}
                </div>
            </div>
        );
    }
}
