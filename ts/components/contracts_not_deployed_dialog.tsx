import * as React from 'react';
import {Dialog, FlatButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import {constants} from 'ts/utils/constants';
import {Blockchain} from 'ts/blockchain';

interface ContractsNotDeployedDialogProps {
    blockchain: Blockchain;
    isOpen: boolean;
    toggleDialogFn: (isOpen: boolean) => void;
}

export const ContractsNotDeployedDialog = (props: ContractsNotDeployedDialogProps) => {
    const dialogActions = [
        <FlatButton
            label="Ok"
            primary={true}
            onTouchTap={props.toggleDialogFn.bind(props.toggleDialogFn, false)}
        />,
    ];

    return (
        <Dialog
            title="0x smart contracts not found"
            actions={dialogActions}
            open={props.isOpen}
            contentStyle={{width: 400}}
            onRequestClose={props.toggleDialogFn.bind(props.toggleDialogFn, false)}
            autoScrollBodyContent={true}
        >
            <div className="pt2" style={{color: colors.grey700}}>
                <div>
                    The 0x smart contracts are not deployed on the Ethereum network you are
                    {' '}currently connected to (network Id: {props.blockchain.networkId}).
                    {' '}In order to use this demo app, please connect to the {constants.TESTNET_NAME}
                    {' '}testnet (network Id: {constants.TESTNET_NETWORK_ID}).
                </div>
                <h4>Metamask</h4>
                <div>
                    If you are using{' '}
                    <a href={constants.METAMASK_CHROME_STORE_URL} target="_blank">
                        Metamask
                    </a>, you can switch networks in the top left corner of the extension popover.
                </div>
                <h4>Mist</h4>
                <div>
                    In the <a href={constants.MIST_DOWNLOAD_URL} target="_blank">Mist</a>
                    {' '}app, navigate to develop -> network, and choose the 'testnet' option.
                </div>
            </div>
        </Dialog>
    );
};
