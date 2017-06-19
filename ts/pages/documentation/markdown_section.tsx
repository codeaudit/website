import * as _ from 'lodash';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import {Element as ScrollElement} from 'react-scroll';
import {AnchorTitle} from 'ts/pages/documentation/anchor_title';
import {MarkdownCodeBlock} from 'ts/pages/documentation/markdown_code_block';

interface MarkdownSectionProps {
    sectionName: string;
    markdownContent: string;
}

interface MarkdownSectionState {
    shouldShowAnchor: boolean;
}

export class MarkdownSection extends React.Component<MarkdownSectionProps, MarkdownSectionState> {
    constructor(props: MarkdownSectionProps) {
        super(props);
        this.state = {
            shouldShowAnchor: false,
        };
    }
    public render() {
        const sectionName = this.props.sectionName;
        return (
            <div
                className="pt2 px3"
                onMouseOver={this.setAnchorVisibility.bind(this, true)}
                onMouseOut={this.setAnchorVisibility.bind(this, false)}
            >
                <ScrollElement name={sectionName}>
                    <span style={{textTransform: 'capitalize'}}>
                        <AnchorTitle
                            headerType="h3"
                            title={sectionName}
                            id={sectionName}
                            shouldShowAnchor={this.state.shouldShowAnchor}
                        />
                    </span>
                    <ReactMarkdown
                        source={this.props.markdownContent}
                        renderers={{CodeBlock: MarkdownCodeBlock}}
                    />
                </ScrollElement>
            </div>
        );
    }
    private setAnchorVisibility(shouldShowAnchor: boolean) {
        this.setState({
            shouldShowAnchor,
        });
    }
}
