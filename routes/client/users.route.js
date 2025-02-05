const express = require('express') // thêm thư viện express
const route = express.Router()
const controller = require('../../controllers/client/users.controller')


route.get('/not-friend',controller.index)

module.exports = route