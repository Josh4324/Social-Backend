const mongoose = require("mongoose");
const argon2 = require("argon2");

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "Please provide Your role"],
        trim: true,
    },
});


const Role = mongoose.model("Role", roleSchema);

module.exports = Role;