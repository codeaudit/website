import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, Slider} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Direction, SideToAssetToken, Side, AssetToken} from 'ts/types';
import {Step} from 'ts/components/ui/step';
import {VennDiagram} from 'ts/components/ui/venn_diagram';
import {HelpTooltip} from 'ts/components/ui/help_tooltip';

const PRECISION = 5;
const BALANCE = 134.56;

interface GrantAllowanceProps {
    sideToAssetToken: SideToAssetToken;
    updateGenerateOrderStep(direction: Direction): void;
    updateChosenAssetToken(side: Side, token: AssetToken): void;
}

interface GrantAllowanceState {
    initialDepositAmount: number;
    initialReceiveAmount: number;
    depositAmount: number;
    receiveAmount: number;
    globalErrMsg: string;
}

export class GrantAllowance extends React.Component<GrantAllowanceProps, GrantAllowanceState> {
    constructor(props: GrantAllowanceProps) {
        super(props);
        const depositAmount = props.sideToAssetToken[Side.deposit].amount;
        const receiveAmount = props.sideToAssetToken[Side.receive].amount;
        if (depositAmount === 0 || receiveAmount === 0) {
            throw new Error('depositAmount & receiveAmount cannot equal 0');
        }
        this.state = {
            depositAmount: depositAmount <= BALANCE ? depositAmount : BALANCE,
            globalErrMsg: '',
            initialDepositAmount: depositAmount,
            initialReceiveAmount: receiveAmount,
            receiveAmount,
        };
    }
    public render() {
        const depositSymbol = this.props.sideToAssetToken[Side.deposit].symbol;
        const receiveSymbol = this.props.sideToAssetToken[Side.receive].symbol;
        const roundedDepositAmount = this.state.depositAmount.toFixed(2);
        const intersectionKey = `Allowance (${roundedDepositAmount} ${depositSymbol})`;
        const allowanceExplanationText = `In order for the 0x exchange smart contract to trade tokens
                                        on your behalf, you must authorize it to move your tokens when
                                        someone decides to fill your order. You do this by setting an
                                        ERC20 standard allowance for the contract in this step. Until
                                        this order is filled, your deposit remains in your account and
                                        under your control.`;
        const allowanceExplanation = (
            <div style={{width: 300}}>
                {allowanceExplanationText}
            </div>
        );
        const title = (
            <div className="flex relative">
                <div>Grant the 0x smart contract access to your tokens{' '}</div>
                <div className="absolute" style={{right: 5, top: 2}}>
                    <HelpTooltip explanation={allowanceExplanation} />
                </div>
            </div>
        );
        return (
            <Step
                title={title}
                actionButtonText="Grant allowance"
                hasActionButton={true}
                hasBackButton={true}
                onNavigateClick={this.onGrantAllowanceClick.bind(this)}
            >
                <VennDiagram
                    total={BALANCE}
                    amountSet={this.props.sideToAssetToken[Side.deposit].amount}
                    onChange={this.onDepositAmountChanged.bind(this)}
                    leftCircleKey="0x exchange smart contract"
                    rightCircleKey={`Your account (${BALANCE.toFixed(2)} ${depositSymbol})`}
                    intersectionKey={intersectionKey}
                />
                <div className="center pt2">
                    {this.renderAmount('You will receive', this.state.receiveAmount, receiveSymbol)}
                </div>
                {this.state.globalErrMsg && this.renderGlobalErrMsg()}
            </Step>
        );
    }
    private renderGlobalErrMsg() {
        const errMsgStyles = {
            background: colors.red200,
            color: 'white',
            padding: 4,
            paddingLeft: 8,
        };
        return (
            <div className="rounded" style={errMsgStyles}>
                {this.state.globalErrMsg}
            </div>
        );
    }
    private renderAmount(label: string, amount: number, symbol: string) {
        return (
            <div className="pb1">
                <span style={{color: colors.grey500}}>{label}:{' '}</span>
                {amount.toFixed(PRECISION)}
                <span style={{fontSize: 13}}>{' '}{symbol}</span>
            </div>
        );
    }
    private onGrantAllowanceClick(direction: Direction) {
        if (this.state.depositAmount === 0) {
            this.setState({
                globalErrMsg: 'Allowance must be greater then zero',
            });
        } else {
            this.props.updateGenerateOrderStep(direction);
        }
    }
    private onDepositAmountChanged(depositAmount: number) {
        const exchangeRate = this.state.initialReceiveAmount / this.state.initialDepositAmount;
        const receiveAmount = exchangeRate * depositAmount;
        this.setState({
            depositAmount,
            receiveAmount,
        });
        const depositAssetToken = this.props.sideToAssetToken[Side.deposit];
        depositAssetToken.amount = depositAmount;
        const receiveAssetToken = this.props.sideToAssetToken[Side.receive];
        receiveAssetToken.amount = receiveAmount;
        this.props.updateChosenAssetToken(Side.deposit, depositAssetToken);
        this.props.updateChosenAssetToken(Side.receive, receiveAssetToken);
    }
}
