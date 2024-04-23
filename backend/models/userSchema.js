const mongoose = require( "mongoose");
const validator = require( "validator");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "firstname is required"],
    },
    lastname: {
        type: String,
        required: [true, "lastname is required"],
    },
    username: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique : true,
        validate : validator.isEmail,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength : [6, "Password Must Be Atleast 6 characters"],
    },
    avatar: {
        type: String,
        default: 'https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Free-Download.png' // Default image URL
    },
    status: {
        type: String,
        default: 'Offline'
    },
    lastSeen: {
        type: Date
    }

    
},{
    timestamps : true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
