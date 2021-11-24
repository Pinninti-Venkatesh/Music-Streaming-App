const Albums = require("../models/albums");
const logger = require("../logger/logger");
const Songs = require("../models/songs");
var ObjectId = require('mongoose').Types.ObjectId;

exports.createAlbum = (name) => {
    let newAlbum = {
        name: name,
        likes: 0,
        plays: 0
    };
    let album = new Albums(newAlbum);
    return new Promise((resolve, reject) => {
        album.save((err, album) => {
            if (!err) {
                logger.info('album created:' + album);
                if (process.env.MODE == "debug") {
                    resolve(album);
                }
            }
            resolve(false);
            logger.error('failed to create album:' + err);
        });
    });
};

exports.findAlbum = (name) => {
    return new Promise((resolve, reject) => {
        logger.info("album to be found:" + name);
        Albums.findOne({ name: name }).exec((err, album) => {
            console.log("album", album);
            console.log("album type", typeof album);
            if (err || !album) {
                logger.error("error in finding album or album does not exist:" + err + ":" + album);
                resolve(false);
            } else {
                logger.info("album with given name is found");
                resolve(album);
            }
        });
    });
}

exports.getSongsInAlbum = (req, res) => {
    const { albumId, play } = req.params;
    Songs.find({ album: new ObjectId(req.album._id) }).select({ name: 1, artist: 1 }).exec((err, album) => {
        if (!err && album.length > 0) {
            return res.status(200).json({ response: album });
        }
        logger.error("error in getSongsInAlbum:" + err);
        return res.status(500).json({ response: "Unknown Error occured" });
    });
}

exports.getAlbumById = (req, res, next) => {
    // console.log('albumId', req.params);
    Albums.findById({ _id: req.params.albumId }).exec((err, album) => {
        if (!err) {
            req.album = album;
        }
        if (!album) {
            return res.status(400).json({ response: "Album does not exist" });
        }
        next();
    });
}

exports.likeAlbum = (req, res) => {
    try {
        const id = req.album._id;
        Albums.findByIdAndUpdate({ _id: id }, { $inc: { likes: 1 } }, (err, playlist) => {
            if (!err && playlist) {
                return res.status(200).json(playlist);
            }
            else if (!playlist) {
                return res.status(400).json({ error: "playlist does not exist" });
            }
            logger.error("error in likePlayList:" + err);
            return res.status(500).json({ error: "unknown error occured" });
        });
    } catch (error) {
        logger.error("exception in createPlayList:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}

exports.increasePlaysInAlbum = (req, res, next) => {
    try {
        logger.info("Playsfor album:" +req.params);
        Albums.findByIdAndUpdate({ _id: req.params.albumId }, { $inc: { plays: 1 } }, (err, album) => {
            if (err) {
                logger.error("Fialed to update plays in album:" + err);
            }
            logger.info("Plays updated for album:" + album._id);
            next();
        });
    } catch (error) {
        logger.error("exception in increasePlaysInPlayList:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}

exports.getAlbums = (req, res, next) => {
    const { limit } = req.query;
    try {
        Albums.find().limit(limit ? limit : 20).sort({ plays: -1 }).exec((err, album) => {
            if (!err && album) {
                return res.status(200).json({ response: album });
            }
            else if (!album) {
                return res.status(400).json({ response: "There are no albums" });
            }
            return res.status(500).json({ error: "unknown error occured" });
        });
    } catch (error) {
        logger.error("exception in getAlbums:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}

exports.albumCover = (req, res) => {
    Songs.find({ album: req.params.albumId }).limit(1).exec((err, song) => {
        if (!err && song.length > 0) {
            // console.log('found the song', song);
            let songId = song[0]._id;
            Songs.findById({ _id: songId }).exec((err, song) => {
                if (!err && song) {
                    if (song.photo.data) {
                        res.set("Content-Type", song.photo.contentType);
                        return res.send(song.photo.data);
                    }
                    else {
                        return res.status(404).json({ error: "image does not exist" });
                    }
                }
                return res.status(500).json({ err: "Unknown error occured" });
            });
        } else {
            return res.status(404).json({ err: "No songs in album" });
        }
    })
};