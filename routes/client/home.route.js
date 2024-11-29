const express = require('express') // thêm thư viện express
const route = express.Router()
const controller = require('../../controllers/client/home.controller')

route.get('/', controller.index)
route.get('/delete', controller.delete)
route.get('/create', controller.create)

module.exports = route