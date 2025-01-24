export const natsWrapper = {
  // the only property we need to simulate is client. Which has publish method
  client: {
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // },

    // to make sure our function is trackable:
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
