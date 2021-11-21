import Icon from '@material-ui/core/Icon';
import { useContext } from 'react';
import { playerStatusContext, updatePlayerStatusContext } from './Layout'
import Player from './Player';

const QueueItem = ({songCoverUrl,songName,songArtist,songDuration,songId,isPlaying}) => {
    const playerStatus = useContext(playerStatusContext);
    const updatePlayerStatus = useContext(updatePlayerStatusContext);
    const playSong = (id) => {
        updatePlayerStatus({ ...playerStatus, isPlaying: playerStatus.id?!(playerStatus.id==id?playerStatus.isPlaying:false):true, showPlayer: true, id: id });
    }
    let playingStatus=playerStatus.id==songId?playerStatus.isPlaying:isPlaying;
    return (
        <div className={`grid grid-cols-12 gap-10 ${isPlaying?'bg-gray-900':''} p-2 mx-10 items-center w-11/12`}>
        <div className="col-span-1 text-gray-400 mr-3  active:text-gray-100"><Icon className="cursor-pointer" fontSize="large" onClick={()=>{playSong(songId)}} >{playingStatus ? 'pause' : 'play_arrow'}</Icon></div>
            <div className="cover-song col-span-5 flex items-center">
                <img src={songCoverUrl} alt="song cover" className="object-cover mr-6 song-image h-12 w-12" />
                <div className="Name block truncate overflow-ellipsis  text-lg font-bold text-gray-300">{songName}</div>
            </div>
            <div className="artist font-normal text-gray-400 col-span-3">{songArtist}</div>
            <div className="duration col-span-3 text-gray-400 flex justify-end"><div className="time">{songDuration}</div></div>
        </div>
    );
}

export default QueueItem;