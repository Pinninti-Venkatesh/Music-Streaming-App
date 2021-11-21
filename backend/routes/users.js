const express = require('express');
const { getUserById,getUser,updateUser,updatePhoto,resetPassword,addSongToLibrary,addAlbumToLibrary,addPlaylistToLibrary} = require('../controllers/users');
const {getSongById}=require("../controllers/songs");
const { getAlbumById} = require('../controllers/albums');
const {getPlaylistById} = require('../controllers/playlists');
const router=express.Router();

router.param("userId",getUserById);
router.param("songId",getSongById);
router.param("albumId",getAlbumById);
router.param("playlistId",getPlaylistById);

router.get("/:userId",getUser);
router.put("/:userId",updateUser);
router.put("/photo/:userId",updatePhoto);
router.put("/reset-password",resetPassword);

router.put("/library/song/:userId/:songId",addSongToLibrary);//working
router.put("/library/album/:userId/:albumId",addAlbumToLibrary);//working
router.put("/library/playlist/:userId/:playlistId",addPlaylistToLibrary);//working

module.exports=router;