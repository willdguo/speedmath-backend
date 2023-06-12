const savesRouter = require('express').Router()
const Saves = require('../models/saves')

savesRouter.get('/info', (request, response) => {

    Saves.find({}).then(saves => {
        response.send(`<p> Hello World! <p> <p> ${saves.length} games available`)
    })

})

savesRouter.get('/', (request, response) => {

    Saves.find({}).then(saves => {
        response.json(saves)
    })

})

savesRouter.get('/:id', (request, response, next) => {
    const id = request.params.id

    Saves.findById(id)
        .then(save => {
            if(save) {
                response.json(save)
            } else {
                response.status(404).end()
            }
        }).catch(error => next(error))

})


savesRouter.post('/', (request, response) => {
    const body = request.body

    const save = new Saves({
        problems: body.problems,
        toggle: body.toggle,
        bounds: body.bounds
    })

    save.save().then(newSave => {
        response.json(newSave)
    })

})


savesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const newSave = {
        problems: body.problems,
        toggle: body.toggle,
        bounds: body.bounds
    }

    Saves.findByIdAndUpdate(request.params.id, newSave, { new: true})
        .then(result => {
            response.json(newSave)
        })
        .catch(error => next(error))
})

module.exports = savesRouter



