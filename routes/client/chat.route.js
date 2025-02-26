const express = require('express') 
const route = express.Router()
const controller = require('../../controllers/client/chat.controller.js')

// Middlware

route.get('/create', controller.index);
route.post('/create', controller.createPost);

module.exports = route