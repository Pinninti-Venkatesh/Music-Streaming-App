import Icon from '@material-ui/core/Icon';
import { React, Fragment } from "react";
import Player from './Player';
import Queue from './Queue';
import { useEffect, useContext } from 'react';
import { playerStatusContext, updatePlayerStatusContext } from './Layout'
import '../custom.css';
import Navbar from './Navbar';

function Base() {
    const playerStatus = useContext(playerStatusContext)
    const updatePlayerStatus = useContext(updatePlayerStatusContext)
    const hideQueue = () => {
        updatePlayerStatus({ ...playerStatus, hideQueue: !playerStatus.hideQueue });
    }
    console.log('loading base component');
    return (
        <Fragment>
            <Navbar></Navbar>
            <Queue playing={playerStatus.id} hideQueue={playerStatus.hideQueue} ></Queue>
            {playerStatus.showPlayer && <Player playerStatus={playerStatus} updatePlayerStatus={updatePlayerStatus} hideQueue={() => { hideQueue() }} />}
        </Fragment>
    );
}

export default Base;
