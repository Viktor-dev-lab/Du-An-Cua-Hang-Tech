const express = require('express') // thêm thư viện express
const route = express.Router()
const controller = require('../../controllers/admin/dashboard.controller')

route.get('/', controller.dashboard)

module.exports = route