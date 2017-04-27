import * as _ from 'lodash';
import * as React from 'react';
import {Paper} from 'material-ui';
import {DefaultPlayer as Video} from 'react-html5video';
import 'react-html5video/dist/styles.css';

interface LoadingProps {}

interface LoadingState {}

export class Loading extends React.Component<LoadingProps, LoadingState> {
    public render() {
        return (
            <div className="pt4" style={{height: 500}}>
                <Paper className="mx-auto" style={{width: 400}}>
                    <Video
                        autoPlay={true}
                        loop={true}
                        muted={true}
                        controls={[]}
                        poster="/images/loading_poster.png"
                    >
                        <source src="/videos/loading.mp4" type="video/mp4" />
                    </Video>
                    <div className="center pt2" style={{paddingBottom: 11}}>Connecting to the blockchain...</div>
                </Paper>
            </div>
        );
    }
}
