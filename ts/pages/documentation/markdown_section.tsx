import * as _ from 'lodash';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import {AnchorTitle} from 'ts/pages/documentation/anchor_title';

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
                className="py2 px3"
                onMouseOver={this.setAnchorVisibility.bind(this, true)}
                onMouseOut={this.setAnchorVisibility.bind(this, false)}
            >
                <span style={{textTransform: 'capitalize'}}>
                    <AnchorTitle
                        title={sectionName}
                        id={sectionName}
                        shouldShowAnchor={this.state.shouldShowAnchor}
                    />
                </span>
                <div className="pb2">
                    <ReactMarkdown
                        source={this.props.markdownContent}
                    />
                </div>
            </div>
        );
    }
    private setAnchorVisibility(shouldShowAnchor: boolean) {
        this.setState({
            shouldShowAnchor,
        });
    }
}
