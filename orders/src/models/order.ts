import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@tickets_rk/common";
import { TicketDoc } from "./ticket";

// for more logical access on the ticket model
export { OrderStatus };

// same as detail. Properties which will be passed in an order creation
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// how a row in the database will look.
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

// dao interface. Takes in an OrderAttrs object and returns OrderDoc object
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

// create table
const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    // when selecting data from db, transform it before returning to the user
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrdersSchema.set("versionKey", "version");
OrdersSchema.plugin(updateIfCurrentPlugin);

// ts validate Order.
OrdersSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

// DAO object
const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrdersSchema);

export { Order };
