const express = require("express")
const {login, register} = require("../controllers/auth");
const authRout = express.Router()

authRout.route("/login").post(login)
authRout.route("/register").post(register)

module.exports = {
    authRout
}