import * as React from 'react';
import {colors} from 'material-ui/styles';
import {TypeDocNode} from 'ts/types';
import {constants} from 'ts/utils/constants';

interface SourceLinkProps {
    source: TypeDocNode;
}

export function SourceLink(props: SourceLinkProps) {
    const source = props.source;
    const version = constants.ZERO_EX_JS_LIBRARY_VERSION;
    const githubUrl = constants.GITHUB_0X_JS_URL;
    const sourceCodeUrl = `${githubUrl}/blob/${version}/${source.fileName}#L${source.line}`;
    return (
        <div className="pt2" style={{fontSize: 14}}>
            <a
                href={sourceCodeUrl}
                target="_blank"
                className="underline"
                style={{color: colors.grey500}}
            >
                Source
            </a>
        </div>
    );
}
