import * as _ from 'lodash';
import * as React from 'react';
import {Blockchain} from 'ts/blockchain';
import {Dispatcher} from 'ts/redux/dispatcher';
import {Toggle} from 'material-ui';
import {Token, BalanceErrs} from 'ts/types';
import {utils} from 'ts/utils/utils';
import {errorReporter} from 'ts/utils/error_reporter';
import {zeroEx} from 'ts/utils/zero_ex';
import BigNumber = require('bignumber.js');

const DEFAULT_ALLOWANCE_AMOUNT_IN_UNITS = 1000000;

interface AllowanceToggleProps {
    blockchain: Blockchain;
    dispatcher: Dispatcher;
    onErrorOccurred: (errType: BalanceErrs) => void;
    token: Token;
    userAddress: string;
}

interface AllowanceToggleState {
    isSpinnerVisible: boolean;
    prevAllowance: BigNumber;
}

export class AllowanceToggle extends React.Component<AllowanceToggleProps, AllowanceToggleState> {
    constructor(props: AllowanceToggleProps) {
        super(props);
        this.state = {
            isSpinnerVisible: false,
            prevAllowance: props.token.allowance,
        };
    }
    public componentWillReceiveProps(nextProps: AllowanceToggleProps) {
        if (!nextProps.token.allowance.eq(this.state.prevAllowance)) {
            this.setState({
                isSpinnerVisible: false,
                prevAllowance: nextProps.token.allowance,
            });
        }
    }
    public render() {
        return (
            <div className="flex">
                <div>
                    <Toggle
                        disabled={this.state.isSpinnerVisible}
                        toggled={this.isAllowanceSet(this.props.token)}
                        onToggle={this.onToggleAllowanceAsync.bind(this, this.props.token)}
                    />
                </div>
                {this.state.isSpinnerVisible &&
                    <div className="pl1" style={{paddingTop: 3}}>
                        <i className="zmdi zmdi-spinner zmdi-hc-spin" />
                    </div>
                }
            </div>
        );
    }
    private async onToggleAllowanceAsync(assetToken: Token) {
        if (this.props.userAddress === '') {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return false;
        }

        this.setState({
            isSpinnerVisible: true,
        });

        // Hack: for some reason setting allowance to 0 causes a `base fee exceeds gas limit` exception
        // Any edits to this hack should include changes to the `isAllowanceSet` method below
        // TODO: Investigate root cause for why allowance cannot be set to 0
        let newAllowanceAmountInUnits = 1;
        if (!this.isAllowanceSet(assetToken)) {
            newAllowanceAmountInUnits = DEFAULT_ALLOWANCE_AMOUNT_IN_UNITS;
        }
        try {
            const amountInBaseUnits = zeroEx.toBaseUnitAmount(newAllowanceAmountInUnits, this.props.token.decimals);
            await this.props.blockchain.setExchangeAllowanceAsync(this.props.token, amountInBaseUnits);
        } catch (err) {
            this.setState({
                isSpinnerVisible: false,
            });
            const errMsg = '' + err;
            if (_.includes(errMsg, 'User denied transaction')) {
                return false;
            }
            utils.consoleLog(`Unexpected error encountered: ${err}`);
            utils.consoleLog(err.stack);
            await errorReporter.reportAsync(err);
            this.props.onErrorOccurred(BalanceErrs.allowanceSettingFailed);
        }
    }
    private isAllowanceSet(token: Token) {
        return !token.allowance.eq(0) && !token.allowance.eq(1);
    }
}
