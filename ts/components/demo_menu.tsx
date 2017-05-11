import * as _ from 'lodash';
import * as React from 'react';
import {MenuItem} from 'ts/components/ui/menu_item';
import {Link} from 'react-router-dom';

export interface DemoMenuProps {
    menuItemStyle: React.CSSProperties;
    onClick?: () => void;
}

interface DemoMenuState {}

export class DemoMenu extends React.Component<DemoMenuProps, DemoMenuState> {
    public static defaultProps: Partial<DemoMenuProps> = {
        onClick: _.noop,
    };
    public render() {
        return (
            <div>
                <MenuItem
                    style={this.props.menuItemStyle}
                    to="/demo"
                    onClick={this.props.onClick.bind(this)}
                >
                    {this.renderMenuItemWithIcon('Generate order', 'zmdi-code')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    to="/demo/fill"
                    onClick={this.props.onClick.bind(this)}
                >
                    {this.renderMenuItemWithIcon('Fill order', 'zmdi-mail-send')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    to="/demo/balances"
                    onClick={this.props.onClick.bind(this)}
                >
                    {this.renderMenuItemWithIcon('Balances', 'zmdi-balance-wallet')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    to="/demo/trades"
                    onClick={this.props.onClick.bind(this)}
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
                    <i style={{fontSize: 20}} className={`zmdi ${iconName}`} />
                </div>
                <div className="pl1">
                    {title}
                </div>
            </div>
        );
    }
}
