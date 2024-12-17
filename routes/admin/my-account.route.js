const express = require('express') 
const router = express.Router()
const uploadClound = require('../../middlewares/admin/uploadClound.middleware.js')

// Upload Image
const multer = require('multer');
const fileUpload  = multer();

const controller = require('../../controllers/admin/my-account.controller')

// route
router.get('/', controller.index)
router.get('/edit', controller.edit)
router.patch(
    '/edit', 
    fileUpload.single("avatar"),
    uploadClound.upload,
    controller.editPatch
)

module.exports = router
