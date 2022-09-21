const Job = require("../models/Job")
const {StatusCodes} = require("http-status-codes");
const {NotFoundErrors, BadRequestError} = require("../errors");

// * Get all jobs applications
const getAllJobs = async (request, response) =>{

    // ? Finding all jobs in DB with the same userId and Jobs id with which it was created
    const jobs = await Job.find({createdBy:request.user.userId}).sort("createdAt")

    // * If it works
    response.status(StatusCodes.CREATED).json({jobs , count:jobs.length})
}

// * Get a single job application
const getJob = async (request, response) =>{

    // ? Destructuring  so that we get user as an userId and for params we get the id  and rename it jobsId
    const {
        user:{userId},
        params:{id:jobsId}
    } = request
    console.log(userId, jobsId)

    // + Locking for the job with the given _id and buy whom it was created
    const job = await Job.findOne({
        _id:jobsId,
        createdBy:userId,
    })

    // ! Error for no job found
    if (!job){
        throw new NotFoundErrors(`No job with id ${jobsId}`)
    }

    // * If it works
    response.status(StatusCodes.OK).json({job})

}

// ? Create a job application
const createJob = async (request, response) =>{

    // + Giving the same id as the id of the user to easily manipulate it
    request.body.createdBy = request.user.userId

    // * Creating the user
    const job = await Job.create(request.body)

    // * If it works
    response.status(StatusCodes.CREATED).json({job})
}

// + Update a jub application
const updateJob = async (request, response) =>{

    // ? Destructuring  so that we get user as an userId and for params we get the id  and rename it jobsId
    const {
        body:{
          company,
          position,
        },
        user:{userId},
        params:{id:jobsId}
    } = request
    console.log(userId, jobsId)

    // ! Error if nothing was set to update
    if(company === "" || position === ""){
        throw new BadRequestError("Company or position can't be empty")
    }

    // + Locking for the job with the given _id and buy whom it was created
    const job = await Job.findByIdAndUpdate(
        { // * The first one is for selecting what to update in ths exp we are selecting a job with this ID
        _id:jobsId,
        createdBy:userId,
        },// + The second one is what are we updating in this exp we are updating its body with the values that we extracted in the uper request
        request.body,
        {// * To show us new updated post
            new:true,
            runValidators:true
        }
    )

    // ! Error for no job found
    if (!job){
        throw new NotFoundErrors(`No job with id ${jobsId}`)
    }

    // * If it works
    response.status(StatusCodes.OK).json({job})

}

// ! Delete the job application
const deleteJob = async (request, response) =>{

    // ? Destructuring  so that we get user as an userId and for params we get the id  and rename it jobsId
    const {
        user:{userId},
        params:{id:jobsId}
    } = request
    console.log(userId, jobsId)

    // + Locking for the job with the given _id and buy whom it was created
    const job =  await Job.findByIdAndDelete({
        _id:jobsId,
        createdBy:userId,
    })

    // ! Error for no job found
    if (!job){
        throw new NotFoundErrors(`No job with id ${jobsId}`)
    }

    // * If it works
    response.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}