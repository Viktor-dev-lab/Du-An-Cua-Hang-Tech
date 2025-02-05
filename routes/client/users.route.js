const express = require('express') // thêm thư viện express
const route = express.Router()
const controller = require('../../controllers/client/users.controller')


route.get('/not-friend',controller.notFriends)
route.get('/friends',controller.friends)
route.get('/request',controller.request)
route.get('/accept',controller.accept)

module.exports = route