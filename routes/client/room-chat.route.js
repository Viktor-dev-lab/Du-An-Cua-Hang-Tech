const express = require('express') // thêm thư viện express
const route = express.Router()
const controller = require('../../controllers/client/room-chat.controller.js')

// Middlware
const chatMiddlware = require('../../middlewares/client/chat.middleware.js');

route.get('/:roomChatId',chatMiddlware.isAccess, controller.index);


module.exports = route