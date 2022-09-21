const User = require("../models/User")
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, UnauthenticatedError} = require("../errors");

// + For registering users
const register = async (request, response) =>{

    // * Creating a user in DB
    const user = await User.create({ ...request.body })

    // + User token
    const  token = user.createJWT()

    // * Conformation of a successful register
    response.status(StatusCodes.CREATED).json({user: {name: user.name} ,token})
}

// + For login in users
const login = async (request, response) =>{
    const {email, password} = request.body
    // ! Error for not giving mandatory information
    if (!email || !password){
        throw new BadRequestError("Please provide email and password")
    }
    // * Finding a user with the given email
    const user = await User.findOne({email})

    // ! Error for wrong email
    if (!user){
        throw new UnauthenticatedError("Invalid credentials")
    }

    // * Checking for a correct password
    const isPasswordCorrect = await user.comparePassword(password)

    // ! Error for the wrong password
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid credentials")
    }

    // + Token for the user
    const token =  user.createJWT()

    // * Conformation of a successful login
    response.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {
    register,
    login
}