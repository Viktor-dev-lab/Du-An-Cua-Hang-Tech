const express = require('express') 
const route = express.Router()
const controller = require('../../controllers/client/chat.controller.js')

// Middlwares
const chatMiddlware = require('../../middlewares/client/chat.middleware.js');

route.get('/create', controller.index);
route.post('/create', controller.createPost);
route.get('/add/:roomChatID', chatMiddlware.isAccess, controller.getAddMember);
route.post('/add/:roomChatID', chatMiddlware.isAccess, controller.postAddMember);

module.exports = route