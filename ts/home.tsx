import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton, FlatButton, AppBar, Drawer, MenuItem} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Styles} from 'ts/types';
import {
    Link as ScrollLink,
    Element as ScrollElement,
    animateScroll,
} from 'react-scroll';

import {
  Link,
} from 'react-router-dom';

const marketCaps = [
    {
        name: 'Ether',
        marketCap: '$5.8B',
    },
    {
        name: 'Augur REP',
        marketCap: '$161M',
    },
    {
        name: 'Golem',
        marketCap: '$114M',
    },
];

const team = [
    {
        name: 'Will Warren',
        title: 'Co-founder & CEO',
        description: `Smart contract R&D. Previously applied physics research and simulations at Los
                      Alamos National Laboratory. Mechanical engineering at UC San Diego. PhD dropout.`,
        linkedIn: 'https://www.linkedin.com/in/will-warren-92aab62b/',
        github: 'https://github.com/willwarren89',
        medium: 'https://medium.com/@willwarren89',
        image: '/images/team/will.jpg',
    },
    {
        name: 'Amir Bandeali',
        title: 'Co-founder & CTO',
        description: `Full-stack web application & smart contract dev. Former fixed income trader at
                      DRW and online poker professional. Finance at University of Illinois, Urbana-Champaign.`,
        linkedIn: 'https://www.linkedin.com/in/abandeali1/',
        github: 'https://github.com/abandeali1',
        medium: 'https://medium.com/@abandeali1',
        image: '/images/team/amir.jpeg',
    },
    {
        name: 'Fabio Berger',
        title: 'Senior Engineer',
        description: `Blockchain engineer with extensive full-stack and devOps experience. Previously
                      software engineer at Airtable and founder of WealthLift. Computer science at Duke.`,
        linkedIn: 'https://www.linkedin.com/in/fabio-berger-03ab261a/',
        github: 'https://github.com/fabioberger',
        medium: '',
        image: '/images/team/fabio.jpg',
    },
];

const advisors = [
    {
        name: 'Fred Ehrsam',
        title: 'Advisor',
        description: 'Co-founder of Coinbase. Previously FX trader at Goldman Sachs. Computer Science at Duke.',
        linkedIn: 'https://www.linkedin.com/in/fredehrsam/',
        medium: 'https://medium.com/@FEhrsam',
        twitter: 'https://twitter.com/FEhrsam',
        image: '/images/advisors/fred.jpg',
    },
    {
        name: 'Olaf Carlson-Wee',
        title: 'Advisor',
        description: 'Founder of Polychain Capital. First employee at Coinbase. Angel investor.',
        linkedIn: 'https://www.linkedin.com/in/olafcw/',
        angellist: 'https://angel.co/olafcw',
        image: '/images/advisors/olaf.png',
    },
    {
        name: 'Joey Krug',
        title: 'Advisor',
        description: `Founder of Augur. Computer Science at Pomona College dropout.
                      Thiel Fellowship 20 Under 20 Fellow.`,
        linkedIn: 'https://www.linkedin.com/in/joeykrug/',
        github: 'https://github.com/joeykrug',
        angellist: 'https://angel.co/joeykrug',
        image: '/images/advisors/joey.jpg',
    },
    {
        name: 'Linda Xie',
        title: 'Advisor',
        description: 'Product Manager at Coinbase. Previously Portfolio Risk at AIG.',
        linkedIn: 'https://www.linkedin.com/in/lindaxie/',
        medium: 'https://medium.com/@linda.xie',
        twitter: 'https://twitter.com/ljxie',
        image: '/images/advisors/linda.jpg',
    },
];

export interface HomeProps {}

interface HomeState {
    isDrawerOpen: boolean;
}

const styles: Styles = {
    thin: {
        fontWeight: 100,
    },
    paragraph: {
        maxWidth: 750,
        lineHeight: 1.4,
        fontSize: 18,
    },
    teamHeader: {
        textTransform: 'uppercase',
        fontSize: 32,
        margin: 0,
    },
};

export class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            isDrawerOpen: false,
        };
    }
    public render() {
        return (
            <div style={{fontFamily: 'Roboto, sans-serif', color: colors.grey800}}>
                <div className="lg-pb4 md-pb4 sm-pb2 sm-pt0 md-pt4 lg-pt4 mx-auto max-width-4">
                    <div className="lg-pb4 md-pb4 clearfix">
                        <div className="col col-12 lg-hide md-hide">
                            <AppBar
                                title={<img src="/images/logo_text.png" style={{width: 21}} />}
                                titleStyle={{textAlign: 'center'}}
                                iconClassNameRight="muidocs-icon-navigation-expand-more"
                                onLeftIconButtonTouchTap={this.onMenuButtonClick.bind(this)}
                            />
                            <Drawer
                                open={this.state.isDrawerOpen}
                                docked={false}
                                onRequestChange={this.onMenuButtonClick.bind(this)}
                            >
                                <a
                                    className="text-decoration-none"
                                    target="_blank"
                                    href="https://www.0xproject.com/whitepaper/0x_white_paper.pdf"
                                >
                                    <MenuItem>Whitepaper</MenuItem>
                                </a>
                                <ScrollLink
                                    to="team"
                                    smooth={true}
                                    offset={50}
                                    duration={500}
                                >
                                    <MenuItem onTouchTap={this.onMenuButtonClick.bind(this)}>
                                        Team
                                    </MenuItem>
                                </ScrollLink>
                                <ScrollLink
                                    to="advisors"
                                    smooth={true}
                                    offset={50}
                                    duration={500}
                                >
                                    <MenuItem onTouchTap={this.onMenuButtonClick.bind(this)}>
                                        Advisors
                                    </MenuItem>
                                </ScrollLink>
                                <Link to="/demo" className="text-decoration-none">
                                    <MenuItem>Demo</MenuItem>
                                </Link>
                            </Drawer>
                        </div>
                        <div className="md-col md-col-6 pt4">
                            <div className="pt4 sm-center xs-center">
                                <img
                                    src="/images/0x_city_square.png"
                                    style={{width: 350}}
                                />
                            </div>
                        </div>
                        <div className="md-col md-col-6 sm-col-12 xs-col-12 lg-pt4 md-pt4">
                            <div className="lg-pt4 md-pt4 sm-px4 md-px0 lg-px0">
                                <div className="pt3 sm-hide xs-hide">
                                    <img src="/images/0x_logo.png" style={{width: 125}} />
                                </div>
                                <div className="py2 pl1 sm-h2 sm-center">
                                    A Decentralized Exchange Protocol
                                </div>
                                <div className="sm-hide xs-hide">
                                    <a
                                        target="_blank"
                                        href="https://www.0xproject.com/whitepaper/0x_white_paper.pdf"
                                    >
                                        <RaisedButton
                                            label="Whitepaper"
                                            primary={true}
                                            style={{marginRight: 12}}
                                        />
                                    </a>
                                    <ScrollLink
                                        to="team"
                                        smooth={true}
                                        offset={50}
                                        duration={500}
                                    >
                                        <FlatButton
                                            label="Team"
                                        />
                                    </ScrollLink>
                                    <ScrollLink
                                        to="advisors"
                                        smooth={true}
                                        offset={50}
                                        duration={500}
                                    >
                                        <FlatButton
                                            label="Advisors"
                                        />
                                    </ScrollLink>
                                    <Link to="/demo">
                                        <FlatButton
                                            label="Demo"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt4 relative" style={{backgroundColor: '#eaeaea'}}>
                    <div className="mx-auto max-width-4 pt2 relative" style={{zIndex: 2}}>
                        <h1
                            className="pt4 lg-h0 xm-center sm-center md-pl3 lg-pl0"
                            style={{textTransform: 'uppercase', ...styles.thin}}
                        >
                            The world will be tokenized
                        </h1>
                        <div
                            className="pb4 sm-center sm-px3 md-pl3 lg-pl0"
                            style={{...styles.paragraph, ...styles.thin}}
                        >
                            {`Talking about how the world is adopting digital assets and trading them
                            like never before, with boundless growth coming. Talking about how the
                            world is adopting digital assets and trading them like never before,
                            with boundless growth coming.`}
                        </div>
                        <div className="lg-py4 md-py4 sm-py2" />
                        <div className="pt4 pb1 clearfix sm-pl3 md-pl3 lg-pl0">
                            {this.renderMarketCaps()}
                        </div>
                    </div>
                    <img
                        className="absolute"
                        src="/images/0x_city_globe.png"
                        style={{bottom: 0, right: 0, zIndex: 0, width: 550}}
                    />
                </div>
                <div
                    className="relative"
                    style={{backgroundColor: '#272727'}}
                >
                    <ScrollElement name="team">
                        <div className="mx-auto max-width-4 pb4" style={{color: colors.grey50}}>
                            <h1
                                className="pt4 sm-center md-pl3 lg-pl0"
                                style={{...styles.teamHeader, ...styles.thin, color: 'white'}}
                            >
                                Team
                            </h1>
                            <div className="clearfix pt3 mx-auto" style={{maxWidth: 780}}>
                                {this.renderProfiles(team)}
                            </div>
                        </div>
                    </ScrollElement>
                </div>
                <div className="relative" style={{backgroundColor: '#eaeaea'}}>
                    <ScrollElement name="advisors">
                        <div className="mx-auto max-width-4 pb4" style={{color: colors.grey800}}>
                            <h1
                                className="pt4 sm-center md-pl3 lg-pl0"
                                style={{...styles.teamHeader, ...styles.thin, color: colors.grey800}}
                            >
                                Advisors
                            </h1>
                            <div className="pt3 mx-auto clearfix">
                                {this.renderProfiles(advisors)}
                            </div>
                        </div>
                    </ScrollElement>
                </div>
                <div className="relative" style={{backgroundColor: '#272727'}}>
                    <div className="mx-auto max-width-4 py3 sm-center" style={{color: 'white'}}>
                        team@0xproject.com
                    </div>
                </div>
            </div>
        );
    }
    private renderProfiles(individuals: any[]) {
        const numIndiv = individuals.length;
        const colSize = this.getColSize(individuals.length);
        return _.map(individuals, (individual) => {
            return (
                <div
                    key={individual.name}
                    className={`sm-col sm-col-${colSize} sm-center`}
                >
                    <div>
                        <img src={individual.image} />
                    </div>
                    <div
                        className="pt1"
                        style={{fontSize: 18, fontWeight: 'bold'}}
                    >
                        {individual.name}
                    </div>
                    <div
                        className="pb2 pt1"
                        style={{...styles.thin, fontSize: 16}}
                    >
                        {individual.title}
                    </div>
                    <div
                        style={{fontSize: 13, ...styles.thin}}
                        className="pb3 sm-px4"
                    >
                        {individual.description}
                    </div>
                </div>
            );
        });
    }
    private renderMarketCaps() {
        const colSize = this.getColSize(marketCaps.length);
        return _.map(marketCaps, (mc) => {
            return (
                <div
                    key={mc.name}
                    className="sm-col sm-col-${colSize} pr4 pb3"
                    style={{color: colors.grey700, textShadow: '0 0 4px #fff'}}
                >
                    <div className="center" style={{fontSize: 58, ...styles.thin}}>{mc.marketCap}</div>
                    <div
                        className="center pt1"
                        style={{textTransform: 'uppercase', fontSize: 25}}
                    >
                        {mc.name}
                    </div>
                </div>
            );
        });
    }
    private onMenuButtonClick() {
        this.setState({
            isDrawerOpen: !this.state.isDrawerOpen,
        });
    }
    private getColSize(items: number) {
        const bassCssGridSize = 12; // Source: http://basscss.com/#basscss-grid
        const colSize = 12 / items;
        if (!_.isInteger(colSize)) {
            throw new Error('Number of cols must be divisible by 12');
        }
        return colSize;
    }
}
