const Playlists = require("../models/playlists");
const logger = require("../logger/logger");

exports.getPlaylistById = (req, res, next) => {
    Playlists.findById({ _id: req.params.playlistId }).exec((err, playlist) => {
        if (!err && playlist) {
            req.playlist = playlist;
            next();
        } else {
            logger.error("error in doesPlaylistExist:" + err);
            return res.status(400).json({ error: "playlist does not exist" });
        }
    });
}

exports.createPlaylist = (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(300).json({ response: 'name cannot be empty' });
        }
        const newPlaylist = new Playlists({ name: name });
        newPlaylist.save((err, playlist) => {
            if (!err && playlist) {
                return res.status(200).json(playlist);
            }
            console.log(typeof err);
            if (err.code == 11000) {
                return res.status(400).json({ error: "playlist name already exists" });
            }
            logger.error("error in createPlayList:" + err);
            return res.status(500).json({ error: "unknown error occured" });
        });

    } catch (error) {
        logger.error("exception in createPlayList:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}

exports.likePlaylist = (req, res) => {
    try {
        const id = req.params.playlistId;
        Playlists.findByIdAndUpdate({ _id: id }, { $inc: { likes: 1 } }, (err, playlist) => {
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



exports.addSongInPlayList = (req, res) => {
    try {
        const songId = req.params.songId;
        const id = req.params.playlistId;
        Playlists.findByIdAndUpdate({ _id: id }, { $push: { songs: songId } }, (err, playlist) => {
            if (!err && playlist) {
                return res.status(200).json(playlist);
            }
            logger.error("error in addSongInPlayList:" + err);
            return res.status(500).json({ error: "unknown error occured" });
        });
    } catch (error) {
        logger.error("exception in addSongInPlayList:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}

exports.getPlaylist = (req, res) => {
    try {
        const { playlistId, play } = req.params;
        Playlists.findById({ _id: playlistId }, { name: 1, songs: 1 }).populate('songs', ["_id", "name", "artist"]).exec((err, playlist) => {
            if (!err && playlist) {
                if (play) {
                    increasePlaysInPlaylist(playlistId);
                }
                return res.status(200).json(playlist);
            }
            logger.error("error in getPlayList:" + err);
            return res.status(500).json({ error: "unknown error occured" });
        });
    } catch (error) {
        logger.error("exception in addSongInPlayList:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}

let increasePlaysInPlaylist = (id) => {
    try {
        Playlists.findByIdAndUpdate({ _id: id }, { $inc: { plays: 1 } }, (err, playlist) => {
            if (!err && playlist) {
                logger.info("Plays updated for playlist:" + id);
            }
            logger.error("Fialed to update plays in playlist:" + err);
        });
    } catch (error) {
        logger.error("exception in increasePlaysInPlayList:" + error);
    }
}

exports.getPlaylists = (req, res) => {
    const { limit } = req.query;
    try {
        Playlists.find().limit(limit ? limit : 20).sort({ plays: -1 }).exec((err, playlist) => {
            if (!err && playlist) {
                return res.status(200).json({ response: playlist });
            }
            else if (!playlist) {
                return res.status(400).json({ response: "There are no playlists" });
            }
            return res.status(500).json({ error: "unknown error occured" });
        });
    } catch (error) {
        logger.error("exception in getPlaylists:" + error);
        return res.status(500).json({ error: "unknown error occured" });
    }
}