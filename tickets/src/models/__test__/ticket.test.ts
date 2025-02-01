import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "uuu",
    price: 5,
    userId: "123",
  });

  // save the ticket to the database
  await ticket.save();

  // fetch the ticket twice into two separate const
  const ticketOne = await Ticket.findById(ticket.id);
  const ticketTwo = await Ticket.findById(ticket.id);

  // console.log("aaaaaaa", ticketOne); version wil be 0

  // make a change on ticket one.
  ticketOne!.set({
    title: "mmm",
  });

  // make a change on ticket two.
  ticketTwo!.set({
    title: "fff",
  });

  // save ticket 1. Should be code 200
  await ticketOne!.save();
  // will have version set to 1
  //console.log("bbbbbb", await Ticket.findById(ticket.id));

  // save it Should be an error VersionError: No matching document found for id "679d3a74a20a6e827143e98e" version 0 modifiedPaths "title"
  const expectingErrorMessage = `No matching document found for id "${ticket.id}" version 0 modifiedPaths "title"`;
  await expect(ticketTwo!.save()).rejects.toThrow(expectingErrorMessage);

  // expect(async () => {
  //   const t = await ticketTwo!.save();
  // }).rejects.toThrow();
});

it("increments a version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "uuu",
    price: 5,
    userId: "123",
  });

  // save the ticket to the database
  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
