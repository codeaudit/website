import * as _ from 'lodash';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RaisedButton, FlatButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import {configs} from 'ts/utils/configs';
import {Styles, Profile, Partner} from 'ts/types';
import {
    Link as ScrollLink,
    Element as ScrollElement,
    animateScroll,
} from 'react-scroll';
import {utils} from 'ts/utils/utils';
import {Footer} from 'ts/components/footer';
import {TopBar} from 'ts/components/top_bar';
import {NewsletterInput} from 'ts/pages/home/newsletter_input';
import {Statistics} from 'ts/pages/home/statistics';
import ReactTooltip = require('react-tooltip');

const team: Profile[] = [
    {
        name: 'Will Warren',
        title: 'Co-founder & CEO',
        description: `Smart contract R&D. Previously applied physics research and simulations at Los
                      Alamos National Laboratory. Mechanical engineering at UC San Diego. PhD dropout.`,
        image: '/images/team/will.jpg',
        linkedIn: 'https://www.linkedin.com/in/will-warren-92aab62b/',
        github: 'https://github.com/willwarren89',
        medium: 'https://medium.com/@willwarren89',
    },
    {
        name: 'Amir Bandeali',
        title: 'Co-founder & CTO',
        description: `Full-stack web application & smart contract dev. Former fixed income trader at
                      DRW and online poker professional. Finance at University of Illinois, Urbana-Champaign.`,
        image: '/images/team/amir.jpeg',
        linkedIn: 'https://www.linkedin.com/in/abandeali1/',
        github: 'https://github.com/abandeali1',
        medium: 'https://medium.com/@abandeali1',
    },
    {
        name: 'Fabio Berger',
        title: 'Senior Engineer',
        description: `Blockchain engineer with extensive full-stack and devOps experience. Previously
                      software engineer at Airtable and founder of WealthLift. Computer science at Duke.`,
        image: '/images/team/fabio.jpg',
        linkedIn: 'https://www.linkedin.com/in/fabio-berger-03ab261a/',
        github: 'https://github.com/fabioberger',
        medium: '',
    },
];

const advisors: Profile[] = [
    {
        name: 'Fred Ehrsam',
        title: 'Advisor',
        description: 'Co-founder of Coinbase. Previously FX trader at Goldman Sachs. Computer Science at Duke.',
        image: '/images/advisors/fred.jpg',
        linkedIn: 'https://www.linkedin.com/in/fredehrsam/',
        medium: 'https://medium.com/@FEhrsam',
        twitter: 'https://twitter.com/FEhrsam',
    },
    {
        name: 'Olaf Carlson-Wee',
        title: 'Advisor',
        image: '/images/advisors/olaf.png',
        description: 'Founder of Polychain Capital. First employee at Coinbase. Angel investor.',
        linkedIn: 'https://www.linkedin.com/in/olafcw/',
        angellist: 'https://angel.co/olafcw',
    },
    {
        name: 'Joey Krug',
        title: 'Advisor',
        description: `Founder of Augur. Computer Science at Pomona College dropout.
                      Thiel Fellowship 20 Under 20 Fellow.`,
        image: '/images/advisors/joey.jpg',
        linkedIn: 'https://www.linkedin.com/in/joeykrug/',
        github: 'https://github.com/joeykrug',
        angellist: 'https://angel.co/joeykrug',
    },
    {
        name: 'Linda Xie',
        title: 'Advisor',
        description: 'Product Manager at Coinbase. Previously Portfolio Risk at AIG.',
        image: '/images/advisors/linda.jpg',
        linkedIn: 'https://www.linkedin.com/in/lindaxie/',
        medium: 'https://medium.com/@linda.xie',
        twitter: 'https://twitter.com/ljxie',
    },
];

const partnerships: Partner[] = [
    {
        name: 'Augur',
        logo: '/images/logos/augur.png',
        url: 'https://augur.net/',
    },
    {
        name: 'Maker',
        logo: '/images/logos/maker.png',
        url: 'http://makerdao.com/',
    },
    {
        name: 'Aragon',
        logo: '/images/logos/aragon.png',
        url: 'https://aragon.one/',
    },
];

const investors: Partner[] = [
    {
        name: 'Polychain Capital',
        logo: '/images/logos/polychain_capital.png',
        url: 'http://polychain.capital/',
    },
    {
        name: 'Pantera Capital',
        logo: '/images/logos/pantera_capital.png',
        url: 'https://panteracapital.com/',
    },
    {
        name: 'Blockchain Capital',
        logo: '/images/logos/blockchain_capital.png',
        url: 'http://http://blockchain.capital/',
    },
];

export interface HomeProps {
    location: Location;
}

interface HomeState {}

const styles: Styles = {
    thin: {
        fontWeight: 100,
    },
    paragraph: {
        lineHeight: 1.4,
        fontSize: 18,
    },
    subheader: {
        textTransform: 'uppercase',
        fontSize: 32,
        margin: 0,
    },
    socalIcon: {
        fontSize: 20,
    },
};

export class Home extends React.Component<HomeProps, HomeState> {
    public render() {
        return (
            <div id="home" style={{color: colors.grey800}}>
                <TopBar
                    blockchainIsLoaded={false}
                    location={this.props.location}
                />
                <div
                    className="lg-pb4 md-pb4 sm-pb2 sm-pt0 md-pt4 lg-pt4 mx-auto max-width-4"
                >
                    <div className="lg-pb4 md-pb4 clearfix">
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
                                <div className="py2 sm-h2 sm-center">
                                    <span className="lg-hide md-hide">0x: </span>
                                    The Protocol for Trading Tokens
                                </div>
                                <div className="flex sm-hide xs-hide">
                                    <a
                                        target="_blank"
                                        href="/pdfs/0x_white_paper.pdf"
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
                                        offset={0}
                                        duration={500}
                                    >
                                        <FlatButton
                                            label="Team"
                                        />
                                    </ScrollLink>
                                    <ScrollLink
                                        to="partners"
                                        smooth={true}
                                        offset={0}
                                        duration={500}
                                    >
                                        <FlatButton
                                            label="Partners"
                                        />
                                    </ScrollLink>
                                    <Link to="/faq">
                                        <FlatButton
                                            label="FAQ"
                                        />
                                    </Link>
                                    {configs.isDemoEnabled ?
                                        <Link to="/demo">
                                            <FlatButton
                                                label="Demo"
                                            />
                                        </Link> :
                                        <div
                                            data-tip={true}
                                            data-for="demoTooltip"
                                        >
                                            <FlatButton
                                                label="Demo"
                                            />
                                            <ReactTooltip id="demoTooltip">Coming soon!</ReactTooltip>
                                        </div>
                                    }
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
                            The World is Becoming Tokenized
                        </h1>
                        <div
                            className="pb4 sm-center sm-px3 md-pl3 lg-pl0"
                            style={{maxWidth: 750, ...styles.paragraph, ...styles.thin}}
                        >
                            The Ethereum blockchain has become host to a{' '}
                            <a href="https://etherscan.io/tokens" target="_blank">
                                variety of digital assets
                            </a>, with{' '}
                            <a href="https://www.icoalert.com/" target="_blank">
                                more being created every month
                            </a>. Soon, thousands of assets will be tokenized and moved onto this{' '}
                            open financial network including traditional securities, currencies and{' '}
                            scarce digital goods. As the token space continues to develop, the need{' '}
                            to exchange these assets will be compounded. 0x protocol will act as a{' '}
                            critical piece of infrastructure for the token economy, allowing Ethereum{' '}
                            smart contracts to programmatically and seamlessly exchange Ethereum-based assets.
                        </div>
                        <div className="lg-py4 md-py4 sm-py2" />
                        <div className="pt4 pb1 clearfix sm-pl3 md-pl3 lg-pl0">
                            <Statistics />
                        </div>
                    </div>
                    <img
                        className="absolute"
                        src="/images/0x_city_globe.png"
                        style={{bottom: 0, right: 0, zIndex: 0, width: 550}}
                    />
                </div>
                <div
                    style={{backgroundColor: '#272727'}}
                >
                    <div className="clearfix mx-auto max-width-4" style={{color: 'white'}}>
                        <div className="sm-col sm-col-6">
                            <h1
                                className="pt4 sm-center md-pl3 lg-pl0"
                                style={{...styles.subheader, ...styles.thin}}
                            >
                                Newsletter
                            </h1>
                            <div
                                className="pt2 sm-center sm-px3 md-pl3 lg-pl0"
                                style={{...styles.paragraph, ...styles.thin}}
                            >
                                Stay up to date with the latest 0x developments
                            </div>
                            <div className="pt1 md-pl3 lg-pl0 sm-center sm-px4">
                                <NewsletterInput />
                            </div>
                        </div>
                        <div className="sm-col sm-col-6 p4">
                            <div className="center">
                                <img src="/images/paper_airplane.png" style={{width: 150}} />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{backgroundColor: 'white'}}>
                    <div className="mx-auto max-width-4 pb4">
                        <h1
                            id="partners"
                            className="pt4 sm-center md-pl3 lg-pl0"
                            style={{...styles.subheader, ...styles.thin}}
                        >
                            Partners
                        </h1>
                        <div
                            className="pt2 sm-center sm-px3 md-pl3 lg-pl0"
                            style={{...styles.paragraph, ...styles.thin}}
                        >
                            {`The following projects have agreed to be early adopters of the 0x
                              protocol and will be using it in their respective applications.`}
                        </div>
                        <div className="clearfix pt3 mx-auto md-pl3">
                            {this.renderPartners(partnerships)}
                        </div>
                    </div>
                </div>
                <div
                    className="relative"
                    style={{backgroundColor: '#272727'}}
                >
                    <ScrollElement name="team">
                        <div className="mx-auto max-width-4 pb4" style={{color: colors.grey50}}>
                            <h1
                                id="team"
                                className="pt4 sm-center md-pl3 lg-pl0"
                                style={{...styles.subheader, ...styles.thin, color: 'white'}}
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
                                id="advisors"
                                className="pt4 sm-center md-pl3 lg-pl0"
                                style={{...styles.subheader, ...styles.thin, color: colors.grey800}}
                            >
                                Advisors
                            </h1>
                            <div className="pt3 mx-auto clearfix">
                                {this.renderProfiles(advisors)}
                            </div>
                        </div>
                    </ScrollElement>
                </div>
                <div style={{backgroundColor: 'white'}}>
                    <div className="mx-auto max-width-4 pb4">
                        <h1
                            id="investors"
                            className="pt4 sm-center md-pl3 lg-pl0"
                            style={{...styles.subheader, ...styles.thin}}
                        >
                            Backed by
                        </h1>
                        <div className="clearfix pt4 mx-auto md-pl3">
                            {this.renderPartners(investors)}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
    private renderPartners(partners: Partner[]) {
        const colSize = utils.getColSize(partners.length);
        return _.map(partners, (partner) => {
            return (
                <div
                    key={partner.name}
                    className={`sm-col sm-col-${colSize} sm-center sm-pb3`}
                >
                    <a href={partner.url} target="_blank">
                        <img src={partner.logo} style={{maxWidth: 200, maxHeight: 120}} />
                    </a>
                </div>
            );
        });
    }
    private renderProfiles(profiles: Profile[]) {
        const numIndiv = profiles.length;
        const colSize = utils.getColSize(profiles.length);
        return _.map(profiles, (profile) => {
            return (
                <div
                    key={profile.name}
                    className={`sm-col sm-col-${colSize}`}
                >
                    <div className="mx-auto" style={{width: 200}}>
                        <div>
                            <img src={profile.image} />
                        </div>
                        <div
                            className="pt1"
                            style={{fontSize: 18, fontWeight: 'bold'}}
                        >
                            {profile.name}
                        </div>
                        <div
                            className="pb2 pt1"
                            style={{...styles.thin, fontSize: 16}}
                        >
                            {profile.title}
                        </div>
                        <div
                            style={{fontSize: 13, minHeight: 60, ...styles.thin}}
                            className="pb2"
                        >
                            {profile.description}
                        </div>
                        <div className="flex pb3">
                            {this.renderSocialMediaIcons(profile)}
                        </div>
                    </div>
                </div>
            );
        });
    }
    private renderSocialMediaIcons(profile: Profile) {
        const icons = [];
        if (!_.isEmpty(profile.github)) {
            const icon = this.renderSocialMediaIcon('zmdi-github-box', profile.github);
            icons.push(icon);
        }
        if (!_.isEmpty(profile.linkedIn)) {
            const icon = this.renderSocialMediaIcon('zmdi-linkedin-box', profile.linkedIn);
            icons.push(icon);
        }
        if (!_.isEmpty(profile.twitter)) {
            const icon = this.renderSocialMediaIcon('zmdi-twitter-box', profile.twitter);
            icons.push(icon);
        }
        return icons;
    }
    private renderSocialMediaIcon(iconName: string, url: string) {
        return (
            <div key={url} className="pr2">
                <a
                    href={url}
                    style={{color: 'inherit'}}
                    target="_blank"
                    className="text-decoration-none"
                >
                    <i className={`zmdi ${iconName}`} style={{...styles.socalIcon}} />
                </a>
            </div>
        );
    }
}
