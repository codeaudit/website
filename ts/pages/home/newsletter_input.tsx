import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';

const ENTER_KEY_CODE = 13;

interface NewsletterInputProps {}

interface NewsletterInputState {
    email: string;
    errMsg: string;
    didAttemptSubmit: boolean;
    wasSuccessfullySubscribed: boolean;
}

export class NewsletterInput extends React.Component<NewsletterInputProps, NewsletterInputState> {
    constructor(props: NewsletterInputProps) {
        super(props);
        this.state = {
            email: '',
            errMsg: '',
            didAttemptSubmit: false,
            wasSuccessfullySubscribed: false,
        };
    }
    public render() {
        const errMsg = this.state.didAttemptSubmit ? this.state.errMsg : '';
        return (
            <div>
                <TextField
                    fullWidth={true}
                    hintText="Email address"
                    hintStyle={{color: '#e6e6e6'}}
                    inputStyle={{color: '#e6e6e6'}}
                    floatingLabelFixed={true}
                    floatingLabelStyle={{color: colors.grey500, display: 'hidden'}}
                    errorText={errMsg}
                    value={this.state.email}
                    onChange={this.onEmailUpdated.bind(this)}
                    onKeyPress={this.onEmailSubmit.bind(this)}
                />
                {this.state.wasSuccessfullySubscribed && 'Subscription successful!'}
            </div>
        );
    }
    private onEmailSubmit(e: any) {
        if (e.charCode === ENTER_KEY_CODE) {
            this.setState({
                didAttemptSubmit: true,
            });
            this.submitEmailAsync();
        }
    }
    private onEmailUpdated(e: any) {
        const email = e.target.value;
        let errMsg = '';
        if (!this.isValidEmail(email) && !_.isEmpty(email)) {
            errMsg = 'Must be a valid email address';
        }
        this.setState({
            errMsg,
            email,
            wasSuccessfullySubscribed: false,
        });
    }
    private async submitEmailAsync() {
        if (!this.isValidEmail(this.state.email)) {
            return;
        }

        const endpoint = `${constants.BACKEND_BASE_URL}/newsletter_subscriber/${this.state.email}`;
        const response = await fetch(endpoint);
        const responseText = await response.text();
        if (response.status === 200) {
            this.setState({
                wasSuccessfullySubscribed: true,
            });
            return;
        } else {
            let errMsg;
            switch (responseText) {
                case 'ALREADY_SUBSCRIBED':
                    errMsg = 'Email address already subscribed to newsletter';
                    break;

                case 'INVALID_EMAIL':
                    errMsg = 'Email address is invalid';
                    break;

                case 'UNEXPECTED_ERROR':
                    errMsg = 'Something went wrong. Please try again later';
                    break;

                default:
                    throw utils.spawnSwitchErr('responseText', responseText);
            }
            this.setState({
                errMsg,
            });
        }
    }
    private isValidEmail(email: string): boolean {
        // Source: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        /* tslint:disable */
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        /* tslint:enable */
        return re.test(email);
    }
}
