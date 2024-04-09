const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportHeight: 550,
    viewportWidth: 660,
    //this is a recorder for the cypress, what i do in the test browser, it will recorded
    experimentalStudio: true,
  },
});
