import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, Slider} from 'material-ui';
import {colors} from 'material-ui/styles';
import {generateOrderSteps, SideToAssetToken, Side} from 'ts/types';
import {VennDiagram} from 'ts/components/ui/venn_diagram';

const PRECISION = 5;
const BALANCE = 134.56;

interface GrantAllowanceProps {
    sideToAssetToken: SideToAssetToken;
    updateGenerateOrderStep(step: generateOrderSteps): void;
}

interface GrantAllowanceState {
    depositAmount: number;
    receiveAmount: number;
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
            receiveAmount,
        };
    }
    public render() {
        const depositSymbol = this.props.sideToAssetToken[Side.deposit].symbol;
        const receiveSymbol = this.props.sideToAssetToken[Side.receive].symbol;
        return (
            <div className="relative">
                <div
                    className="absolute"
                    style={{left: 15, cursor: 'pointer'}}
                    onClick={this.props.updateGenerateOrderStep.bind(this, generateOrderSteps.chooseAssets)}
                >
                    <i className="material-icons">arrow_back</i>
                </div>
                <h3 className="px4">
                    Grant the 0x smart contract access to your deposit
                </h3>
                <div className="pt2 pb2 px4">
                    <VennDiagram
                        total={BALANCE}
                        amountSet={this.props.sideToAssetToken[Side.deposit].amount}
                        onChange={this.depositAmountChanged.bind(this)}
                    />
                    <div className="mx-auto" style={{width: 185}}>
                        {this.renderAmount('Deposit', this.state.depositAmount, depositSymbol)}
                        {this.renderAmount('Receive', this.state.receiveAmount, receiveSymbol)}
                        {this.renderAmount('Balance', BALANCE, depositSymbol)}
                    </div>
                </div>
                <div className="flex">
                    <RaisedButton
                        label="Grant access"
                        style={{margin: 12, width: '100%'}}
                        onClick={this.props.updateGenerateOrderStep.bind(this, 'TODO')}
                    />
                </div>
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
    private depositAmountChanged(depositAmount: number) {
        const intialDepositAmount = this.props.sideToAssetToken[Side.deposit].amount;
        const intialReceiveAmount = this.props.sideToAssetToken[Side.receive].amount;
        const exchangeRate = intialReceiveAmount / intialDepositAmount;
        const receiveAmount = exchangeRate * depositAmount;
        this.setState({
            depositAmount,
            receiveAmount,
        });
    }
}
