const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role");
const validation = require("../middlewares/validation");



router.post('/create', validation.roleValidationRules(), validation.validate, roleController.createRole);
router.patch('/edit', validation.roleValidationRules(), validation.validate,  roleController.editRole);
router.get('/', roleController.findAllRoles);
router.ger('/', roleController.findOneRole);


module.exports = router;
