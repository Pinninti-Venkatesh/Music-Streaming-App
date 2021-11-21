const express = require('express');
const router = express.Router();

const {addSong,songCover,getSong,getSongById, getSongs, playSong,likeSong}=require("../controllers/songs");
const {getUserById, addSongToLikes } = require('../controllers/users');

router.param("songId",getSongById);//working
router.param("userId",getUserById);

router.get('/all',getSongs);//working

router.post('/add',addSong);

router.get('/:songId',getSong);//working
router.get("/play/:songId",playSong);//working
router.get('/photo/:songId',songCover);//working
router.get("/like/:userId/:songId",addSongToLikes,likeSong);//working

module.exports=router;