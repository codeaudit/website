import * as _ from 'lodash';
import * as React from 'react';
import {DatePicker, TimePicker} from 'material-ui';
import {utils} from 'ts/utils/utils';

interface ExpirationInputProps {
    orderExpiryTimestamp: number;
    updateOrderExpiry: (unixTimestampSec: number) => void;
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
        const didUserSetExpiry = utils.initialOrderExpiryUnixTimestampSec() !== props.orderExpiryTimestamp;
        this.state = {
            date: didUserSetExpiry ? dateTime : undefined,
            time: didUserSetExpiry ? dateTime : undefined,
        };
    }
    public render() {
        return (
            <div className="flex">
                <DatePicker
                    className="mr2"
                    textFieldStyle={{width: 125}}
                    hintText="Date"
                    mode="landscape"
                    value={this.state.date}
                    onChange={this.onDateChanged.bind(this)}
                    shouldDisableDate={this.shouldDisableDate.bind(this)}
                />
                <TimePicker
                    textFieldStyle={{width: 125}}
                    hintText="Time"
                    autoOk={true}
                    value={this.state.time}
                    onChange={this.onTimeChanged.bind(this)}
                />
                <div
                    onClick={this.clearDates.bind(this)}
                    className="pt2 pl2"
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
