// Clound
const uploadCloundinary = require('../../helpers/uploadCloundinary');

module.exports.upload = async (req, res, next) => {
    if (req.file){
        const result = await uploadCloundinary(req.file.buffer);
        req.body[req.file.fieldname] = result;
    } 
    next();
}