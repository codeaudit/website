import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton} from 'material-ui';
import {utils} from 'ts/utils/utils';
import {BackButton} from 'ts/components/ui/back_button';
import {Direction} from 'ts/types';

interface StepProps {
    actionButtonText?: string;
    hasActionButton: boolean;
    hasBackButton: boolean;
    title: string;
    updateGenerateOrderStep(direction: Direction): void;
}

interface StepState {}

export class Step extends React.Component<StepProps, StepState> {
    public render() {
        return (
            <div className="relative" style={{height: 419}}>
                {this.props.hasBackButton && this.renderBackButton()}
                <h3 className="px4">
                    {this.props.title}
                </h3>
                <div className="pt2 pb2 px4 clearfix">
                    {this.props.children}
                </div>
                {this.props.hasActionButton && this.renderActionButton()}
            </div>
        );
    }
    private renderBackButton() {
        return (
            <div
                className="absolute"
                style={{left: 15}}
            >
                <BackButton onClick={this.onBackButtonClick.bind(this)} />
            </div>
        );
    }
    private renderActionButton() {
        return (
            <div className="absolute" style={{bottom: 0, right: 25, width: 575}}>
                <RaisedButton
                    label={this.props.actionButtonText}
                    style={{margin: 12, width: '100%'}}
                    onClick={this.props.updateGenerateOrderStep.bind(this, Direction.forward)}
                />
            </div>
        );
    }
    private onBackButtonClick() {
        this.props.updateGenerateOrderStep(Direction.backward);
    }
}
