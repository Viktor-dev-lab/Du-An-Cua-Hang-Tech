const express = require('express') 
const route = express.Router()
const controller = require('../../controllers/client/user.controller.js')

// validates
const validate = require('../../validates/client/user.validate.js')

route.get('/register',controller.register)
route.post('/register',validate.registerPost,controller.registerPost)
route.get('/login',controller.login)
route.post('/login',validate.loginPost, controller.loginPost)
route.get('/logout',controller.logout)
route.get('/password/forgot',controller.forgotPassword)

module.exports = route