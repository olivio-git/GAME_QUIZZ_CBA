const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const router = require('./routes/index');

const server = express();
server.disable('x-powered-by');

server.name = 'SOUNDWAVE';
server.use(cors({
    origin: '*',
    credentials: true
}))
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({limit:"50mb"}));
server.use(cookieParser());
server.use((req, res, next) => {
    res.header('access-control-allow-origin', '*');
    res.header('access-control-allow-credentials', 'true');
    res.header('access-control-allow-headers', 'origin, x-requested-with, content-type, accept, authorization');
    res.header('access-control-allow-method', 'POST, GET, DELETE, PUT');
    const now = new Date();
    res.header('server-time', now);
    next();
});
 
server.use('/api',router);

server.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.log(err)
    res.status(status).send(message);
});

module.exports =server;