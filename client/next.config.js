// this file is loaded automatically by nextjs when the project starts up
// nextjs will read this file and will execute webpack middleware function, which overrides a default webpack configuration for polling
module.exports = {
  // this is a webpack middlewre
  webpack: (config) => {
    // poll for changes in the code. This will guarantee that the changes are picked up and skaffold does updates
    config.watchOptions.poll = 300;
    return config;
  },
};
