import * as _ from 'lodash';
import * as React from 'react';
import {TypeDocNode} from 'ts/types';
import {Type} from 'ts/pages/documentation/type';

interface MethodSignatureProps {
    signature: TypeDocNode;
    entity?: string;
    shouldHideMethodName?: boolean;
    shouldUseArrowSyntax?: boolean;
}

const defaultProps = {
    shouldHideMethodName: false,
    shouldUseArrowSyntax: false,
    entity: '',
};

export const MethodSignature: React.SFC<MethodSignatureProps> = (props: MethodSignatureProps) => {
    const parameters = renderParameters(props.signature);
    const paramString = _.reduce(parameters, (prev: React.ReactNode, curr: React.ReactNode) => {
        return [prev, ', ', curr];
    });
    const methodName = props.shouldHideMethodName ? '' : props.signature.name;
    return (
        <span>
            {props.entity}{methodName}({paramString}){props.shouldUseArrowSyntax ? ' => ' : ': '}
            {' '}<Type type={props.signature.type} />
        </span>
    );
};

function renderParameters(signature: TypeDocNode) {
    const parameters = signature.parameters;
    const params = _.map(parameters, p => {
        const isOptional = p.flags.isOptional;
        return (
            <span key={`param-${p.type}-${p.name}`}>
                {p.name}{isOptional && '?'}: <Type type={p.type} />
            </span>
        );
    });
    return params;
}
