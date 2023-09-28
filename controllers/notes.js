// A router object is an isolated instance of middleware and routes.
// You can think of it as a “mini-application,” capable only of
// performing middleware and routing functions. Every Express
// application has a built-in app router.
//
// Define the relative parts of the routes
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.post('/', (request, response, next) => {
  // Without the json-parser, the body property would be undefined. The
  // json-parser takes the JSON data of a request, transforms it into a
  // JavaScript object and then attaches it to the body property of the
  // request object before the route handler is called.
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  // When the object is saved to the database, the event handler provided
  // to then gets called. The result of the save operation is in the
  // result parameter of the event handler
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

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
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
    // pass a regular JS object
    note,
    {
      // Return the updated version, (default returns the old one)
      new: true,
      // Mongoose doesn't automatically run validation. To trigger this,
      // you need to pass a configuration object. For technical reasons,
      // this plugin requires that you also set the context option to
      // query.
      runValidators: true, context: 'query'
    }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter