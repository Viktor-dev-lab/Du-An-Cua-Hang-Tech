const express = require('express') // thêm thư viện express
const route = express.Router()
const controller = require('../../controllers/client/product.controller')


route.get('/',controller.index)
route.get('/delete',controller.delete)
route.get('/create',controller.create)
route.get('/detail/:slugProduct',controller.detail)
route.get('/:slugCategory',controller.category)

module.exports = route