export const orderSchema = {
    id: '/Order',
    properties: {
        maker: {$ref: '/OrderTaker'},
        taker: {$ref: '/OrderTaker'},
        salt: {type: 'string'},
        signature: {$ref: '/SignatureData'},
        expiration: {type: 'string'},
    },
    required: ['maker', 'taker', 'salt', 'signature', 'expiration'],
    type: 'object',
};
