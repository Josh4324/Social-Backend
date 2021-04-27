const RoleService = require("../services/role");
const {Response} = require('../helpers');
const roleService = new RoleService();

exports.createRole = async (req, res) => {
    try {
        const {role} = req.body;
        
        const newRole = await roleService.createRole(req.body);
        const response = new Response(
            true,
            201,
            "Role created successfully",
            newRole
          );
          res.status(response.code).json(response);
    } catch (err) {
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
          res.status(response.code).json(response);
    }
}

exports.editRole = async (req, res) => {
    try {
        const {
           role
        } = req.body

        const editedRole = await roleService.editRole(role);
       
        const response = new Response(
            true,
            200,
            "Role edited Successfully",
            editedRole
          );
        res.status(response.code).json(response);

    } catch (err) {
        const response = new Response(
            false,
            500,
            "Server Error",
          );
        res.status(response.code).json(response);
    }
}

exports.findAllRoles = async (req, res) => {
    try {
        const roles = roleService.findAllRoles();
        const response = new Response(
            true,
            200,
            "Roles retrieved successfully",
            roles
          );
          res.status(response.code).json(response);

    }catch(err){
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
          res.status(response.code).json(response);
    }
}

exports.findOneRole = async (req, res) => {
    try {
        const {
            role
         } = req.body
        const role = roleService.findRoleWithName(role);
        const response = new Response(
            true,
            200,
            "Role retrieved successfully",
            role
          );
          res.status(response.code).json(response);
    }catch(err){
        const response = new Response(
            false,
            500,
            "Server Error",
          );
        res.status(response.code).json(response);
    }
}



