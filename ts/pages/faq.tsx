import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton} from 'material-ui/RaisedButton';
import {colors} from 'material-ui/styles';
import {Styles} from 'ts/types';
import * as ReactMarkdown from 'react-markdown';
import {Link} from 'react-router-dom';
import {Footer} from 'ts/components/footer';
import {TopBar} from 'ts/components/top_bar';
// tslint:disable-next-line:no-var-requires
const FAQMarkdown = require('md/faq');

export interface FAQProps {
    source: string;
    location: Location;
}

interface FAQState {}

const styles: Styles = {
    thin: {
        fontWeight: 100,
    },
};

export class FAQ extends React.Component<FAQProps, FAQState> {
    public componentDidMount() {
        window.scrollTo(0, 0);
    }
    public render() {
        return (
            <div>
                <TopBar
                    blockchainIsLoaded={false}
                    location={this.props.location}
                />
                <div
                    id="faq"
                    className="mx-auto max-width-4 pt4"
                    style={{color: colors.grey800}}
                >
                    <h1 className="center" style={{...styles.thin}}>0x FAQ</h1>
                    <div className="sm-px2 md-px2 lg-px0 pb4">
                        <ReactMarkdown
                            source={FAQMarkdown}
                        />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}
