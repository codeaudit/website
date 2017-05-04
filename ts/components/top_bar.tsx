import * as _ from 'lodash';
import * as React from 'react';
import {AppBar, Drawer, MenuItem} from 'material-ui';
import {colors} from 'material-ui/styles';
import ReactTooltip = require('react-tooltip');
import {Identicon} from 'ts/components/ui/identicon';
import {Styles} from 'ts/types';
import {
    Link as ScrollLink,
    Element as ScrollElement,
    animateScroll,
} from 'react-scroll';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';

interface TopBarProps {
    userAddress?: string;
    blockchainIsLoaded: boolean;
    location: Location;
}

interface TopBarState {
    isDrawerOpen: boolean;
}

const styles: Styles = {
    address: {
        marginRight: 12,
        overflow: 'hidden',
        paddingTop: 4,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: 70,
    },
    addressPopover: {
        backgroundColor: colors.blueGrey500,
        color: 'white',
        padding: 3,
    },
    topBar: {
        backgroundColor: 'white',
        height: 42,
        width: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 1100,
    },
};

export class TopBar extends React.Component<TopBarProps, TopBarState> {
    constructor(props: TopBarProps) {
        super(props);
        this.state = {
            isDrawerOpen: false,
        };
    }
    public render() {
        return (
            <div style={styles.topBar}>
                <div className="flex mx-auto max-width-4">
                    <div className="col col-1">
                        <div
                            className="pt1 sm-pl2 md-pl2 lg-pl0"
                            style={{fontSize: 25, color: 'black', cursor: 'pointer'}}
                        >
                            <i
                                className="zmdi zmdi-menu"
                                onClick={this.onMenuButtonClick.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="col col-8" />
                    <div className="col col-3">
                        {this.renderUser()}
                    </div>
                </div>
                {this.renderDrawer()}
            </div>
        );
    }
    private renderDrawer() {
        return (
            <Drawer
                open={this.state.isDrawerOpen}
                docked={false}
                onRequestChange={this.onMenuButtonClick.bind(this)}
            >
                {this.renderHomepageMenuItem('home')}
                <a
                    className="text-decoration-none"
                    target="_blank"
                    href="https://www.0xproject.com/whitepaper/0x_white_paper.pdf"
                >
                    <MenuItem>Whitepaper</MenuItem>
                </a>
                {this.renderHomepageMenuItem('partners')}
                {this.renderHomepageMenuItem('team')}
                {this.renderHomepageMenuItem('advisors')}
                {this.renderHomepageMenuItem('investors')}
                <Link to="/faq" className="text-decoration-none">
                    <MenuItem onTouchTap={this.onMenuButtonClick.bind(this)}>
                        FAQ
                    </MenuItem>
                </Link>
                <Link to="/demo" className="text-decoration-none">
                    <MenuItem>Demo</MenuItem>
                </Link>
            </Drawer>
        );
    }
    private renderTeamMenuItem() {
        if (this.props.location.pathname === '/') {
            return (
                <ScrollLink
                    to="team"
                    smooth={true}
                    offset={0}
                    duration={500}
                >
                    <MenuItem onTouchTap={this.onMenuButtonClick.bind(this)}>
                        Team
                    </MenuItem>
                </ScrollLink>
            );
        } else {
            return (
                <HashLink to="/#team" className="text-decoration-none">
                    <MenuItem onTouchTap={this.onMenuButtonClick.bind(this)}>
                        Team
                    </MenuItem>
                </HashLink>
            );
        }
    }
    private renderHomepageMenuItem(location: string) {
        if (this.props.location.pathname === '/') {
            return (
                <ScrollLink
                    to={location}
                    smooth={true}
                    offset={0}
                    duration={500}
                >
                    <MenuItem onTouchTap={this.onMenuButtonClick.bind(this)}>
                        {_.capitalize(location)}
                    </MenuItem>
                </ScrollLink>
            );
        } else {
            return (
                <HashLink to={`/#${location}`} className="text-decoration-none">
                    <MenuItem onTouchTap={this.onMenuButtonClick.bind(this)}>
                        {_.capitalize(location)}
                    </MenuItem>
                </HashLink>
            );
        }
    }
    private renderUser() {
        if (!this.props.blockchainIsLoaded || this.props.userAddress === '') {
            return <span />;
        }

        const userAddress = this.props.userAddress;
        return (
            <div className="flex right pt1 lg-pr0 md-pr2 sm-pr2">
                <div
                    style={styles.address}
                    data-tip={true}
                    data-for="userAddressTooltip"
                >
                    {!_.isEmpty(userAddress) ? userAddress : ''}
                </div>
                <ReactTooltip id="userAddressTooltip">{userAddress}</ReactTooltip>
                <div>
                    <Identicon address={userAddress} diameter={25} />
                </div>
            </div>
        );
    }
    private onMenuButtonClick() {
        this.setState({
            isDrawerOpen: !this.state.isDrawerOpen,
        });
    }
}
