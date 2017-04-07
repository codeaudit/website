import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {RequiredLabel} from 'ts/components/ui/required_label';
import {Side} from 'ts/types';
import ReactTooltip = require('react-tooltip');

const styles = {
    underlineDisabled: {
        borderBottom: `1px solid ${colors.grey300}`,
        borderColor: colors.grey300,
    },
};

interface MakerAddressInputProps {
    blockchain: Blockchain;
    blockchainIsLoaded: boolean;
    orderMakerAddress: string;
    shouldShowIncompleteErrs: boolean;
}

interface MakerAddressInputState {
    orderMakerAddressErrMsg: string;
}

export class MakerAddressInput extends React.Component<MakerAddressInputProps, MakerAddressInputState> {
    constructor(props: MakerAddressInputProps) {
        super(props);
        this.state = {
            orderMakerAddressErrMsg: '',
        };
    }
    public render() {
        const label = <RequiredLabel label="Maker (address)" />;
        const hasMakerAddress = !_.isUndefined(this.props.orderMakerAddress);
        const errorText = this.props.shouldShowIncompleteErrs && !hasMakerAddress ?
            'Didn\'t find any accounts via web3.eth.accounts' : '';
        const value = hasMakerAddress ? this.props.orderMakerAddress : '';
        // Hack: In order not to show a tooltip with the value `true` when the maker address has not
        // loaded yet, we must set dataTip to an empty string
        // Source: https://github.com/wwayne/react-tooltip#2-hide-tooltip-when-getcontent-returns-undefined
        const dataTip = hasMakerAddress ? true : '';
        return (
            <div>
                <div
                    data-tip={dataTip}
                    data-for="makerAddressTooltip"
                >
                    <TextField
                        disabled={true}
                        style={{height: 60}}
                        fullWidth={true}
                        errorText={errorText}
                        floatingLabelFixed={true}
                        floatingLabelStyle={{marginTop: -15, color: colors.grey500}}
                        underlineDisabledStyle={styles.underlineDisabled}
                        errorStyle={{marginTop: 15}}
                        inputStyle={{marginTop: 0}}
                        floatingLabelText={label}
                        value={value}
                    />
                </div>
                <ReactTooltip id="makerAddressTooltip">{value}</ReactTooltip>
            </div>
        );
    }
}
