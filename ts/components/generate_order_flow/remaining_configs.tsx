import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {RaisedButton, DatePicker, TimePicker, Toggle, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Step} from 'ts/components/ui/step';
import {Direction, Side} from 'ts/types';
import {HelpTooltip} from 'ts/components/ui/help_tooltip';
import {Blockchain} from 'ts/blockchain';
import {ExpirationInput} from 'ts/components/inputs/expiration_input';
import {OrderAddressInput} from 'ts/components/inputs/order_address_input';

interface RemainingConfigsProps {
    blockchain: Blockchain;
    orderExpiryTimestamp: number;
    orderTakerAddress: string;
    updateGenerateOrderStep: (direction: Direction) => void;
    updateOrderExpiry: (unixTimestampSec: number) => void;
    updateOrderAddress: (side: Side, address: string) => void;
}

interface RemainingConfigsState {
    isPointToPoint: boolean;
}

export class RemainingConfigs extends React.Component<RemainingConfigsProps, RemainingConfigsState> {
    constructor(props: RemainingConfigsProps) {
        super(props);
        this.state = {
            isPointToPoint: !_.isEmpty(this.props.orderTakerAddress),
        };
    }
    public render() {
        const pointToPointExplanationText = `Point-to-point orders allow two parties to directly
                                            exchange tokens. By specifing a taker address, the order
                                            is rendered useless to eavesdroppers or outside parties.`;
        const pointToPointExplanation = (
            <div style={{width: 300}}>
                {pointToPointExplanationText}
            </div>
        );
        return (
            <Step
                title="Additional options"
                actionButtonText="Continue"
                hasActionButton={true}
                hasBackButton={true}
                onNavigateClick={this.props.updateGenerateOrderStep}
            >
                <div className="mx-auto pt3" style={{width: 295}}>
                    <div>Choose an order expiry date and time</div>
                    <ExpirationInput
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        updateOrderExpiry={this.props.updateOrderExpiry}
                    />
                    <div className="pt4">
                        <div className="flex">
                            <Toggle
                                label="This is a point-to-point transaction"
                                labelPosition="right"
                                toggled={this.state.isPointToPoint}
                                onToggle={this.onPointToPointToggled.bind(this)}
                            />
                            <div style={{paddingTop: 3}}>
                                <HelpTooltip
                                    explanation={pointToPointExplanation}
                                />
                            </div>
                        </div>
                        {this.state.isPointToPoint && this.renderTakerInput()}
                    </div>
                </div>
            </Step>
        );
    }
    private renderTakerInput() {
        return (
            <OrderAddressInput
                side={Side.receive}
                label="Taker ethereum address"
                blockchain={this.props.blockchain}
                initialOrderAddress={this.props.orderTakerAddress}
                updateOrderAddress={this.props.updateOrderAddress}
            />
        );
    }
    private onBackButtonClick() {
        this.props.updateGenerateOrderStep(Direction.backward);
    }
    private onPointToPointToggled(e: any, isPointToPoint: boolean) {
        this.setState({
            isPointToPoint,
        });
        this.props.updateOrderAddress(Side.Receive, '');
    }
}
