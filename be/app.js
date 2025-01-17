const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const router = require('./src/routers/public.routes')
const apiRoute = require('./src/routers/private.routes.js')
const { errorMiddleware } = require("./src/middlewares/error.middleware.js");
const { logMiddleware } = require("./src/middlewares/logging.middleware.js");
const helmet = require('helmet')
const cors = require('cors')
const {initUpdateStatusCron} = require("./index.js")

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


app.use('/images', (req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cache-Control', 'public, max-age=86400');
    next();
}, express.static(path.join(__dirname, 'public/images'), {
    maxAge: '24h',
    etag: true,
    lastModified: true
}));

app.use(express.static(path.join(__dirname, 'public')));


initUpdateStatusCron();

app.use(router)
app.use(apiRoute)

app.use(logMiddleware)
app.use(errorMiddleware)

app.use((req, res, next) => {
    res.status(404).json({
        error: true,
        message: "Resource not found",
    });
});

module.exports = app;