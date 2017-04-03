import * as _ from 'lodash';
import * as React from 'react';
import {Toggle} from 'material-ui';
import {Step} from 'ts/components/ui/step';
import {Direction, Side} from 'ts/types';
import {Dispatcher} from 'ts/redux/dispatcher';
import {HelpTooltip} from 'ts/components/ui/help_tooltip';
import {Blockchain} from 'ts/blockchain';
import {ExpirationInput} from 'ts/components/inputs/expiration_input';
import {OrderAddressInput} from 'ts/components/inputs/order_address_input';

interface RemainingConfigsProps {
    blockchain: Blockchain;
    orderExpiryTimestamp: number;
    orderTakerAddress: string;
    dispatcher: Dispatcher;
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
        const dispatcher = this.props.dispatcher;
        return (
            <Step
                title="Additional options"
                actionButtonText="Continue"
                hasActionButton={true}
                hasBackButton={true}
                onNavigateClick={dispatcher.updateGenerateOrderStep.bind(dispatcher)}
            >
                <div className="mx-auto pt3" style={{width: 295}}>
                    <div>Choose an order expiry date and time</div>
                    <ExpirationInput
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        updateOrderExpiry={dispatcher.updateOrderExpiry.bind(dispatcher)}
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
        const dispatcher = this.props.dispatcher;
        return (
            <OrderAddressInput
                side={Side.receive}
                label="Taker ethereum address"
                blockchain={this.props.blockchain}
                initialOrderAddress={this.props.orderTakerAddress}
                updateOrderAddress={dispatcher.updateOrderAddress.bind(dispatcher)}
            />
        );
    }
    private onPointToPointToggled(e: any, isPointToPoint: boolean) {
        this.setState({
            isPointToPoint,
        });
        this.props.dispatcher.updateOrderAddress(Side.Receive, '');
    }
}
