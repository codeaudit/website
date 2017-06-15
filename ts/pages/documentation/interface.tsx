import * as _ from 'lodash';
import * as React from 'react';
import {TypeDocNode, TypeDocTypes} from 'ts/types';
import {Type} from 'ts/pages/documentation/type';
import {MethodSignature} from 'ts/pages/documentation/method_signature';

interface InterfaceProps {
    type: TypeDocNode;
}

export function Interface(props: InterfaceProps) {
    const type = props.type;
    const properties = _.map(type.children, property => {
        return (
            <span key={`property-${property.name}-${property.type}-${type.name}`}>
                {property.name}:{' '}
                {property.type.type !== TypeDocTypes.reflection ?
                    <Type type={property.type} /> :
                    <MethodSignature
                        signature={property.type.declaration.signatures[0]}
                        shouldHideMethodName={true}
                        shouldUseArrowSyntax={true}
                    />
                },
            </span>
        );
    });
    const hasIndexSignature = !_.isUndefined(type.indexSignature);
    if (hasIndexSignature) {
        _.each(type.indexSignature, indexSignature => {
            const params = _.map(indexSignature.parameters, p => {
                return (
                    <span key={`indexSigParams-${p.name}-${p.type}-${type.name}`}>
                        {p.name}: <Type type={p.type} />
                    </span>
                );
            });
            properties.push((
                <span key={`indexSignature-${type.name}-${indexSignature.type.name}`}>
                    [{params}]: {indexSignature.type.name},
                </span>
            ));
        });
    }
    const propertyList = _.reduce(properties, (prev: React.ReactNode, curr: React.ReactNode) => {
        return [prev, '\n\t', curr];
    });
    return (
        <span>
            {`{`}
                <br />
                {'\t'}{propertyList}
                <br />
            {`}`}
        </span>
    );
}
