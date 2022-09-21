require("dotenv").config()
require("express-async-errors")

// + Packages for extra security
const helmet = require("helmet")
const cors  = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

// * Swagger
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml")

const express = require("express")
const {connectDB} = require("./config/db");
const {errorHandlerMiddleware} = require("./middleware/error-handler");
const {notFound} = require("./middleware/not-found");
const {authRout} = require("./routes/auth");
const {jobRout} = require("./routes/jobs");
const {auth} = require("./middleware/authentication");
const app = express()
const port = process.env.PORT || 8000

// * DB connection
connectDB()
    .then(() => console.log("Connected"))
    .catch(error => console.log(error))

// + App security
app.set("trust proxy", 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // ? 15 minutes
    max: 100 // ? limit each IP to 100 requests per windowsMs
}))
app.use(helmet())
app.use(cors())
app.use(xss())

// ? Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// + Home page
app.get("/", (require,response) =>{
    response.send(`
    <h1>Job API</h1><br>
    <a href="/api-docs">Documentation</a>
    `)
})
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocument))

// * Routes
app.use("/api/v1/auth", authRout)
app.use("/api/v1/jobs",auth , jobRout)

// ! Errors
app.use(notFound)
app.use(errorHandlerMiddleware)

// + Http server
app.listen(port, () => {
    console.log(`We are connected at ${port}`)
})