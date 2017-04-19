import {Validator as V} from 'jsonschema';
import {signatureDataSchema} from 'ts/schemas/signature_data_schema';
import {orderSchema} from 'ts/schemas/order_schema';
import {tokenSchema} from 'ts/schemas/token_schema';
import {orderTakerSchema} from 'ts/schemas/order_taker_schema';

export class Validator {
    private v: V;
    constructor() {
        this.v = new V();
        this.v.addSchema(signatureDataSchema, signatureDataSchema.id);
        this.v.addSchema(tokenSchema, tokenSchema.id);
        this.v.addSchema(orderTakerSchema, orderTakerSchema.id);
        this.v.addSchema(orderSchema, orderSchema.id);
    }
    public validate(instance: object, schema: object) {
        return this.v.validate(instance, schema);
    }
}
