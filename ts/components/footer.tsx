import * as _ from 'lodash';
import * as React from 'react';
import {
  Link,
} from 'react-router-dom';

export interface FooterProps {}

interface FooterState {}

export class Footer extends React.Component<FooterProps, FooterState> {
    public render() {
        return (
            <div className="relative" style={{backgroundColor: '#272727'}}>
                <div className="mx-auto max-width-4 py3 sm-center" style={{color: 'white'}}>
                    team@0xproject.com
                </div>
            </div>
        );
    }
}
