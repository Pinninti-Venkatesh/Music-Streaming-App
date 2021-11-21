const express = require('express');
const { createPlaylist, likePlaylist, getPlaylistById,addSongInPlayList, getPlaylist, getPlaylists} = require('../controllers/playlists');
const {getSongById}=require("../controllers/songs");
const { addPlaylistToLikes,getUserById } = require('../controllers/users');
const router=express.Router();

router.param("playlistId",getPlaylistById);
router.param("songId",getSongById);
router.param("userId",getUserById);

router.get('/all',getPlaylists);
router.post("/create",createPlaylist);
router.get("/like/:userId/:playlistId",addPlaylistToLikes,likePlaylist);
router.get("/:playlistId",getPlaylist);
router.get("/:playlistId/:play",getPlaylist);
router.put("/add/song/:playlistId/:songId",addSongInPlayList);

module.exports=router;