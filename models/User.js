const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// + Mongoose schema
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please provide a name"],
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type:String,
        required: [true, "Please provide a email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/],
        unique:true,
    },
    password:{
        type:String,
        required: [true, "Please provide a password"],
        minLength: 6,
    },
})
// ? Middleware for hashing password
UserSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

// ? Function for token
UserSchema.methods.createJWT = function(){
    return jwt.sign(
        {userId:this._id , name:this.name},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME})
}
// ? Password comparator
UserSchema.methods.comparePassword = async function(givenPassword){
    const isMatch =  await bcrypt.compare(givenPassword, this.password)
    return isMatch
}

module.exports = mongoose.model("User", UserSchema)