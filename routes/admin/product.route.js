const express = require('express') // thêm thư viện express
const router = express.Router()
const controller = require('../../controllers/admin/product.controller')
const uploadClound = require('../../middlewares/admin/uploadClound.middleware.js')

// Upload Image
const multer = require('multer');
const fileUpload  = multer();

// Validate
const validate = require('../../validates/admin/product.validate.js');

// route
router.get('/', controller.product)
router.patch("/change-status/:status/:id", controller.changeStatus)
router.patch("/change-multi", controller.changeMulti)

router.get("/restore", controller.GetRestore); 
router.patch("/restore", controller.PatchRestore); 

router.delete("/delete/permanently/:id", controller.changeDeletePermanently)
router.delete("/delete/temporarily/:id", controller.changeDeleteTemporarily)

router.get('/create', controller.create)
router.post(
    '/create', 
    fileUpload.single('thumbnail'),
    uploadClound.upload,
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit)
router.patch(
    "/edit/:id",
    fileUpload.single('thumbnail'),
    uploadClound.upload,
    validate.createPost,
    controller.editPatch
)

router.patch("/restore/:id", controller.restore)
router.get("/detail/:id", controller.detail)


module.exports = router
