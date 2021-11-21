import QueueItem from './QueueItem';
import React, { Component } from 'react';
class Queue extends Component {
    state = {}
    render() {
        let songsQueue = localStorage.getItem("song-queue");
        if(songsQueue){
            songsQueue = JSON.parse(songsQueue);
        }
        return (
            <div className={`transition-all duration-300 ease-in-out w-screen overflow-scroll fixed top-12 bottom-12 h-screen bg-black-darkest z-50 ${this.props.hideQueue?'top-down':''}`}>
            { 
                songsQueue&&
                songsQueue.map(song=>{
                    let isPlaying=this.props.playing==song._id;
                    return <QueueItem key={song._id} songId={song._id} songCoverUrl={ "http://localhost:8080/song/photo/" + song._id} songName={song.name} songArtist={song.artist} isPlaying={isPlaying} songDuration="00:00"/>
                })
            }
            </div>
        );
    }
}

export default Queue;
