export const orderSchema = {
    id: '/Order',
    properties: {
        maker: {$ref: '/OrderTaker'},
        taker: {$ref: '/OrderTaker'},
        signature: {$ref: '/SignatureData'},
        expiration: {type: 'number'},
    },
    required: ['maker', 'taker', 'signature', 'expiration'],
    type: 'object',
};
