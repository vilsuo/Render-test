// Defines the Mongoose schema for notes

// Document databases like Mongo are schemaless, meaning that the
// database itself does not care about the structure of the data that
// is stored in the database. It is possible to store documents with
// completely different fields in the same collection.
//
// The idea behind Mongoose is that the data stored in the database is
// given a schema at the level of the application that defines the shape
// of the documents stored in any given collection.
const mongoose = require('mongoose')

// Everything in Mongoose starts with a Schema. Each schema maps to a
// MongoDB collection and defines the shape of the documents within that
// collection.
//
// Each key in our noteSchema defines a property in our documents which
// will be cast to its associated SchemaType
//
// Schema tells Mongoose how the note objects are to be stored in the
// database.
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// A model is a class with which we construct document Instances of
// Models are documents
//
// To use our schema definition, we need to convert our noteSchema into
// a Model we can work with
//
// In the Note model definition, the first "Note" parameter is the
// singular name of the model. The name of the collection will be the
// lowercase plural notes, because the Mongoose convention is to
// automatically name collections as the plural (e.g. notes) when the
// schema refers to them in the singular
module.exports = mongoose.model('Note', noteSchema)