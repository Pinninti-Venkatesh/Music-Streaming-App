import React from "react";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import { playerStatusContext, updatePlayerStatusContext } from "./Layout";
import { useContext, useState } from "react";
import { getAlbum } from "../API/APICalls";
const AudioCard = ({ type, songId, imageurl, songName, songArtist }) => {
  let isPlaying = false;
  let backupImage =
    "https://img.freepik.com/free-vector/elegant-musical-notes-music-chord-background_1017-20759.jpg?size=338&ext=jpg";
  const playerStatus = useContext(playerStatusContext);
  const updatePlayerStatus = useContext(updatePlayerStatusContext);
  const playSong = (event) => {
    console.log("event", event);
    event.preventDefault();
    const id = songId;
    console.log("playing song");
    if (type == "song") {
      updatePlayerStatus({
        ...playerStatus,
        isPlaying: playerStatus.id
          ? !(playerStatus.id == id ? playerStatus.isPlaying : false)
          : true,
        showPlayer: true,
        id: id,
      });
      let songObject = {
        artist: songArtist,
        name: songName,
        _id: songId,
      };
      var songs = localStorage.getItem("song-queue");
      songs = songs != null ? JSON.parse(songs) : [];
      songs.push(songObject);
      localStorage.setItem("song-queue", JSON.stringify(songs));
    } else if (type == "album") {
      getAlbum(id, "play").then((res) => {
        res = res.response;
        updatePlayerStatus({
          ...playerStatus,
          isPlaying: playerStatus.id
            ? !(playerStatus.id == id ? playerStatus.isPlaying : false)
            : true,
          showPlayer: true,
          id: res[0]._id,
        });
        localStorage.setItem("song-queue", JSON.stringify(res));
      });
    }
  };
  const addToQueue = (next) => {
    if (type == "song") {
      let songObject = {
        artist: songArtist,
        name: songName,
        _id: songId,
      };
      var songs = localStorage.getItem("song-queue");
      songs = JSON.parse(songs);
      if (next) {
        songs.find((obj, i) => {
          if (obj._id == playerStatus.id) {
            songs.splice(i + 1, 0, songObject);
          }
        });
      } else {
        songs.push(songObject);
      }
      localStorage.setItem("song-queue", JSON.stringify(songs));
      setoptionsVisibility(false);
    } else if (type == "album") {
      getAlbum(songId, "").then((res) => {
        res = res.response;
        var songs = localStorage.getItem("song-queue");
        songs = JSON.parse(songs);
        if (next) {
          songs.find((obj, i) => {
            if (obj._id == playerStatus.id) {
              songs.splice(i + 1, 0, ...res);
            }
          });
        } else {
          songs.push(...res);
        }
        localStorage.setItem("song-queue", JSON.stringify(songs));
        setoptionsVisibility(false);
      });
    }
  };
  let playingStatus =
    playerStatus.id == songId ? playerStatus.isPlaying : isPlaying;
  const [optionsVisibility, setoptionsVisibility] = useState(false);
  const link =
    type == "song" ? "/" : "/list/" + type + "/" + songId + "?name=" + songName;
  const iconPositioning =
    type == "song"
      ? "top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4"
      : "bottom-4 right-4";
  return (
    <div className="w-52 mr-8">
      <Link
        className="block group image relative hover:opacity-1 cursor-pointer"
        to={link}
      >
        <Icon
          className={
            (playingStatus ? "opacity-100" : "opacity-0") +
            " absolute z-10 " +
            iconPositioning +
            " cursor-pointer text-primary  transition group-hover:opacity-100 scale-150 group-hover:shadow-xl transform hover:scale-175"
          }
          onClick={playSong}
        >
          <span className="rounded-full bg-white bg-opacity-90 hover:bg-opacity-100">
            {playingStatus ? "pause" : "play_arrow"}
          </span>
        </Icon>
        <div
          className="options absolute z-10 w-full top-3"
          onMouseLeave={() => setoptionsVisibility(false)}
        >
          <Icon
            className={
              (playingStatus ? "opacity-100" : "opacity-0") +
              " text-gray-100 z-10 cursor-pointer transform scale-75 transition group-hover:opacity-100 group-hover:shadow-xl"
            }
            fontSize="large"
            onMouseEnter={() => setoptionsVisibility(true)}
          >
            more_vert
          </Icon>
          <div
            className={
              "w-full z-50 left-4 top-14 bg-gray-800 py-4 " +
              (optionsVisibility ? "" : "hidden")
            }
          >
            <div
              className="text-gray-100 flex items-center cursor-pointer p-2 bg-gray-800 hover:bg-gray-900"
              onClick={() => {
                addToQueue(true);
              }}
            >
              <Icon className="inline transform scale-90" fontSize="large">
                playlist_play
              </Icon>
              <span className="pl-4">Play Next</span>
            </div>
            <div
              className="text-gray-100 flex items-center cursor-pointer p-2 bg-gray-800 hover:bg-gray-900"
              onClick={() => {
                addToQueue(false);
              }}
            >
              <Icon className="inline transform scale-90" fontSize="large">
                queue_music
              </Icon>
              <span className="pl-4">Add To Queue</span>
            </div>
            <div className="text-gray-100 flex items-center cursor-pointer p-2 bg-gray-800 hover:bg-gray-900">
              <Icon className="inline transform scale-75" fontSize="large">
                library_add
              </Icon>
              <span className="pl-4">Add to Library</span>
            </div>
          </div>
        </div>
        <img
          src={imageurl ? imageurl : backupImage}
          className={
            (playingStatus ? "opacity-70" : "") +
            " rounded-sm my-4 shadow-md transform group-hover:opacity-70"
          }
          alt=""
        />
      </Link>
      <div className="block truncate overflow-ellipsis w-44 text-lg font-bold text-gray-300">
        {songName}
      </div>
      <div className="block truncate overflow-ellipsis w-44 text-md text-gray-400">
        {songArtist}
      </div>
    </div>
  );
};

export default AudioCard;
