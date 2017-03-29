export const assetTokenSchema = {
    id: '/AssetToken',
    properties: {
        amount: {type: 'number'},
        symbol: {type: 'string'},
    },
    required: ['symbol'],
    type: 'object',
};
