const express = require('express') 
const route = express.Router()
const controller = require('../../controllers/client/cart.controller.js')


route.post('/add/:productId',controller.addPost)

module.exports = route