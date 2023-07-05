const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


const tokenExtractor = (request, response, next) => {

    const auth = request.get('authorization')
    //console.log(auth)
    if(auth && auth.startsWith('Bearer')){
      request.token = auth.replace('Bearer ', '')
      //console.log(request.token)
    }
  
    next()

}

async function userExtractor (request, response, next) {

  console.log(request.token)

  if(request.token){

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({error: 'invalid token'})
    }
  
    request.user = await User.findById(decodedToken.id)

  }

  next()
}

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted object' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).send( { error: error.message })
    }
  
  
    next(error)
}


module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
}