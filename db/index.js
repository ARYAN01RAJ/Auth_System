const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));


const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verificationToken: String,
    isVerified: Boolean,
    resetToken: String
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verificationToken: String,
    isVerified: Boolean,
    resetToken: String
})

const Admin = mongoose.model("Admin",AdminSchema);
const User = mongoose.model("User",UserSchema);

module.exports = {
    Admin,
    User
}