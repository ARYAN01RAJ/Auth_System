const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect("process.env.MONGO_URI")

const AdminSchema = new mongoose.Schema({
    email: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
})

const Admin = mongoose.model("Admin",AdminSchema);
const User = mongoose.model("User",UserSchema);

module.exports = {
    Admin,
    User
}