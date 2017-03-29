export const sideToAssetTokenSchema = {
    id: '/SideToAssetToken',
    properties: {
        deposit: {$ref: '/AssetToken'},
        receive: {$ref: '/AssetToken'},
    },
    required: ['deposit', 'receive'],
    type: 'object',
};
