
//Document databases like Mongo are schemaless, meaning that the database 
//itself does not care about the structure of the data that is stored in 
//the database. It is possible to store documents with completely different 
//fields in the same collection.
//
//The idea behind Mongoose is that the data stored in the database is 
//given a schema at the level of the application that defines the shape of 
//the documents stored in any given collection.

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fsopen:${password}@cluster0.lgu1vfr.mongodb.net/?retryWrites=true&w=majority`
  
mongoose.set('strictQuery',false)
mongoose.connect(url)

//Everything in Mongoose starts with a Schema. Each schema maps to a 
//MongoDB collection and defines the shape of the documents within that 
//collection.
//
//Each key in our noteSchema defines a property in our documents which will 
//be cast to its associated SchemaType
//
//schema tells Mongoose how the note objects are to be stored in the 
//database.
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

//A model is a class with which we construct document
//
//Instances of Models are documents
//
//To use our schema definition, we need to convert our noteSchema into a 
//Model we can work with
//
//In the Note model definition, the first "Note" parameter is the singular 
//name of the model. The name of the collection will be the lowercase 
//plural notes, because the Mongoose convention is to automatically name 
//collections as the plural (e.g. notes) when the schema refers to them in 
//the singular
const Note = mongoose.model('Note', noteSchema)

/*
// create document
const note = new Note({
  content: 'Mongoose makes things easy!',
  important: true,
})

//Since the objects are created with the model's constructor function, they 
//have all the properties of the model, which include methods for saving 
//the object to the database.
//
//Saving the object to the database happens with the appropriately named 
//save method, which can be provided with an event handler with the then 
//method:
note.save().then(result => {
  //When the object is saved to the database, the event handler provided to 
  //then gets called. The event handler closes the database connection with 
  //the command mongoose.connection.close(). If the connection is not 
  //closed, the program will never finish its execution.
  //
  //The result of the save operation is in the result parameter of the 
  //event handler
  console.log('note saved!')
  mongoose.connection.close()
})
*/
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})