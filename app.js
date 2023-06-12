const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const savesRouter = require('./controllers/saveGames')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info("connecting to mongoDB")
mongoose.connect(config.MONGODB_URI)
    .then(result => {
        logger.info('connected to mongoDB')
    })
    .catch((error) => {
        logger.info('error connecting to mongoDB')
    })

app.use(cors())
app.use(express.static('build')) // no build for rn
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/saves', savesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app


