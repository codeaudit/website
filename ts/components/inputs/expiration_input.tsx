import * as _ from 'lodash';
import * as React from 'react';
import {DatePicker, TimePicker} from 'material-ui';
import {utils} from 'ts/utils/utils';
import BigNumber = require('bignumber.js');

interface ExpirationInputProps {
    orderExpiryTimestamp: BigNumber;
    updateOrderExpiry: (unixTimestampSec: BigNumber) => void;
}

interface ExpirationInputState {
    date: Date;
    time: Date;
}

export class ExpirationInput extends React.Component<ExpirationInputProps, ExpirationInputState> {
    private earliestPickerableDateMs: number;
    constructor(props: ExpirationInputProps) {
        super(props);
        // Set the earliest pickable date to today at 00:00, so users can only pick the current or later dates
        const earliestPickableDate = new Date();
        earliestPickableDate.setHours(0, 0, 0, 0);
        this.earliestPickerableDateMs = Date.parse(earliestPickableDate.toISOString());
        const dateTime = utils.convertToDateTimeFromUnixTimestamp(props.orderExpiryTimestamp);
        const initialOrderExpiryTimestamp = utils.initialOrderExpiryUnixTimestampSec();
        const didUserSetExpiry = !initialOrderExpiryTimestamp.eq(props.orderExpiryTimestamp);
        this.state = {
            date: didUserSetExpiry ? dateTime : undefined,
            time: didUserSetExpiry ? dateTime : undefined,
        };
    }
    public render() {
        return (
            <div className="clearfix">
                <div className="col col-6 overflow-hidden pr3">
                    <DatePicker
                        className="overflow-hidden"
                        hintText="Date"
                        mode="landscape"
                        autoOk={true}
                        value={this.state.date}
                        onChange={this.onDateChanged.bind(this)}
                        shouldDisableDate={this.shouldDisableDate.bind(this)}
                    />
                </div>
                <div className="col col-5 overflow-hidden">
                    <TimePicker
                        className="overflow-hidden"
                        hintText="Time"
                        autoOk={true}
                        value={this.state.time}
                        onChange={this.onTimeChanged.bind(this)}
                    />
                </div>
                <div
                    onClick={this.clearDates.bind(this)}
                    className="col col-1 pt2"
                    style={{textAlign: 'right'}}
                >
                    <i style={{fontSize: 16, cursor: 'pointer'}} className="zmdi zmdi-close" />
                </div>
            </div>
        );
    }
    private shouldDisableDate(date: Date): boolean {
        const unixTimestampMs = Date.parse(date.toISOString());
        return unixTimestampMs < this.earliestPickerableDateMs;
    }
    private clearDates() {
        this.setState({
            date: undefined,
            time: undefined,
        });
        const defaultDateTime = utils.initialOrderExpiryUnixTimestampSec();
        this.props.updateOrderExpiry(defaultDateTime);
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
