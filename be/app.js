const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const router = require('./src/routers/public.routes')
const apiRoute = require('./src/routers/private.routes.js')
const { errorMiddleware } = require("./src/middlewares/error.middleware.js");
const { logMiddleware } = require("./src/middlewares/logging.middleware.js");
const helmet = require('helmet')
const cors = require('cors')

const app = express();


const corsOptions = {
    credentials: true,
    origin: "*",
  };

  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(errorMiddleware)
app.use(router)
app.use(apiRoute)
app.use(logMiddleware)

app.use((req, res, next) => {
    res.status(404).json({
      error: true,
      message: "Resource not found",
    });
  });
  

module.exports = app;
