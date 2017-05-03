import * as _ from 'lodash';
import * as React from 'react';
import {Styles} from 'ts/types';
import {
  Link,
} from 'react-router-dom';

export interface FooterProps {}

interface FooterState {}

const styles: Styles = {
    icon: {
        color: 'white',
        fontSize: 20,
    },
    text: {
        fontSize: 12,
    },
    slackIcon: {
        backgroundColor: 'white',
        width: 17,
        height: 17,
        marginTop: 1,
        marginLeft: 9,
    },
};

export class Footer extends React.Component<FooterProps, FooterState> {
    public render() {
        return (
            <div className="relative" style={{backgroundColor: '#272727'}}>
                <div className="mx-auto max-width-4 py3 center clearfix" style={{color: 'white'}}>
                    <div
                        className="sm-col sm-col-4 pt1 sm-center md-left-align lg-left-align sm-pb2"
                        style={{...styles.text}}
                    >
                        Copyright © 0xProject
                    </div>
                    <div className="sm-col sm-col-4 clearfix sm-pb2">
                        <div className="mx-auto" style={{width: 145}}>
                            <div className="col col-3 pt1">
                                <a href="https://github.com/0xProject" target="_blank">
                                    <i className="zmdi zmdi-github-box" style={{...styles.icon}} />
                                </a>
                            </div>
                            <div className="col col-3 pt1">
                                <a href="https://twitter.com/0xproject" target="_blank">
                                    <i className="zmdi zmdi-twitter-box" style={{...styles.icon}} />
                                </a>
                            </div>
                            <div className="col col-3 pt1">
                                <a href="https://www.linkedin.com/company/0xProject" target="_blank">
                                    <i className="zmdi zmdi-linkedin-box" style={{...styles.icon}} />
                                </a>
                            </div>
                            <div className="col col-3 pt1">
                                <a href="https://slack.0xproject.com/" target="_blank">
                                    <div className="rounded" style={{...styles.slackIcon}}>
                                        <img src="/images/slack_icon.png" style={{width: 13}} />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div
                        className="sm-col sm-col-4 pt1 sm-center md-right-align lg-right-align"
                        style={{...styles.text}}
                    >
                        <a
                            href="mailto:team@0xproject.com"
                            className="text-decoration-none"
                            style={{color: 'white'}}
                        >
                            team@0xproject.com
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
