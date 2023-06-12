const mongoose = require('mongoose')

const saveSchema = new mongoose.Schema({
    problems: Array,
    toggle: Number,
    bounds: Array,
})

saveSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Saves', saveSchema)