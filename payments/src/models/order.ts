import mongoose, { Document, model, Model, Schema } from "mongoose";
import { OrderStatus } from "@tickets_rk/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// list of properties that we need to have to create an order
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// list of properties that the db stored order has
interface OrderDoc extends Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// DAO object - has methods to call db.
interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

// make a new collection 'Order' from given schema
export const Order = model<OrderDoc, OrderModel>("Order", orderSchema);
