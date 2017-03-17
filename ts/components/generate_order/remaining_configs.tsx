import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {RaisedButton, DatePicker, TimePicker, Toggle, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Step} from 'ts/components/ui/step';
import {Direction, Side} from 'ts/types';
import {HelpTooltip} from 'ts/components/ui/help_tooltip';

interface RemainingConfigsProps {
    orderExpiryTimestamp: number;
    orderTakerAddress: string;
    updateGenerateOrderStep(direction: Direction): void;
    updateOrderExpiry(unixTimestampSec: number): void;
    updateOrderTakerAddress(taker: string): void;
}

interface RemainingConfigsState {
    date: Date;
    isPointToPoint: boolean;
    orderTakerAddress: string;
    time: Date;
}

export class RemainingConfigs extends React.Component<RemainingConfigsProps, RemainingConfigsState> {
    constructor(props: RemainingConfigsProps) {
        super(props);
        const dateTime = utils.convertToDateTimeFromUnixTimestamp(props.orderExpiryTimestamp);
        const didUserSetExpiry = utils.initialOrderExpiryUnixTimestampSec() !== props.orderExpiryTimestamp;
        this.state = {
            date: didUserSetExpiry ? dateTime : undefined,
            isPointToPoint: !_.isEmpty(this.props.orderTakerAddress),
            orderTakerAddress: this.props.orderTakerAddress,
            time: didUserSetExpiry ? dateTime : undefined,
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
                    <div className="flex">
                        <DatePicker
                            className="mr2"
                            textFieldStyle={{width: 125}}
                            hintText="Expiry date"
                            mode="landscape"
                            value={this.state.date}
                            onChange={this.onDateChanged.bind(this)}
                        />
                        <TimePicker
                            textFieldStyle={{width: 125}}
                            hintText="time"
                            autoOk={true}
                            value={this.state.time}
                            onChange={this.onTimeChanged.bind(this)}
                        />
                        <div
                            onClick={this.clearDates.bind(this)}
                            className="pt2 pl2"
                        >
                            <i style={{fontSize: 16, cursor: 'pointer'}} className="material-icons">clear</i>
                        </div>
                    </div>
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
            <div>
                <TextField
                    style={{height: 60}}
                    floatingLabelStyle={{marginTop: -15}}
                    inputStyle={{marginTop: 0}}
                    floatingLabelText="Taker ethereum address"
                    value={this.state.orderTakerAddress}
                    onChange={this.onOrderTakerAddressUpdated.bind(this)}
                />
            </div>
        );
    }
    private clearDates() {
        this.setState({
            date: undefined,
            time: undefined,
        });
        const defaultDateTime = utils.initialOrderExpiryUnixTimestampSec();
        this.props.updateOrderExpiry(defaultDateTime);
    }
    private onBackButtonClick() {
        this.props.updateGenerateOrderStep(Direction.backward);
    }
    private onOrderTakerAddressUpdated(e: any) {
        const orderTakerAddress = e.target.value;
        this.setState({
            orderTakerAddress,
        });
        this.props.updateOrderTakerAddress(orderTakerAddress);
    }
    private onPointToPointToggled(e: any, isPointToPoint: boolean) {
        this.setState({
            isPointToPoint,
            orderTakerAddress: isPointToPoint ? this.state.orderTakerAddress : '',
        });
        this.props.updateOrderTakerAddress('');
    }
    private onDateChanged(e: any, date: Date) {
        this.setState({
            date,
        });
        const timestamp = utils.convertToUnixTimestampSeconds(date, this.state.time);
        this.props.updateOrderExpiry(timestamp);
    }
    private onTimeChanged(e: any, dateTime: Date) {
        this.setState({
            time: dateTime,
        });
        const timestamp = utils.convertToUnixTimestampSeconds(this.state.date, dateTime);
        this.props.updateOrderExpiry(timestamp);
    }
}
