// Only import the actual application from the app.js file and then
// start the application
//
// Now the Express app and the code taking care of the web server are
// separated from each other following the best practices. One of the
// advantages of this method is that the application can now be tested
// at the level of HTTP API calls without actually making calls via HTTP
// over the network, this makes the execution of tests faster.

// The actual Express application
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})