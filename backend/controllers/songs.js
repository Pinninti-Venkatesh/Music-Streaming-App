const Songs = require("../models/songs");
const formidable = require('formidable');
const fs = require("fs");
const mm = require('music-metadata');
const { findAlbum, createAlbum } = require("./albums");
const logger = require("../logger/logger");
const util = require('util');
exports.addSong = (req, res) => {
    try {
        logger.info("inside add song request");
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            logger.info("files",files);
            const metadata= await mm.parseFile(files.file.path,{duration:true});
            console.log("metadata",util.inspect(metadata, { showHidden: false, depth: null }));
            let { common,format } = await mm.parseFile(files.file.path);
            // format=util.inspect(format, { showHidden: false, depth: null });
            console.log("music format metadata",format);
            console.log("music metadata",metadata);
            const cover = mm.selectCover(common.picture);
            logger.info("song cover:" + cover);
            // logger.info("song common:" + JSON.stringify(common));
            // console.log('cover', cover);
            // console.log('common', common);
            console.log("The song duration",format.duration);
            if (common.album) {
                // console.log("co")
                const album = await findAlbum(common.album);

                if (album) {
                    try {
                        logger.info("album found:" + album);
                        let newSong = {
                            name: common.title,
                            artist: common.artists.join(),
                            album: album._id,
                        };
                        let song = new songs(newSong);
                        song.photo.data = cover.data;
                        song.photo.contentType = cover.format;
                        song.file.data = fs.readFileSync(files.file.path);
                        song.file.contentType = files.file.type;
                        song.save((err, song) => {
                            if (err) {
                                logger.error("failed to create song:" + err);
                                return;
                            }
                            logger.info("song created:" + song._id);
                        });
                    } catch (error) {
                        logger.error("exception in creating song:" + error);
                    }
                } else {
                    logger.info("album not found creating new album");
                    let newAlbum = await createAlbum(common.album);
                    if (newAlbum) {
                        try {
                            logger.info("album created:" + newAlbum);
                            let newSong = {
                                name: common.title,
                                artist: common.artists.join(),
                                album: newAlbum._id,
                            };
                            let song = new songs(newSong);
                            song.photo.data = cover.data;
                            song.photo.contentType = cover.format;
                            song.file.data = fs.readFileSync(files.file.path);
                            song.file.contentType = files.file.type;
                            song.save((err, song) => {
                                if (err) {
                                    logger.error("failed to create song:" + err);
                                    return;
                                }
                                logger.info("song created:" + song._id);
                            });
                        } catch (error) {
                            logger.error("exception in creating song:" + error);
                        }

                    }
                }
            } else {
                try {
                    let newSong = {
                        name: common.title,
                        artist: common.artists.join(),
                    };
                    let song = new songs(newSong);
                    song.photo.data = cover.data;
                    song.photo.contentType = cover.format;
                    song.file.data = fs.readFileSync(files.file.path);
                    song.file.contentType = files.file.type;
                    song.save((err, song) => {
                        if (err) {
                            logger.error("failed to create song:" + err);
                            return;
                        }
                        logger.info("song created:" + song._id);
                    });
                } catch (error) {
                    logger.error("exception in creating song:" + error);
                }
            }

        });
    } catch (error) {
        logger.error("exception in add song:" + error);
    }

};

exports.getSongById = (req, res, next) => {
    try {
        Songs.findById({ _id: req.params.songId }).populate('album',["name"]).exec((err, song) => {
            if (!err && song) {
                req.song = song;
                next();
                return;
            } else if (!song) {
                return res.status(400).json({ err: "Song does not exist" });
            }
            logger.error("Error in getSongById:" + err);
            return res.status(500).json({ err: "Unknown error occured" });
        });
    } catch (error) {
        logger.error("exception in getSongById:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}

exports.getSong = (req, res) => {
    req.song.photo = undefined;
    req.song.file=undefined;
    req.song.likes=undefined;
    req.song.plays=undefined;
    return res.status(200).json(req.song);
}

exports.songCover = (req, res, next) => {
    if (req.song.photo.data) {
        res.set("Content-Type", req.song.photo.contentType);
        return res.send(req.song.photo.data);
    }
    else{
        return res.status(500).json({ error: "unknown error occured" });
    }
};

exports.likeSong = (req, res) => {
    try {
        Songs.findByIdAndUpdate({ _id: req.song._id }, { $inc: { likes: 1 } }, (err, song) => {
            if (!err && song) {
                return res.status(200).json({response:"success"});
            }
            else if (!song) {
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

let increasePlaysInSong = (id) => {
    try {
        Songs.findByIdAndUpdate({ _id: id }, { $inc: { plays: 1 } }, (err, song) => {
            if (err) {
                logger.error("Fialed to update plays in playlist:" + err);
            }
            logger.info("Plays updated for song:" + id);
        });
    } catch (error) {
        logger.error("exception in increasePlaysInPlayList:" + error);
    }
}

exports.playSong = (req, res, next) => {
    if (req.song.file.data) {
        increasePlaysInSong(req.song.id);
        res.set("Content-Type", req.song.file.contentType);
        return res.send(req.song.file.data);
    }
    else{
        return res.status(500).json({ error: "unknown error occured" });
    }
};

exports.getSongs = (req, res) => {
    const { limit } = req.query;
    try {
        Songs.find({},{name:1,artist:1,album:1}).limit(limit ? parseInt(limit) : 20).sort({ plays: -1 }).populate('album',["name"]).exec((err, songs) => {
            if(err){
                return res.status(500).json({"error":err});
            }
            if (!err && songs) {
                return res.status(200).json({ response: songs });
            }
            else if (!songs) {
                return res.status(400).json({ response: "There are no songs" });
            }
            return res.status(500).json({ error: "unknown error occured" });
        });
    } catch (error) {
        logger.error("exception in getSongs:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}