// The environment variables defined in the .env file can be taken into 
// use with the expression
require('dotenv').config()

const express = require('express')

/*
function that is used to create an express application stored in the app 
variable
*/
const app = express()

const cors = require('cors')


const Note = require('./models/note')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name = 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())

/*
This is a built-in middleware function in Express. It parses incoming 
requests with JSON payloads

Returns middleware that only parses JSON and only looks at requests where 
the Content-Type header matches the type (default application/json) 
option

A new body object containing the parsed data is populated on the request
object after the middleware (i.e. req.body), or an empty object ({}) if 
there was no body to parse, the Content-Type was not matched, or an error 
occurred
*/
app.use(express.json())

/*
To make express show static content, the page index.html and the 
JavaScript, etc., it fetches, we need a built-in middleware from 
Express called static.

whenever express gets an HTTP GET request it will first check if 
the dist directory contains a file corresponding to the request's 
address. If a correct file is found, express will return it.
*/
app.use(express.static('dist'))

app.use(requestLogger)

// not in model answer
app.get('/', (request, response) => {
  /*
  ince the parameter is a string, express automatically sets the value 
  of the Content-Type header to be text/html
  */
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    /*
    Express automatically sets the Content-Type header with the 
    appropriate value of application/json.
    */
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  /*
  Without the json-parser, the body property would be undefined. The 
  json-parser takes the JSON data of a request, transforms it into a 
  JavaScript object and then attaches it to the body property of the 
  request object before the route handler is called.
  */
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save()
    .then(savedNote => {
      // The data sent back in the response is the formatted version 
      // created automatically with the toJSON method
      response.json(savedNote)
    })

    // If we try to store an object in the database that breaks one of 
    // the constraints, the operation will throw an exception
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  // When using findOneAndUpdate and related methods, mongoose doesn't 
  // automatically run validation. To trigger this, you need to pass a 
  // configuration object. For technical reasons, this plugin requires 
  // that you also set the context option to query.
  Note.findByIdAndUpdate(
      request.params.id,
      note,
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})