import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {TypeDocNode} from 'ts/types';

const STRING_ENUM_CODE_PREFIX = ' strEnum(';

interface EnumProps {
    type: TypeDocNode;
}

export function Enum(props: EnumProps) {
    const type = props.type;
    if (!_.startsWith(type.defaultValue, STRING_ENUM_CODE_PREFIX)) {
        utils.consoleLog('We do not yet support `Variable` types that are not strEnums');
        return null;
    }
    // Remove the prefix and postfix, leaving only the strEnum values without quotes.
    const enumValues = type.defaultValue.slice(10, -3).replace(/'/g, '');
    return (
        <span>
            {`{`}
                {'\t'}{enumValues}
                <br />
            {`}`}
        </span>
    );
}
