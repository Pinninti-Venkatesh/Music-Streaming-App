import React from "react";
import Base from "../components/Base";
import { useState, useEffect } from "react";
export const playerStatusContext = React.createContext();
export const updatePlayerStatusContext = React.createContext();
export default function Layout({ children }) {
  const [isPlayerRunning, setisPlayerRunning] = useState({
    isPlaying: false,
    id: "",
    hideQueue: true,
    showPlayer: false,
  });
  let updatePlayer = (playerStatus) => {
    setisPlayerRunning(playerStatus);
  };
  return (
    <div className="w-100 bg-black-darkest">
      <playerStatusContext.Provider value={isPlayerRunning}>
        <updatePlayerStatusContext.Provider value={updatePlayer}>
          <Base></Base>
          {children}
        </updatePlayerStatusContext.Provider>
      </playerStatusContext.Provider>
    </div>
  );
}
