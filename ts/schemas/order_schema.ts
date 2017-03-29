export const orderSchema = {
    id: '/Order',
    properties: {
        assetTokens: {$ref: '/SideToAssetToken'},
        expiry: {type: 'number'},
        signature: {$ref: '/SignatureData'},
        taker: {type: 'string'},
    },
    required: ['assetTokens', 'expiry', 'signature', 'taker'],
    type: 'object',
};
