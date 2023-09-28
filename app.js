const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())

// To make express show static content, the page index.html and the
// JavaScript, etc., it fetches, we need a built-in middleware from
// Express called static.
//
// whenever express gets an HTTP GET request it will first check if
// the dist directory contains a file corresponding to the request's
// address. If a correct file is found, express will return it.
app.use(express.static('dist'))

// This is a built-in middleware function in Express. It parses incoming
// requests with JSON payloads
//
// Returns middleware that only parses JSON and only looks at requests
// where the Content-Type header matches the type (default
// application/json) option
//
// A new body object containing the parsed data is populated on the
// request object after the middleware (i.e. req.body), or an empty
// object ({}) if there was no body to parse, the Content-Type was not
// matched, or an error occurred
app.use(express.json())

app.use(middleware.requestLogger)

// application takes the router into use
app.use('/api/notes', notesRouter)

// must be one after controllers
app.use(middleware.unknownEndpoint)

// error handlers are last
app.use(middleware.errorHandler)

module.exports = app