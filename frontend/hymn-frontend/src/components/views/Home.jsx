import { useState, useEffect } from 'react';
import '../../custom.css';
import { getAlbums, getSongs, getPlaylists } from '../../API/APICalls';
import CardList from '../CardsList';
import React from 'react';
import { API } from '../../API/API.js'
function Home() {
  const [homeList, sethomeList] = useState({ songs: [], albums: [], playlists: [] });
  const loadHome = () => {
    Promise.all([getSongs(), getAlbums(), getPlaylists()]).then((result) => {
      console.log('promise resolved', result);
      let homeListCopy = { songs: [], albums: [], playlists: [] };
      if (result[0]["response"]) {
        homeListCopy.songs = result[0].response.map(function (song) {
          song.imageUrl = `${API}song/photo/${song._id}`;
          return song;
        });
      }
      if (result[1]["response"]) {
        homeListCopy.albums = result[1].response.map(function (album) {
          album.imageUrl = `${API}album/photo/${album._id}`;
          return album;
        });
      }
      if (result[2]["response"]) {
        homeListCopy.playlists = result[2].response;
      }
      sethomeList(homeListCopy);
    });
  }
  useEffect(() => {
    loadHome();
  }, []);
  return (
    <div className="pt-12 min-h-screen">
      <CardList listName="Most Liked Songs" type="song" cardList={homeList.songs}></CardList>
      <CardList listName="Most Liked Albums" type="album" cardList={homeList.albums}></CardList>
      <CardList listName="Most Liked PlayLists" type="playlist" cardList={homeList.playlists}></CardList>
    </div>
  );
}

export default Home;
