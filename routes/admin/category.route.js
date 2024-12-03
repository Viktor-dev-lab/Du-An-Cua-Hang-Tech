const express = require('express') // thêm thư viện express
const router = express.Router()
const controller = require('../../controllers/admin/category.controller')
const uploadClound = require('../../middlewares/admin/uploadClound.middleware.js')

// Upload Image
const multer = require('multer');
const fileUpload  = multer();

// Validate
const validate = require('../../validates/admin/product-category.validate.js');

router.get('/', controller.index)
router.get('/create', controller.create)
router.post(
    '/create', 
    fileUpload.single('thumbnail'),
    uploadClound.upload,
    validate.createPost,
    controller.createPost
)

module.exports = router