const express = require('express');
const { getSongsInAlbum, likeAlbum, increasePlaysInAlbum, getAlbumById, getAlbums, albumCover } = require('../controllers/albums');
const { addAlbumToLikes,getUserById } = require('../controllers/users');
const router = express.Router();

router.param("albumId",getAlbumById);
router.param("userId",getUserById);
router.param("play",increasePlaysInAlbum);

router.get('/all',getAlbums);
router.get("/like/:userId/:albumId",addAlbumToLikes,likeAlbum);
router.get('/:albumId',getSongsInAlbum);
router.get('/photo/:albumId',albumCover);
router.get("/:albumId/:play",getSongsInAlbum);
module.exports=router;