import Icon from '@material-ui/core/Icon';
import React, { Component, createRef } from 'react'
import { playerStatusContext, updatePlayerStatusContext } from './Layout'
class Player extends Component {

    constructor(props) {
        super(props);
        this.audioElement = createRef();
        this.audioSeeker = createRef();
        this.playerStatus = playerStatusContext;
        this.updatePlayerStatus = updatePlayerStatusContext;
        this.state = {
            songId: '',
            songUrl: 'http://localhost:8080/song/play/60f281a57ad3ad5100ae19ab',
            songName: 'Fake Fine',
            songDetails: 'Robert Grace',
            songCoverUrl: 'https://img.freepik.com/free-vector/elegant-musical-notes-music-chord-background_1017-20759.jpg?size=338&ext=jpg',
            isPlaying: props.playerStatus.isPlaying,
            shouldRepeat: false,
            isLiked: false,
            volume: 10,
            songCurrent: 0,
            // audioDuration:0,
        }
    }
    componentDidMount() {
        console.log("component mounted");
        this.loadComponent();
    }
    componentDidUpdate(prevProps) {
        console.log('checking if player component is updated')
        console.log('current song id',this.props.playerStatus.id);
        console.log('prev song id',prevProps.playerStatus.id);
        if (this.props.playerStatus.id != prevProps.playerStatus.id&&this.props.songCurrent==this.props.songCurrent) {
            this.loadComponent();
        }
        else if(this.props.playerStatus.isPlaying!=prevProps.playerStatus.isPlaying){
            this.pausePlaySongFromParent();
        }
    }
    // shouldComponentUpdate(){

    // }
    loadComponent = () => {
        console.log('loading player component');
        fetch("http://localhost:8080/song/" + this.props.playerStatus.id).then(res => res.json()).then((result) => {
            console.log('compdidmount', result);
            console.log('props Id', this.props.playerStatus.id);
            this.setState({ songId: result._id, songUrl: "http://localhost:8080/song/play/" + result._id, songName: result.name, songDetails: result.artist, isPlaying: true, songCoverUrl: "http://localhost:8080/song/photo/" + result._id }, () => {
                this.audioElement.current.load();
                this.audioElement.current.play();
            });
            // const audioElement=document.getElementById("audio-player")
            this.audioElement.current.addEventListener('ended', (event) => {
                this.autoPlayNext();
            });
            this.audioElement.current.addEventListener("canplay", () => {
                this.setSongDuraionEnd()
            });
            this.audioElement.current.addEventListener("timeupdate", () => {
                let currentTime = Math.round(parseInt(this.audioElement.current.currentTime));
                this.audioSeeker.current.value = currentTime;
                let s = currentTime % 60;
                let m = (parseInt(currentTime / 60) % 60);
                let timeline = document.getElementById('song-duration-current');
                if (s < 10) {
                    timeline.innerHTML = m + ':0' + s;
                }
                else {
                    timeline.innerHTML = m + ':' + s;
                }
            }, false);
            document.body.onkeyup = (e) => {
                if (e.keyCode == 32) {
                    this.pausePlaySong();
                }
            }
        });
    }
    likeSong = (event) => {
        event.stopPropagation();
        this.setState({ "isLiked": !this.state.isLiked });
    }
    setSongDuraionEnd = () => {
        let audioDuration = this.audioElement.current.duration;
        // const audioSeeker=document.getElementById("audio-seeker");
        this.audioSeeker.current.max = audioDuration;
        let totalDuration = (parseInt(audioDuration / 60) % 60) + ":" + (parseInt(audioDuration % 60) < 10 ? "0" + parseInt(audioDuration % 60) : parseInt(audioDuration % 60));
        let durationEnd = document.getElementById('song-duration-end');
        durationEnd.innerHTML = totalDuration;
    }
    repeatSong = (event) => {
        event.stopPropagation();
        this.setState({ shouldRepeat: !this.state.shouldRepeat });
    }

    shuffleSongs = (event) => {
        event.stopPropagation();
        var songs = localStorage.getItem("song-queue");
        songs = JSON.parse(songs);
        songs.sort(() => Math.random() - 0.5);
        localStorage.setItem("song-queue", JSON.stringify(songs));
    }

    pausePlaySong = (event) => {
        event.stopPropagation();
        if (this.audioElement.current.paused) {
            this.setState({ isPlaying: true });
            this.audioElement.current.play();
        } else {
            this.setState({ isPlaying: false });
            this.audioElement.current.pause();
        }
    }
    pausePlaySongFromParent =()=>{
        console.log('pausing song/playing song')
        if (this.audioElement.current.paused) {
            this.audioElement.current.play();
        } else {
            this.audioElement.current.pause();
        }
    }
    autoPlayNext = () => {
        var songs = localStorage.getItem("song-queue");
        songs = JSON.parse(songs);
        if (this.state.shouldRepeat) {
            this.audioElement.current.pause();
            this.audioElement.current.load();
            this.audioElement.current.play();
            return;
        }
        songs.every((song, index) => {
            if (song._id == this.state.songId) {
                if (index + 1 < songs.length) {
                    this.playSong(songs[index + 1]._id);
                    return false;
                } else {
                    this.playSong(songs[0]._id);
                    return false;
                }
            }
            return true;
        });
    }
    playNext = (event) => {
        console.log('event', event);
        event.stopPropagation();
        var songs = localStorage.getItem("song-queue");
        songs = JSON.parse(songs);
        songs.every((song, index) => {
            if (song._id == this.state.songId) {
                if (index + 1 < songs.length) {
                    this.playSong(songs[index + 1]._id);
                    return false;
                } else {
                    this.playSong(songs[0]._id);
                    return false;
                }
            }
            return true;
        });
    }
    playPrev = (event) => {
        console.log('event', event);
        event.stopPropagation();
        var songs = localStorage.getItem("song-queue");
        songs = JSON.parse(songs);
        songs.every((song, index) => {
            if (song._id == this.state.songId) {
                if (index - 1 >= 0) {
                    this.playSong(songs[index - 1]._id);
                    return false;
                }
            }
            return true;
        });
    }
    playSong = (id) => {
        this.props.updatePlayerStatus({ ...this.props.playerStatus, isPlaying:true, showPlayer: true, id: id });
    }
    audioChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({ volume: event.target.value });
        this.audioElement.current.volume = event.target.value / 10;
    }
    songDurationChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
        // this.setState({ songCurrent: event.target.value });
        this.audioSeeker.current.value=event.target.value;
        this.audioElement.current.currentTime = event.target.value;
    }
    stopEventPropogation = (event) => {
        event.stopPropagation();
    }
    render() {
        let playingStatus=this.props.playerStatus.isPlaying?this.state.isPlaying:false
        return (
            <div className="w-screen fixed bottom-0 h-100 bg-gray-900 z-50" onClick={() => {
                this.props.hideQueue();
            }}>
                <input type="range" min="0" max="100" value="0" ref={this.audioSeeker} onChange={this.songDurationChange} onClick={this.stopEventPropogation} className="absolute w-screen h-1 bg-gray-700" id="audio-seeker"></input>
                <audio controls id="audio-player" ref={this.audioElement} className="hidden top-0">
                    <source src={this.state.songUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                <div className="flex justify-between items-center p-3">
                    <div className="options hidden sm:flex  justify-between">
                        <Icon className="text-gray-400 mr-2 cursor-pointer" onClick={this.shuffleSongs}>shuffle</Icon>
                        <Icon className="text-gray-400 mr-2 cursor-pointer" onClick={this.repeatSong} >{this.state.shouldRepeat ? "repeat_one" : "repeat"}</Icon>
                        <Icon className="text-primary mr-2 cursor-pointer" onClick={this.likeSong}>{this.state.isLiked ? "favorite" : "favorite_border"}</Icon>
                        <Icon className="text-gray-400 mr-2 cursor-pointer">{this.state.volume < 1 ? "volume_off" : this.state.volume < 6 ? "volume_down" : "volume_up"}volume_up</Icon>
                        <div className="inline h-6 flex items-center">
                            <input type="range" min="0" max="10" value={this.state.volume} onChange={this.audioChange} onClick={this.stopEventPropogation} className="volume-slider" id="slider"></input>
                        </div>
                    </div>
                    <div className="song-info flex">
                        <img src={this.state.songCoverUrl} alt="song cover" className="object-cover mr-6 song-image h-12 w-12" />
                        <div className="song-data">
                            <div className="name block truncate overflow-ellipsis w-48 text-lg font-bold text-gray-300">{this.state.songName}</div>
                            <div className="artist block truncate overflow-ellipsis w-48 w-48 text-md text-gray-400">{this.state.songDetails}</div>
                        </div>
                    </div>
                    <div className="controls flex h-12 justify-center items-center">
                        <div className=" hidden sm:inline show-time mr-3 text-sm text-gray-400" id="song-duration"><span id="song-duration-current">0:00</span>/<span id="song-duration-end">0:00</span></div>
                        <Icon className="text-gray-400 mr-3 active:text-gray-100 cursor-pointer" fontSize="small" onClick={this.playPrev} >skip_previous</Icon>
                        <Icon className="text-gray-400 mr-3 active:text-gray-100 cursor-pointer" fontSize="large" onClick={(event) => { this.pausePlaySong(event); }}>{this.state.isPlaying? 'pause' : 'play_arrow'}</Icon>
                        <Icon className="text-gray-400 mr-3 active:text-gray-100 cursor-pointer" fontSize="small" onClick={this.playNext} >skip_next</Icon>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player;