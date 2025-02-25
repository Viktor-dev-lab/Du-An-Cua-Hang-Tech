const express = require('express') // thêm thư viện express
const route = express.Router()
const controller = require('../../controllers/client/room-chat.controller.js')

route.get('/', controller.index)

module.exports = route