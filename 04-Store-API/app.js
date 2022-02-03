const connectDB = require("./db/connect");
const express = require("express");
const router = require("./routes/projects");
const app = express();
require('express-async-errors')
require("dotenv").config();
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

app
  .use([express.urlencoded({ extended: false }), express.json()])
  .get("/", (req, res) => res.send(`<h1>Store API</h1>`))
  .use("/api/v1/products", router)

  //error handlers
  .use(errorHandler)
  .use(notFound)

//you can define your port value on pc using:
//CLI => set PORT = 
//now the port is set in the computers environment 
//on macs use
//starter 

const port = process.env.PORT || 3000;


const startApp = () => {
  try {
    connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`listening @ ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startApp();
