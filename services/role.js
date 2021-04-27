const Role = require('../models/role');

module.exports = class RoleService {
   
    async findRoleWithName(role){
        return await Role.findOne({role});
    }

    async createRole(role){
        return await Role.create(role);
    }  

    async findAllRoles(){
        return await Role.find({});
    }

    async editRole(role, payload){
        return await Role.findOneAndUpdate(role, payload, {
            new: true,
        });
    }

    async deleteRole(role){
        return await Role.deleteOne({role});
    }  
    
}