const User = require("../models/User")
const jwt = require("jsonwebtoken")
const {UnauthenticatedError} = require("../errors");


const auth = (request, response, next) => {
    // ? Checks the header
    const authHeader = request.headers.authorization

    // ! Error if the token is found aka authorization header is emty
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new UnauthenticatedError("Authentication invalid")
    }
    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // + Attach the user to the job routes
        request.user = {userId: payload.userId}
        next()
    }
    catch (error){
        throw new UnauthenticatedError("Authentication invalid")
    }
}
module.exports = {
    auth
}