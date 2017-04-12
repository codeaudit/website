import * as _ from 'lodash';
import * as React from 'react';
import {Popover} from 'material-ui';
import {colors} from 'material-ui/styles';
import ReactTooltip = require('react-tooltip');
import {Identicon} from 'ts/components/ui/identicon';

interface TopBarProps {
    userAddress: string;
    blockchainIsLoaded: boolean;
}

interface TopBarState {
    anchorEl: React.ReactInstance;
    isAddressPopoverOpen: boolean;
}

const styles = {
    address: {
        color: 'white',
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
    logo: {
        color: 'white',
        fontSize: 18,
        paddingLeft: 16,
    },
    topBar: {
        backgroundColor: colors.blueGrey500,
        fontFamily: 'Roboto, sans-serif',
        height: 45,
        width: '100%',
        zIndex: 1100,
    },
};

export class TopBar extends React.Component<TopBarProps, TopBarState> {
    public constructor(props: TopBarProps) {
        super(props);
        this.state = {
            anchorEl: undefined,
            isAddressPopoverOpen: false,
        };
    }
    public render() {
        return (
            <div style={styles.topBar}>
                <div className="flex mx-auto" style={{width: 1024}}>
                    <div className="col col-1">
                        <h1 style={styles.logo}>0x</h1>
                    </div>
                    <div className="col col-8" />
                    <div className="col col-3">
                        {this.renderUser()}
                    </div>
                </div>
            </div>
        );
    }
    private renderUser() {
        if (!this.props.blockchainIsLoaded) {
            return <span />;
        }

        const userAddress = this.props.userAddress;
        return (
            <div className="flex right" style={{padding: '10px 0px 10px 10px'}}>
                <div
                    style={styles.address}
                    onMouseOver={this.toggleAddressPopoverOpen.bind(this, true)}
                >
                    {!_.isEmpty(userAddress) ? userAddress : ''}
                </div>
                <Popover
                    style={styles.addressPopover}
                    open={this.state.isAddressPopoverOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    <div onMouseOut={this.toggleAddressPopoverOpen.bind(this, false)}>
                        {userAddress}
                    </div>
                </Popover>
                <div>
                    <Identicon address={userAddress} diameter={25} />
                </div>
            </div>
        );
    }
    private toggleAddressPopoverOpen(isOpen: boolean, e: any) {
        this.setState({
            anchorEl: e.currentTarget,
            isAddressPopoverOpen: isOpen,
        });
    }
}
