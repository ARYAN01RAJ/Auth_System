const mongoose = require("mongoose");
const { boolean } = require("zod");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));


const AdminSchema = new mongoose.Schema({
    email: String,
    password: String,
    verificationToken: String,
    isVerified: Boolean
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