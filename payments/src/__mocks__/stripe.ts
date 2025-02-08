export const stripe = {
  charges: {
    // mock a method which returns a promise
    create: jest.fn().mockResolvedValue({}),
  },
};
