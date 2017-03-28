import * as React from 'react';
import {Dialog, FlatButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import {constants} from 'ts/utils/constants';

interface EnableWalletDialogProps {
    isOpen: boolean;
    toggleDialogFn: (isOpen: boolean) => void;
}

export const EnableWalletDialog = (props: EnableWalletDialogProps) => {
    const dialogActions = [
        <FlatButton
            label="Ok"
            primary={true}
            onTouchTap={props.toggleDialogFn.bind(props.toggleDialogFn, false)}
        />,
    ];

    return (
        <Dialog
            title="Enable wallet communication"
            actions={dialogActions}
            open={props.isOpen}
            contentStyle={{width: 400}}
            onRequestClose={props.toggleDialogFn.bind(props.toggleDialogFn, false)}
            autoScrollBodyContent={true}
        >
            <div className="pt2" style={{color: colors.grey700}}>
                <div>
                    In order to interact with the demo dApp, we need a way to interact with an
                    {' '}ethereum wallet you control. There are two easy ways you can enable us
                    {' '}to do that:
                </div>
                <h4>1. Chrome extension ethereum wallet</h4>
                <div>
                    You can install a chrome extension ethereum wallet such as{' '}
                    <a href={constants.METAMASK_CHROME_STORE_URL} target="_blank">
                        Metamask
                    </a>. Once installed and set up, refresh this page.
                </div>
                <h4>2. Use the Mist browser</h4>
                <div>
                    Install the <a href={constants.MIST_DOWNLOAD_URL} target="_blank">Mist</a>
                    {' '}app, and browse to this site from within the in-app Mist browser.
                </div>
            </div>
        </Dialog>
    );
};
