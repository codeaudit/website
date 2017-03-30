export const orderSchema = {
    id: '/Order',
    properties: {
        assetTokens: {$ref: '/SideToAssetToken'},
        expiry: {type: 'number'},
        maker: {type: 'string'},
        signature: {$ref: '/SignatureData'},
        taker: {type: 'string'},
    },
    required: ['assetTokens', 'expiry', 'signature', 'taker', 'maker'],
    type: 'object',
};
