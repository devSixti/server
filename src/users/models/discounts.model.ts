import { model, Schema } from "mongoose";

const discountSchema = new Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    type: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0.1
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },
},
    { timestamps: true }

);

discountSchema.index({ user_id: 1, type: 1 }, { unique: true });

export const DiscountModel = model('Discounts', discountSchema);

