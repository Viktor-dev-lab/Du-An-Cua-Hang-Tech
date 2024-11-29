const express = require('express') // thêm thư viện express
const router = express.Router()
const controller = require('../../controllers/admin/product.controller')

// Upload Image
const multer = require('multer');
const storageMulter = require('../../helpers/storageMulter');
const upload = multer({ storage: storageMulter()})

// Validate
const validate = require('../../validates/product.validate.js');

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
    upload.single('thumbnail'), 
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit)
router.patch(
    "/edit/:id",
    upload.single('thumbnail'), 
    validate.createPost,
    controller.editPatch
)

router.patch("/restore/:id", controller.restore)
router.get("/detail/:id", controller.detail)


module.exports = router
