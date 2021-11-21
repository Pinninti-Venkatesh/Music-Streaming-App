require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const logger = require('./logger/logger');
const cors = require('cors');

const authenticationRouter = require("./routes/authentication");
const songRouter = require("./routes/songs");
const albumRouter=require("./routes/albums");
const playlistRouter=require("./routes/playlists");
const userRouter=require("./routes/users");

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log('mongodb connected');
    logger.info('mongodb connected');
}).catch((err) => {
    logger.error('error in connecting to DB', err);
    console.log('error in connecting to DB', err);
});

//temporary start
app.use('/dropzone', express.static(path.join(__dirname, 'dropzone')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //__dirname : It will resolve to your project folder.
});
//temporary end

app.use(express.json());
app.use(cors());

app.use("", authenticationRouter);
app.use("/song", songRouter);
app.use("/album",albumRouter);
app.use("/playlist",playlistRouter);
app.use("/user",userRouter);

app.listen(8080, () => {
    logger.info("hymn server is running at 8080");
    console.log('hymn server is running at 8080');
});