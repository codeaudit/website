import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';

interface GrantAllowanceProps {}

export class GrantAllowance extends React.Component<GrantAllowanceProps, undefined> {
    public render() {
        return (
            <div>
                <h3 className="center">Choose the assets you want to trade</h3>
                <div className="flex pt2 pb3 px4">
                    TODO
                </div>
                <div className="flex">
                    <RaisedButton label="Grant access" style={{margin: 12, width: '100%'}} />
                </div>
            </div>
        );
    }
}
