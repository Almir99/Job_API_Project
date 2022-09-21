const {StatusCodes} = require("http-status-codes");

const errorHandlerMiddleware = (error, require, response, next) =>{

    // ! Custom Error
    let customError = {
        statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: error.message || "Something went wrong"
    }

    // ! Custom validation Error for mongoose DB
    if (error.name === "ValidationError"){
        customError.msg = Object.values(error.errors)
            .map(item => item.message)
            .join(", ")
        customError.statusCode = 400;
    }
    // ! Custom cast Error for mongoose DB
    if (error.name === "CastError"){
        customError.msg = `No item found with id: ${error.value}`
        customError.statusCode = 404;
    }

    // ! Custom Error for mongoose DB (in this case it for the duplicates aka only for thous schemas that use unique)
    if(error.code && error.code === 11000){
        customError.msg = `Duplicate value entered for ${Object.keys(error.keyValue)} field, please choose another value`;
        customError.statusCode = 400
    }
    console.log(customError.statusCode)
    console.log({msg: customError.msg})
    return  response.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = {
    errorHandlerMiddleware
}