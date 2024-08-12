require('dotenv').config();

import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import api from './api';
import socket from './socket';
import passport from 'passport';
import passportConfig from './passport';
import dbConfig from './database';
import cache from './cache';

const initializer = async () => {
    await dbConfig();
    return await cache();
}

const server = data => {
    const app = express();

    const sessionMiddleware = session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: 'chess',
    });
    
    app.set('views', path.join(__dirname, 'views'));
    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, '../../client/build')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({credentials: true, origin: true}));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(sessionMiddleware);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/api', api);
    app.set('port', process.env.PORT || 4000);

    passportConfig();

    Object.keys(data).forEach(key => {
        app.set(key, data[key]);
    });
    
    //  라우팅 로직을 제외한 모든 get요청
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
    
    const server = app.listen(app.get('port'), () => {
        console.dir(`Port ${app.get('port')} => listening~`);
    })
    
    socket(server, app, sessionMiddleware);
}

initializer().then(data => {
    server(data);
});