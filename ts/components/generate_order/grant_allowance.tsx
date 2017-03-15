import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, TextField, FontIcon} from 'material-ui';
import {colors} from 'material-ui/styles';
import {generateOrderSteps} from 'ts/types';

interface GrantAllowanceProps {
    updateGenerateOrderStep(step: generateOrderSteps): void;
}

export class GrantAllowance extends React.Component<GrantAllowanceProps, undefined> {
    public render() {
        return (
            <div className="relative">
                <div
                    className="absolute"
                    style={{left: 15, cursor: 'pointer'}}
                    onClick={this.props.updateGenerateOrderStep.bind(this, generateOrderSteps.chooseAssets)}
                >
                    <i className="material-icons">arrow_back</i>
                </div>
                <h3 className="center">Grant the 0x smart contract access to your deposit</h3>
                <div className="flex pt2 pb3 px4">
                    TODO
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
}
