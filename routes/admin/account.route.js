const express = require('express') 
const router = express.Router()
const uploadClound = require('../../middlewares/admin/uploadClound.middleware.js')

// Upload Image
const multer = require('multer');
const fileUpload  = multer();

// Validate
const validate = require('../../validates/admin/account.validate.js');

// Controller
const controller = require('../../controllers/admin/account.controller')

// route
router.get('/', controller.index)
router.get('/create', controller.create)
router.post(
    '/create', 
    fileUpload.single('avatar'),
    uploadClound.upload,
    validate.createPost,
    controller.createPost
)

module.exports = router
