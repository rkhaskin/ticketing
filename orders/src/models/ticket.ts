import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// same as detail. Properties which will be passed in an order creation
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// how a row in the database will look.
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// dao interface. Takes in an OrderAttrs object and returns OrderDoc object
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticket: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

// rename "__v" column to "version"
ticketsSchema.set("versionKey", "version");

// update version column automatically
ticketsSchema.plugin(updateIfCurrentPlugin);

// use old style function because of mongo.
// make sure the ticket is not reserved: run a query against all orders. See if our ticket matches a ticket on any not cancelled order.
// if we find a not cancelled order with our ticket, then the ticket is reserved
ticketsSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    // this === the ticket doc on which we just have called isReserved
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        OrderStatus.Created,
      ],
    },
  });

  // takes the existing order. If existingOrder is null, !existingOrder will flip it to true. The second exclamation order will flip it to false.
  return existingOrder ? true : false;
  // return false;
  //return !!existingOrder;
};

ticketsSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketsSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    price: attrs.price,
    title: attrs.title,
  });
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketsSchema);

export { Ticket };
