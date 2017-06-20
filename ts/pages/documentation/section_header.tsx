import * as React from 'react';
import {Element as ScrollElement} from 'react-scroll';
import {AnchorTitle} from 'ts/pages/documentation/anchor_title';

interface SectionHeaderProps {
    sectionName: string;
}

interface SectionHeaderState {
    shouldShowAnchor: boolean;
}

export class SectionHeader extends React.Component<SectionHeaderProps, SectionHeaderState> {
    constructor(props: SectionHeaderProps) {
        super(props);
        this.state = {
            shouldShowAnchor: false,
        };
    }
    public render() {
        const sectionName = this.props.sectionName;
        return (
            <div
                onMouseOver={this.setAnchorVisibility.bind(this, true)}
                onMouseOut={this.setAnchorVisibility.bind(this, false)}
            >
                <ScrollElement name={sectionName}>
                    <AnchorTitle
                        headerType="h2"
                        title={<span style={{textTransform: 'capitalize'}}>{sectionName}</span>}
                        id={sectionName}
                        shouldShowAnchor={this.state.shouldShowAnchor}
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
