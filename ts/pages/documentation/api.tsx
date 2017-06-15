import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';
import {MenuItem} from 'material-ui';
import scrollToElement = require('scroll-to-element');
import {KindString, TypeDocNode, DocSections} from 'ts/types';
import {TopBar} from 'ts/components/top_bar';
import {utils} from 'ts/utils/utils';
import {MethodBlock} from 'ts/pages/documentation/method_block';
import {SourceLink} from 'ts/pages/documentation/source_link';
import {Type} from 'ts/pages/documentation/type';
import {TypeDefinition} from 'ts/pages/documentation/type_definition';
import {MarkdownSection} from 'ts/pages/documentation/markdown_section';
import * as ZeroExLibraryDocumentation from 'json/0xjs/0.5.0.json';
/* tslint:disable:no-var-requires */
const IntroMarkdown = require('md/docs/0xjs/introduction');
const InstallationMarkdown = require('md/docs/0xjs/installation');
const AsyncMarkdown = require('md/docs/0xjs/async');
const ErrorsMarkdown = require('md/docs/0xjs/errors');
const versioningMarkdown = require('md/docs/0xjs/versioning');
/* tslint:enable:no-var-requires */

const sectionNameToMarkdown = {
    [DocSections.introduction]: IntroMarkdown,
    [DocSections.installation]: InstallationMarkdown,
    [DocSections.async]: AsyncMarkdown,
    [DocSections.errors]: ErrorsMarkdown,
    [DocSections.versioning]: versioningMarkdown,
};

const menu = {
    introduction: [
        DocSections.introduction,
    ],
    install: [
        DocSections.installation,
    ],
    topics: [
        DocSections.async,
        DocSections.errors,
        DocSections.versioning,
    ],
    zeroEx: [
        DocSections.zeroEx,
    ],
    contracts: [
        DocSections.exchange,
        DocSections.token,
        DocSections.tokenRegistry,
    ],
    types: [
        DocSections.types,
    ],
};

const sectionNameToModulePath: {[name: string]: string} = {
    [DocSections.zeroEx]: '"src/0x"',
    [DocSections.exchange]: '"src/contract_wrappers/exchange_wrapper"',
    [DocSections.tokenRegistry]: '"src/contract_wrappers/token_registry_wrapper"',
    [DocSections.token]: '"src/contract_wrappers/token_wrapper"',
    [DocSections.types]: '"src/types"',
};

export interface APIProps {
    source: string;
    location: Location;
}

interface APIState {}

export class API extends React.Component<APIProps, APIState> {
    public componentDidMount() {
        let hash = this.props.location.hash;
        if (_.isEmpty(hash)) {
            hash = '#pageTop'; // scroll to the top
        }
        this.scrollToHash(hash);
    }
    public render() {
        return (
            <div id="pageTop">
                <TopBar
                    blockchainIsLoaded={false}
                    location={this.props.location}
                />
                <div
                    className="mx-auto max-width-4 flex"
                    style={{color: colors.grey800, paddingTop: 44}}
                >
                    <div className="col col-2">
                        <div
                            className="border-right fixed overflow-hidden"
                            style={{borderColor: colors.grey300, minHeight: '100vh', width: 170}}
                        >
                            <div
                                className="py2"
                                style={{fontSize: 20}}
                            >
                                0x.js
                            </div>
                            {this.renderNavigation()}
                        </div>
                    </div>
                    <div className="col col-10 mt3 pt2">
                        {this.renderDocumentation()}
                    </div>
                </div>
            </div>
        );
    }
    private renderDocumentation() {
        const subMenus = _.values(menu);
        const orderedSectionNames = _.flatten(subMenus);
        const sections = _.map(orderedSectionNames, sectionName => {
            const packageDefinitionIfExists: TypeDocNode = this.getPackageDefinitionBySectionNameIfExists(sectionName);

            const markdownFile = sectionNameToMarkdown[sectionName];
            if (_.isUndefined(packageDefinitionIfExists) && !_.isUndefined(markdownFile)) {
                return (
                    <MarkdownSection
                        key={`markdown-section-${sectionName}`}
                        sectionName={sectionName}
                        markdownContent={markdownFile}
                    />
                );
            }

            // Since the `types.ts` file is the only file that does not export a module/class but
            // instead has each type export itself, we do not need to go down two levels of nesting
            // for it.
            let entities;
            if (sectionName === 'types') {
                entities = packageDefinitionIfExists.children;
            } else {
                entities = packageDefinitionIfExists.children[0].children;
            }

            const constructors = _.filter(entities, e => e.kindString === KindString.Constructor);

            const properties = _.filter(entities, e => e.kindString === KindString.Property);
            const propertyDefs = _.compact(_.map(properties, property => this.renderProperty(property)));

            const methods = _.filter(entities, e => e.kindString === KindString.Method);
            const isConstructor = false;
            const methodDefs = _.compact(_.map(methods, method => {
                return this.renderMethodBlocks(method, sectionName, isConstructor);
            }));

            const types = _.filter(entities, e => {
                return e.kindString === KindString.Interface || e.kindString === KindString.Function ||
                       e.kindString === KindString['Type alias'] || e.kindString === KindString.Variable;
            });
            const typeDefs = _.compact(_.map(types, type => {
                return (
                    <TypeDefinition
                        key={`type-${type.name}`}
                        type={type}
                    />
                );
            }));
            return (
                <div
                    key={`section-${sectionName}`}
                    className="py2 px3"
                >
                    <h2
                        id={sectionName}
                        className="pb2 hashLinkPaddingFix"
                        style={{textTransform: 'capitalize'}}
                    >
                        {sectionName}
                    </h2>
                    {sectionName === DocSections.zeroEx && constructors.length > 0 &&
                        <div>
                            <h2 className="thin">Constructors</h2>
                            {this.renderZeroExConstructors(constructors)}
                        </div>
                    }
                    {propertyDefs.length > 0 &&
                        <div>
                            <h2 className="thin">Properties</h2>
                            <div>{propertyDefs}</div>
                        </div>
                    }
                    {methodDefs.length > 0 &&
                        <div>
                            <h2 className="thin">Methods</h2>
                            <div>{methodDefs}</div>
                        </div>
                    }
                    {typeDefs.length > 0 &&
                        <div>
                            <div>{typeDefs}</div>
                        </div>
                    }
                </div>
            );
        });

        return sections;
    }
    private renderZeroExConstructors(constructors: TypeDocNode[]) {
        const isConstructor = true;
        const constructorDefs = _.compact(_.map(constructors, constructor => {
            return this.renderMethodBlocks(constructor, DocSections.zeroEx, isConstructor);
        }));
        return (
            <div>
                {constructorDefs}
            </div>
        );
    }
    private renderProperty(property: TypeDocNode) {
        if (utils.isPrivateOrProtectedProperty(property.name)) {
            return null; // skip
        }

        const source = property.sources[0];
        return (
            <div
                key={`property-${property.name}-${property.type.name}`}
                className="pb3"
            >
                <code className="hljs">
                    {property.name}: <Type type={property.type} />
                </code>
                <SourceLink source={source} />
                {property.comment &&
                    <div className="py2">
                        {property.comment.shortText}
                    </div>
                }
            </div>
        );
    }
    private renderMethodBlocks(method: TypeDocNode, sectionName: string, isConstructor: boolean) {
        const signatures = method.signatures;
        const renderedSignatures = _.map(signatures, (signature, i) => {
            const source = method.sources[i];
            let entity = method.flags.isStatic ? 'ZeroEx.' : 'zeroEx.';
            // Hack: currently the section names are identical as the property names on the ZeroEx class
            // For now we reply on this mapping to construct the method entity. In the future, we should
            // do this differently.
            entity = (sectionName !== DocSections.zeroEx) ? `${entity}${sectionName}.` : entity;
            entity = isConstructor ? '' : entity;
            return (
                <MethodBlock
                    key={`method-${source.name}-${source.line}`}
                    isConstructor={isConstructor}
                    isStatic={method.flags.isStatic}
                    methodSignature={signature}
                    source={source}
                    entity={entity}
                />
            );
        });
        return renderedSignatures;
    }
    private renderNavigation() {
        const navigation = _.map(menu, (menuItems, sectionName) => {
            return (
                <div
                    key={`section-${sectionName}`}
                    className="py2"
                >
                    <div
                        style={{color: colors.grey500}}
                        className="pb1"
                    >
                        {sectionName.toUpperCase()}
                    </div>
                    {this.renderMenuItems(menuItems)}
                </div>
            );
        });
        return navigation;
    }
    private renderMenuItems(menuItemNames: string[]) {
        const menuItems = _.map(menuItemNames, menuItemName => {
            return (
                <MenuItem
                    key={`menuItem-${menuItemName}`}
                    onTouchTap={utils.navigateToAnchorId.bind(this, menuItemName)}
                    style={{minHeight: 0}}
                    innerDivStyle={{lineHeight: 2}}
                >
                    <span style={{textTransform: 'capitalize'}}>
                        {menuItemName}
                    </span>
                </MenuItem>
            );
        });
        return menuItems;
    }
    private getPackageDefinitionBySectionNameIfExists(sectionName: string) {
        const modulePathName = sectionNameToModulePath[sectionName];
        const modules: TypeDocNode[] = (ZeroExLibraryDocumentation as any).children;
        const moduleWithName = _.find(modules, {name: modulePathName});
        return moduleWithName;
    }
    private scrollToHash(hash: string) {
        if (!_.isEmpty(hash)) {
            scrollToElement(hash, {duration: 0});
        }
    }
}
