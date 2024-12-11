const express = require('express') 
const router = express.Router()
const controller = require('../../controllers/admin/auth.controller')

// Validate
const validate = require('../../validates/admin/auth.validate.js');

// route
router.get('/login', controller.index)
router.post('/login', validate.loginPost, controller.loginPost)
router.get('/logout', controller.logout)

module.exports = router
