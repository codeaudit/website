import * as React from 'react';
import {DatePicker, TimePicker} from 'material-ui';
import {utils} from 'ts/utils/utils';
import BigNumber = require('bignumber.js');
import * as moment from 'moment';

interface ExpirationInputProps {
    orderExpiryTimestamp: BigNumber;
    updateOrderExpiry: (unixTimestampSec: BigNumber) => void;
}

interface ExpirationInputState {
    date: moment.Moment;
    time: moment.Moment;
}

export class ExpirationInput extends React.Component<ExpirationInputProps, ExpirationInputState> {
    private earliestPickerableMoment: moment.Moment;
    constructor(props: ExpirationInputProps) {
        super(props);
        // Set the earliest pickable date to today at 00:00, so users can only pick the current or later dates
        this.earliestPickerableMoment = moment().startOf('day');
        const expireMoment = utils.convertToMomentFromUnixTimestamp(props.orderExpiryTimestamp);
        const initialOrderExpiryTimestamp = utils.initialOrderExpiryUnixTimestampSec();
        const didUserSetExpiry = !initialOrderExpiryTimestamp.eq(props.orderExpiryTimestamp);
        this.state = {
            date: didUserSetExpiry ? expireMoment : undefined,
            time: didUserSetExpiry ? expireMoment : undefined,
        };
    }
    public render() {
        const date = this.state.date ? this.state.date.toDate() : undefined;
        const time = this.state.time ? this.state.time.toDate() : undefined;
        return (
            <div className="clearfix">
                <div className="col col-6 overflow-hidden pr3">
                    <DatePicker
                        className="overflow-hidden"
                        hintText="Date"
                        mode="landscape"
                        autoOk={true}
                        value={date}
                        onChange={this.onDateChanged.bind(this)}
                        shouldDisableDate={this.shouldDisableDate.bind(this)}
                    />
                </div>
                <div className="col col-5 overflow-hidden">
                    <TimePicker
                        className="overflow-hidden"
                        hintText="Time"
                        autoOk={true}
                        value={time}
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
        return moment(date).startOf('day').isBefore(this.earliestPickerableMoment);
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
        const newDate = moment(date);
        this.setState({
            date: newDate,
        });
        const timestamp = utils.convertToUnixTimestampSeconds(newDate, this.state.time);
        this.props.updateOrderExpiry(timestamp);
    }
    private onTimeChanged(e: any, time: Date) {
        const newTime = moment(time);
        this.setState({
            time: newTime,
        });
        const timestamp = utils.convertToUnixTimestampSeconds(this.state.date, newTime);
        this.props.updateOrderExpiry(timestamp);
    }
}
