import * as _ from 'lodash';
import * as React from 'react';
import {Link as ScrollLink} from 'react-scroll';
import {colors} from 'material-ui/styles';
import {constants} from 'ts/utils/constants';
import {TypeDocType, TypeDocTypes} from 'ts/types';
import {utils} from 'ts/utils/utils';

const BUILT_IN_TYPE_COLOR = '#e69d00';
const STRING_LITERAL_COLOR = '#4da24b';

// Some types reference other libraries. For these types, we want to link the user to the relevant documentation.
const typeToUrl: {[typeName: string]: string} = {
    Web3: constants.WEB3_DOCS_URL,
    Provider: constants.WEB3_PROVIDER_DOCS_URL,
    BigNumber: constants.BIGNUMBERJS_GITHUB_URL,
};

const typeToSection: {[typeName: string]: string} = {
    ExchangeWrapper: 'exchange',
    TokenWrapper: 'token',
    TokenRegistryWrapper: 'tokenRegistry',
};

interface TypeProps {
    type: TypeDocType;
}

// The return type needs to be `any` here so that we can recursively define <Type /> components within
// <Type /> components (e.g when rendering the union type).
export function Type(props: TypeProps): any {
    const type = props.type;
    const isIntrinsic = type.type === TypeDocTypes.intrinsic;
    const isReference = type.type === TypeDocTypes.reference;
    const isArray = type.type === TypeDocTypes.array;
    const isStringLiteral = type.type === TypeDocTypes.stringLiteral;
    let typeName: string|React.ReactNode;
    if (isIntrinsic || isReference) {
        typeName = type.name;
    } else if (isStringLiteral) {
        typeName = `'${type.value}'`;
    } else if (isArray) {
        typeName = type.elementType.name;
    }
    let typeArgs: React.ReactNode[] = [];
    if (type.typeArguments) {
        typeArgs = _.map(type.typeArguments, arg => {
            if (arg.type === TypeDocTypes.array) {
                return (
                    <span>
                        <Type
                            key={`type-${arg.elementType.name}-${arg.elementType.value}-${arg.elementType.type}`}
                            type={arg.elementType}
                        />[]
                    </span>
                );
            } else {
                return (
                    <Type
                        key={`type-${arg.name}-${arg.value}-${arg.type}`}
                        type={arg}
                    />
                );
            }
        });
    } else if (type.type === TypeDocTypes.union) {
        const unionTypes = _.map(type.types, t => {
            return (
                <Type
                    key={`type-${t.name}-${t.value}-${t.type}`}
                    type={t}
                />
            );
        });
        typeName = _.reduce(unionTypes, (prev: React.ReactNode, curr: React.ReactNode) => {
            return [prev, '|', curr];
        });
    }
    const commaSeparatedTypeArgs = _.reduce(typeArgs, (prev: React.ReactNode, curr: React.ReactNode) => {
        return [prev, ', ', curr];
    });

    const typeNameUrlIfExists = typeToUrl[(typeName as string)];
    const sectionNameIfExists = typeToSection[(typeName as string)];
    if (!_.isUndefined(typeNameUrlIfExists)) {
        typeName = (
            <a
                href={typeNameUrlIfExists}
                target="_blank"
                className="text-decoration-none"
                style={{color: colors.cyanA700}}
            >
                {typeName}
            </a>
        );
    } else if ((isReference || isArray) &&
                (_.includes(constants.public0xjsTypes, typeName) ||
                !_.isUndefined(sectionNameIfExists))) {
        const typeDefinitionAnchorId = _.isUndefined(sectionNameIfExists) ? typeName : sectionNameIfExists;
        typeName = (
            <ScrollLink
                to={typeDefinitionAnchorId}
                offset={-45}
                duration={constants.DOCS_SCROLL_DURATION_MS}
            >
                <span
                    onClick={utils.setUrlHash.bind(null, typeDefinitionAnchorId)}
                    style={{color: colors.cyanA700, cursor: 'pointer'}}
                >
                    {typeName}
                </span>
            </ScrollLink>
        );
    }
    let typeNameColor = 'inherit';
    if (isIntrinsic) {
        typeNameColor = BUILT_IN_TYPE_COLOR;
    } else if (isStringLiteral) {
        typeNameColor = STRING_LITERAL_COLOR;
    }
    return (
        <span>
            <span style={{color: typeNameColor}}>{typeName}</span>
            {isArray && '[]'}{!_.isEmpty(typeArgs) &&
                <span>
                    {'<'}{commaSeparatedTypeArgs}{'>'}
                </span>
            }
        </span>
    );
}
