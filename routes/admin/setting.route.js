const express = require('express') 
const router = express.Router()
const uploadClound = require('../../middlewares/admin/uploadClound.middleware.js')

// Upload Image
const multer = require('multer');
const fileUpload  = multer();

// Controller
const controller = require('../../controllers/admin/setting.controller.js')

// Validate
const validate = require('../../validates/admin/product.validate.js');

// route
router.get('/general', controller.general)
router.patch(
    "/general",
    fileUpload.single('logo'),
    uploadClound.upload,
    controller.generalPatch
)


module.exports = router
