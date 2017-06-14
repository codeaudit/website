import * as _ from 'lodash';
import * as React from 'react';
import {MenuItem} from 'ts/components/ui/menu_item';
import {Link} from 'react-router-dom';

export interface OTCMenuProps {
    menuItemStyle: React.CSSProperties;
    onClick?: () => void;
}

interface OTCMenuState {}

export class OTCMenu extends React.Component<OTCMenuProps, OTCMenuState> {
    public static defaultProps: Partial<OTCMenuProps> = {
        onClick: _.noop,
    };
    public render() {
        return (
            <div>
                <MenuItem
                    style={this.props.menuItemStyle}
                    className="py2"
                    to="/otc"
                    onClick={this.props.onClick.bind(this)}
                >
                    {this.renderMenuItemWithIcon('Generate order', 'zmdi-arrow-right-top')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    className="py2"
                    to="/otc/fill"
                    onClick={this.props.onClick.bind(this)}
                >
                    {this.renderMenuItemWithIcon('Fill order', 'zmdi-arrow-left-bottom')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    className="py2"
                    to="/otc/balances"
                    onClick={this.props.onClick.bind(this)}
                >
                    {this.renderMenuItemWithIcon('Balances', 'zmdi-balance-wallet')}
                </MenuItem>
                <MenuItem
                    style={this.props.menuItemStyle}
                    className="py2"
                    to="/otc/trades"
                    onClick={this.props.onClick.bind(this)}
                >
                    {this.renderMenuItemWithIcon('Trade history', 'zmdi-format-list-bulleted')}
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
