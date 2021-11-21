import { useState, useEffect, useContext } from "react";
import { getAlbum } from "../../API/APICalls";
import { playerStatusContext, updatePlayerStatusContext } from "../Layout";
import Icon from "@material-ui/core/Icon";
import { API } from "../../API/API.js";
import QueueItem from "../QueueItem";
const queryString = require("query-string");

const ListView = ({ match, location }) => {
  let backupImage =
    "https://img.freepik.com/free-vector/elegant-musical-notes-music-chord-background_1017-20759.jpg?size=338&ext=jpg";
  const parsed = queryString.parse(location.search);
  const playerStatus = useContext(playerStatusContext);
  const updatePlayerStatus = useContext(updatePlayerStatusContext);
  const [listState, setlistState] = useState({
    name: "",
    type: "",
    id: "",
    list: [],
  });
  useEffect(() => {
    if (match.params.type == "album") {
      getAlbum(match.params.listId).then((res) => {
        res = res.response.map(function (album) {
          album.imageUrl = `${API}song/photo/${album._id}`;
          return album;
        });
        setlistState({
          name: parsed.name,
          id: match.params.listId,
          type: match.params.type,
          list: res,
        });
      });
    }
  }, []);
  const playSong = (event) => {
    event.preventDefault();
    if (listState.type == "album") {
      getAlbum(listState.id).then((res) => {
        res = res.response;
        updatePlayerStatus({
          ...playerStatus,
          isPlaying: true,
          showPlayer: true,
          id: res[0]._id,
        });
        localStorage.setItem("song-queue", JSON.stringify(res));
      });
    }
  };
  const addToQueue = (next) => {
    if (listState.type == "album") {
      getAlbum(listState.id).then((res) => {
        res = res.response;
        var songs = localStorage.getItem("song-queue");
        songs = songs != null ? JSON.parse(songs) : [];
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
  let imageurl = `${API}${listState.type}/photo/${listState.id}`;
  const [optionsVisibility, setoptionsVisibility] = useState(false);
  return (
    <div className="bg-gradient-to-b to-blue-dark from-black-darkest min-h-screen pt-12">
      <div className="h-44 text-3xl font-bold  text-gray-50 p-4 m-8 flex items-center">
        <img
          src={imageurl ? imageurl : backupImage}
          className={
            " rounded-sm my-4 shadow-md h-full transform group-hover:opacity-70"
          }
          alt=""
        />
        <div className="ml-16 flex flex-col justify-start items-start self-end">
          <div>
            <span>{listState.name}</span>
            <span className="h-3 w-3 rounded-full bg-white inline-block mx-4"></span>
            <span>{listState.type}</span>
          </div>
          <div className="flex mt-8 ">
            <div
              className="flex items-center text-base bg-gray-50 w-min px-2 py-1  rounded"
              onClick={playSong}
            >
              <Icon
                className={"inline text-black-darkest cursor-pointer"}
                fontSize="medium"
              >
                play_arrow
              </Icon>
            </div>
            <div
              className="relative w-32"
              onMouseLeave={() => setoptionsVisibility(false)}
            >
              <Icon
                className={
                  "text-gray-50 z-10  cursor-pointer transform scale-75 transition group-hover:opacity-100 group-hover:shadow-xl"
                }
                fontSize="large"
                onMouseEnter={() => setoptionsVisibility(true)}
              >
                more_vert
              </Icon>
              <div
                className={
                  " absolute top-px left-1/4  text-base w-max z-50 left-4 top-14 bg-gray-800 py-4 " +
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
          </div>
        </div>
      </div>
      <div className="flex flex-wrap m-16 even:w-full">
        {listState.list.map((song) => {
          const isPlaying = playerStatus.id == song._id;
          // return <AudioCard type="song" songId={obj._id} imageurl={obj.imageUrl} songName={obj.name} songArtist={obj['artist']} ></AudioCard>
          return (
            <QueueItem
              key={song._id}
              songId={song._id}
              songCoverUrl={"http://localhost:8080/song/photo/" + song._id}
              songName={song.name}
              songArtist={song.artist}
              isPlaying={isPlaying}
              songDuration="00:00"
            />
          );
        })}
      </div>
    </div>
  );
};

export default ListView;
