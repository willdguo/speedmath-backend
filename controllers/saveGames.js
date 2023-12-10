const savesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Saves = require('../models/saves')

savesRouter.get('/info', async (request, response) => {
    const saves = await Saves.find({})
    return response.send(`<p> Hello World! </p> <p> ${saves.length} games available </p>`)
})

savesRouter.get('/', async (request, response) => {
    const saves = await Saves.find({'user': request.user}).populate('user')
    return response.json(saves)
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


savesRouter.post('/', async (request, response) => {
    const body = request.body

    console.log('saveGames token:')
    console.log(request.token)

    if(!request.token){
        return response.status(401).json({error: 'no token found'})
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({error: 'token invalid'})
    }

    const user = request.user

    console.log('user: ')
    console.log(user.id)

    const save = new Saves({
        problems: body.problems,
        toggle: body.toggle,
        bounds: body.bounds,
        date_created: body.date_created,
        user: user.id
    })

    const result = await save.save()
    user.saves = user.saves.concat(result._id)
    await user.save()

    response.status(201).json(result)
})


// savesRouter.put('/:id', (request, response, next) => {
//     const body = request.body

//     const newSave = {
//         problems: body.problems,
//         toggle: body.toggle,
//         bounds: body.bounds,
//         date_created: body.date_created,
//     }

//     Saves.findByIdAndUpdate(request.params.id, newSave, { new: true})
//         .then(result => {
//             response.json(newSave)
//         })
//         .catch(error => next(error))
// })

module.exports = savesRouter



