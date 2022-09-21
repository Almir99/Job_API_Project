const express = require("express")
const {getAllJobs, getJob, createJob, updateJob, deleteJob} = require("../controllers/jobs");
const jobRout = express.Router()

jobRout.route("/").get(getAllJobs).post(createJob)
jobRout.route("/:id").get(getJob).patch(updateJob).delete(deleteJob)

module.exports = {
    jobRout
}