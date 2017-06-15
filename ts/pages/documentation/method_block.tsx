import * as _ from 'lodash';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import {Chip} from 'material-ui';
import {colors} from 'material-ui/styles';
import {TypeDocNode} from 'ts/types';
import {utils} from 'ts/utils/utils';
import {SourceLink} from 'ts/pages/documentation/source_link';
import {MethodSignature} from 'ts/pages/documentation/method_signature';
import {AnchorTitle} from 'ts/pages/documentation/anchor_title';
import {MarkdownCodeBlock} from 'ts/pages/documentation/markdown_code_block';

interface MethodBlockProps {
    isConstructor: boolean;
    isStatic: boolean;
    methodSignature: TypeDocNode;
    source: TypeDocNode;
    entity: string;
}

interface MethodBlockState {
    shouldShowAnchor: boolean;
}

export class MethodBlock extends React.Component<MethodBlockProps, MethodBlockState> {
    constructor(props: MethodBlockProps) {
        super(props);
        this.state = {
            shouldShowAnchor: false,
        };
    }
    public render() {
        const methodSignature = this.props.methodSignature;
        if (utils.isPrivateOrProtectedProperty(methodSignature.name)) {
            return null;
        }

        return (
            <div
                id={methodSignature.name}
                style={{overflow: 'hidden', width: '100%'}}
                className="pb4 hashLinkPaddingFix"
                onMouseOver={this.setAnchorVisibility.bind(this, true)}
                onMouseOut={this.setAnchorVisibility.bind(this, false)}
            >
                {!this.props.isConstructor &&
                    <div className="flex">
                        <AnchorTitle
                            title={methodSignature.name}
                            id={methodSignature.name}
                            shouldShowAnchor={this.state.shouldShowAnchor}
                        />
                        {this.props.isStatic &&
                            <Chip
                                backgroundColor={colors.cyanA700}
                                labelColor={colors.white}
                                style={{margin: 14}}
                            >
                                Static
                            </Chip>
                         }
                    </div>
                }
                <code className="hljs">
                    <MethodSignature
                        signature={methodSignature}
                        entity={this.props.entity}
                    />
                </code>
                <SourceLink source={this.props.source} />
                {methodSignature.comment &&
                    <div className="py2">
                        <ReactMarkdown
                            source={methodSignature.comment.shortText}
                            renderers={{CodeBlock: MarkdownCodeBlock}}
                        />
                    </div>
                }
                {methodSignature.parameters &&
                    <div>
                        <h4
                            className="pb1 thin"
                            style={{borderBottom: '1px solid #e1e8ed'}}
                        >
                            ARGUMENTS
                        </h4>
                        {this.renderParameterDescriptions(methodSignature.parameters)}
                    </div>
                }
                {methodSignature.comment && methodSignature.comment.returns &&
                    <div className="pt1">
                        <h4
                            className="pb1 thin"
                            style={{borderBottom: '1px solid #e1e8ed'}}
                        >
                            RETURNS
                        </h4>
                        <ReactMarkdown
                            source={methodSignature.comment.returns}
                            renderers={{CodeBlock: MarkdownCodeBlock}}
                        />
                    </div>
                }
            </div>
        );
    }
    private renderParameterDescriptions(parameters: TypeDocNode[]) {
        const descriptions = _.map(parameters, parameter => {
            let comment = '<No comment>';
            if (parameter.comment && parameter.comment.shortText) {
                comment = parameter.comment.shortText;
            } else if (parameter.comment && parameter.comment.text) {
                comment = parameter.comment.text;
            }
            const isOptional = parameter.flags.isOptional;
            return (
                <div
                    key={`param-description-${parameter.name}`}
                    className="flex pb1 mb2"
                    style={{borderBottom: '1px solid #f0f4f7'}}
                >
                    <div className="col col-1" />
                    <div className="col col-3">
                        <div className="bold">
                            {parameter.name}
                        </div>
                        <div className="pt1" style={{color: colors.grey500, fontSize: 14}}>
                            {isOptional && 'optional'}
                        </div>
                    </div>
                    <div className="col col-8">
                        <ReactMarkdown
                            source={comment}
                            renderers={{CodeBlock: MarkdownCodeBlock}}
                        />
                    </div>
                </div>
            );
        });
        return descriptions;
    }
    private setAnchorVisibility(shouldShowAnchor: boolean) {
        this.setState({
            shouldShowAnchor,
        });
    }
}
