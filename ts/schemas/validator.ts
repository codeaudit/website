import {Validator as V} from 'jsonschema';
import {assetTokenSchema} from 'ts/schemas/asset_token_schema';
import {sideToAssetTokenSchema} from 'ts/schemas/side_to_asset_token_schema';
import {signatureDataSchema} from 'ts/schemas/signature_data_schema';
import {orderSchema} from 'ts/schemas/order_schema';

export class Validator {
    private v: V;
    constructor() {
        this.v = new V();
        this.v.addSchema(assetTokenSchema, assetTokenSchema.id);
        this.v.addSchema(sideToAssetTokenSchema, sideToAssetTokenSchema.id);
        this.v.addSchema(signatureDataSchema, signatureDataSchema.id);
        this.v.addSchema(orderSchema, orderSchema.id);
    }
    public validate(instance: object, schema: object) {
        return this.v.validate(instance, schema);
    }
}
