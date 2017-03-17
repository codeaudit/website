import * as _ from 'lodash';
import * as React from 'react';
import {Slider} from 'material-ui';
import {colors} from 'material-ui/styles';

const DIAMETER = 130;
const DEFAULT_SLIDER_POSITION = 0;
const KEY_SIZE = 15;

const styles: React.CSSProperties = {
    circle: {
        height: DIAMETER,
        opacity: 0.5,
        width: DIAMETER,
    },
    key: {
        height: KEY_SIZE,
        opacity: 0.5,
        width: KEY_SIZE,
    },
    keyCombined: {
        position: 'absolute',
    },
    keyContainer: {
        fontSize: 12,
    },
    leftCircle: {
        background: colors.amber100,
        border: `1px solid ${colors.amber300}`,
    },
    rightCircle: {
        background: colors.cyan100,
        border: `1px solid ${colors.cyan300}`,
    },
};

interface VennDiagramProps {
    total: number;
    amountSet: number;
    onChange: (amountSet: number) => void;
    leftCircleKey: string;
    rightCircleKey: string;
    intersectionKey: string;
}

interface VennDiagramState {
    sliderPosition: number;
}

export class VennDiagram extends React.Component<VennDiagramProps, VennDiagramState> {
    constructor(props: VennDiagramProps) {
        super(props);
        const sliderPosition = this.props.amountSet / this.props.total;
        this.state = {
            sliderPosition: sliderPosition <= 1 ? sliderPosition : 1,
        };
    }
    public render() {
        const circlePosition = this.state.sliderPosition * ((DIAMETER + 2) / 2);
        const containerWidth = ((DIAMETER + 2) * 2);
        const leftCircleStyles = {
            ...styles.circle,
            ...styles.leftCircle,
            left: circlePosition,
        };
        const rightCircleStyles = {
            ...styles.circle,
            ...styles.rightCircle,
            right: circlePosition,
        };
        return (
            <div>
                <div className="clearfix">
                    <div className="col col-6">
                        <div className="flex mb1" style={styles.keyContainer}>
                            <div className="mr1" style={{...styles.key, ...styles.leftCircle}}/>
                            {this.props.leftCircleKey}
                        </div>
                        <div className="flex mb1" style={styles.keyContainer}>
                            <div className="mr1" style={{...styles.key, ...styles.rightCircle}}/>
                            {this.props.rightCircleKey}
                        </div>
                    </div>
                    <div className="col col-6">
                        <div className="flex" style={styles.keyContainer}>
                            <div style={{...styles.key, ...styles.rightCircle, ...styles.keyCombined}}/>
                            <div style={{...styles.key, ...styles.leftCircle, ...styles.keyCombined}}/>
                            <div className="mr1" style={{...styles.key}} />
                            {this.props.intersectionKey}
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto pt2" style={{width: containerWidth, height: DIAMETER}}>
                    <div className="circle absolute" style={leftCircleStyles} />
                    <div className="circle absolute" style={rightCircleStyles} />
                </div>
                <div className="mx-auto" style={{width: (containerWidth - 60), height: 18}}>
                    <Slider
                        defaultValue={DEFAULT_SLIDER_POSITION}
                        value={this.state.sliderPosition}
                        onChange={this.onSliderChange.bind(this)}
                    />
                </div>
            </div>
        );
    }
    private onSliderChange(event: any, position: number) {
        this.setState({
            sliderPosition: position,
        });
        const amountSet = this.props.total * position;
        this.props.onChange(amountSet);
    }
}
