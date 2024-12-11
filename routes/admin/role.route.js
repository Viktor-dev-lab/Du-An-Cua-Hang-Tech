const express = require('express') 
const router = express.Router()

// Controller
const controller = require('../../controllers/admin/role.controller')

// Validate
const validate = require('../../validates/admin/product.validate.js');

// route
router.get('/', controller.index)
router.get('/create', controller.create)
router.post('/create', controller.createPost)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', controller.editPatch)
router.get('/permission', controller.permission)
router.patch('/permission', controller.permissionPatch)
router.delete('/delete/:id', controller.delete)


module.exports = router
